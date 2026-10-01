import { execFileSync } from "node:child_process";

const baseRef = process.env.ATLAS_MEDIA_BASE_REF || "origin/main";
const target = "src/shared/switchProductImages.ts";

let diff = "";
try {
  diff = execFileSync("git", ["diff", "--unified=0", `${baseRef}...HEAD`, "--", target], { encoding: "utf8" });
} catch (error) {
  console.error(`Unable to diff ${target} against ${baseRef}: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(2);
}

const addedUrls = [...diff.matchAll(/^\+\s*url:\s*"([^"]+)"/gm)].map(match => match[1]);
const urls = [...new Set(addedUrls)];

if (!urls.length) {
  console.log("Remote switch media probe: no added or changed pinned image URLs.");
  process.exit(0);
}

function matchesImageSignature(contentType, bytes) {
  const type = contentType.split(";")[0].trim().toLowerCase();
  const ascii = (start, end) => String.fromCharCode(...bytes.slice(start, end));
  if (type === "image/png") return bytes.length >= 8 && bytes[0] === 0x89 && ascii(1, 4) === "PNG";
  if (type === "image/jpeg" || type === "image/jpg") return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (type === "image/webp") return bytes.length >= 12 && ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP";
  if (type === "image/gif") return bytes.length >= 6 && ["GIF87a", "GIF89a"].includes(ascii(0, 6));
  if (type === "image/avif") return bytes.length >= 12 && ascii(4, 8) === "ftyp" && ["avif", "avis"].includes(ascii(8, 12));
  return type.startsWith("image/");
}

async function readPrefix(response, maxBytes = 64) {
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

async function probe(url) {
  let lastError = "unknown error";
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url, {
        redirect: "follow",
        headers: { "user-agent": "Atlas media verifier/1.0" },
        signal: AbortSignal.timeout(20_000),
      });
      const contentType = response.headers.get("content-type") ?? "";
      if (!response.ok || !contentType.toLowerCase().startsWith("image/")) {
        lastError = `HTTP ${response.status}, content-type ${contentType || "(none)"}`;
        await response.body?.cancel();
        if (response.status === 429 || response.status >= 500) {
          await new Promise(resolve => setTimeout(resolve, 750 * attempt));
          continue;
        }
        return { ok: false, url, error: lastError };
      }
      const prefix = await readPrefix(response);
      if (prefix.length < 8 || !matchesImageSignature(contentType, prefix)) {
        return { ok: false, url, error: `invalid binary signature for ${contentType}` };
      }
      return { ok: true, url, contentType: contentType.split(";")[0] };
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
      if (attempt < 3) await new Promise(resolve => setTimeout(resolve, 750 * attempt));
    }
  }
  return { ok: false, url, error: lastError };
}

const results = [];
let next = 0;
async function worker() {
  while (next < urls.length) {
    const url = urls[next++];
    results.push(await probe(url));
  }
}
await Promise.all(Array.from({ length: Math.min(4, urls.length) }, () => worker()));

const failures = results.filter(result => !result.ok);
for (const result of results) {
  if (result.ok) console.log(`PASS remote switch media: ${result.contentType} · ${result.url}`);
  else console.error(`FAIL remote switch media: ${result.url} · ${result.error}`);
}

if (failures.length) {
  console.error(`Remote switch media probe failed for ${failures.length}/${urls.length} changed URL(s).`);
  process.exit(1);
}
console.log(`Remote switch media probe PASS: ${urls.length}/${urls.length} changed URL(s) returned valid image responses.`);
