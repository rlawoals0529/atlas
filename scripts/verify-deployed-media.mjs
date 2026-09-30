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
const imageRegistry = fs.readFileSync(path.join(root, "src/shared/productImages.ts"), "utf8");
const explicitImageIds = new Set([...imageRegistry.matchAll(/^\s*"([^"]+)":\s*\{/gm)].map(match => match[1]));

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

async function worker() {
  while (nextIndex < probes.length) {
    const probe = probes[nextIndex++];
    try {
      if (probe.explicit) {
        console.log(`PASS registry: ${probe.type} ${probe.id} (pinned manufacturer asset)`);
        continue;
      }
      const response = await fetch(`${base}/api/media/${probe.id}`, { redirect: "follow", signal: AbortSignal.timeout(20_000) });
      const contentType = response.headers.get("content-type") ?? "";
      if (!response.ok || !contentType.startsWith("image/")) {
        failures.push(`${probe.id} (${probe.label}): HTTP ${response.status}, content-type ${contentType || "(none)"}`);
      } else {
        console.log(`PASS fallback: ${probe.type} ${probe.id} (${contentType})`);
      }
      await response.body?.cancel();
    } catch (error) {
      failures.push(`${probe.id} (${probe.label}): ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

await Promise.all(Array.from({ length: Math.min(4, probes.length) }, () => worker()));

if (failures.length) {
  console.error(`Product media smoke test failed for ${failures.length}/${probes.filter(probe => !probe.explicit).length} official-source fallback products:`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

const explicitCount = probes.filter(probe => probe.explicit).length;
console.log(`Product media smoke test PASS: ${explicitCount} products use pinned manufacturer assets; ${probes.length - explicitCount} official-source fallbacks returned image responses.`);
