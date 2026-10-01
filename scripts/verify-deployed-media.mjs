import fs from "node:fs";
import path from "node:path";

const base = process.argv[2]?.replace(/\/$/, "");
if (!base) {
  console.error("Usage: node scripts/verify-deployed-media.mjs <base-url>");
  process.exit(2);
}

const root = process.cwd();
const dataDir = path.join(root, "data");
const shardNames = fs.readdirSync(dataDir).filter(name => /^catalog.*\.json$/.test(name));
const imageRegistries = [
  fs.readFileSync(path.join(root, "src/shared/productImages.ts"), "utf8"),
  fs.readFileSync(path.join(root, "src/shared/switchProductImages.ts"), "utf8"),
].join("\n");
const explicitImageIds = new Set([...imageRegistries.matchAll(/^\s*"([^"]+)":\s*\{/gm)].map(match => match[1]));

const probes = [];
for (const name of shardNames) {
  const shard = JSON.parse(fs.readFileSync(path.join(dataDir, name), "utf8"));
  for (const key of ["mice", "keyboards", "switches"]) {
    for (const product of shard[key] ?? []) {
      if (product.status === "discontinued") continue;
      probes.push({ id: product.id, type: product.type, label: `${product.brand} ${product.model}`, explicit: explicitImageIds.has(product.id) });
    }
  }
}

const failures = [];
let nextIndex = 0;

function matchesImageSignature(contentType, bytes) {
  const type = contentType.split(";")[0].trim().toLowerCase();
  const ascii = (start, end) => String.fromCharCode(...bytes.slice(start, end));
  if (type === "image/png") return bytes.length >= 8 && bytes[0] === 0x89 && ascii(1, 4) === "PNG";
  if (type === "image/jpeg" || type === "image/jpg") return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (type === "image/webp") return bytes.length >= 12 && ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP";
  if (type === "image/gif") return bytes.length >= 6 && ["GIF87a", "GIF89a"].includes(ascii(0, 6));
  if (type === "image/avif") return bytes.length >= 12 && ascii(4, 8) === "ftyp" && ["avif", "avis"].includes(ascii(8, 12));
  // Other image/* types are uncommon in the current registry. Content-Type remains
  // the fallback check so adding a valid future format does not break deploys.
  return type.startsWith("image/");
}

async function readImagePrefix(response, maxBytes = 64) {
  if (!response.body) return new Uint8Array();
  const reader = response.body.getReader();
  const chunks = [];
  let length = 0;
  try {
    while (length < maxBytes) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value?.length) continue;
      chunks.push(value);
      length += value.length;
    }
  } finally {
    try { await reader.cancel(); } catch {}
  }
  const merged = new Uint8Array(Math.min(length, maxBytes));
  let offset = 0;
  for (const chunk of chunks) {
    const remaining = merged.length - offset;
    if (remaining <= 0) break;
    const slice = chunk.subarray(0, remaining);
    merged.set(slice, offset);
    offset += slice.length;
  }
  return merged;
}

async function worker() {
  while (nextIndex < probes.length) {
    const probe = probes[nextIndex++];
    try {
      const response = await fetch(`${base}/api/media/${probe.id}`, { redirect: "follow", signal: AbortSignal.timeout(20_000) });
      const contentType = response.headers.get("content-type") ?? "";
      if (!response.ok || !contentType.startsWith("image/")) {
        failures.push(`${probe.id} (${probe.label}): HTTP ${response.status}, content-type ${contentType || "(none)"}`);
        await response.body?.cancel();
      } else {
        const prefix = await readImagePrefix(response);
        if (prefix.length < 8 || !matchesImageSignature(contentType, prefix)) {
          failures.push(`${probe.id} (${probe.label}): invalid binary signature for ${contentType || "(none)"}`);
        } else {
          console.log(`PASS media: ${probe.type} ${probe.id} (${probe.explicit ? "pinned" : "resolved"} · ${contentType} · signature OK)`);
        }
      }
    } catch (error) {
      failures.push(`${probe.id} (${probe.label}): ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

await Promise.all(Array.from({ length: Math.min(4, probes.length) }, () => worker()));

if (failures.length) {
  console.error(`Product media smoke test failed for ${failures.length}/${probes.length} current/announced input-hardware products:`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

const explicitCount = probes.filter(probe => probe.explicit).length;
console.log(`Product media smoke test PASS: all ${probes.length} current/announced mice, keyboards and switches returned image responses (${explicitCount} pinned assets; ${probes.length - explicitCount} official-source resolutions).`);
