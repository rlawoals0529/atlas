import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dataDir = path.join(root, "data");
const shardNames = fs.readdirSync(dataDir).filter(name => /^catalog.*\.json$/.test(name));
const imageRegistry = fs.readFileSync(path.join(root, "src/shared/productImages.ts"), "utf8");
const explicitImageIds = new Set([...imageRegistry.matchAll(/^\s*"([^"]+)":\s*\{/gm)].map(match => match[1]));

const targets = [];
for (const name of shardNames) {
  const shard = JSON.parse(fs.readFileSync(path.join(dataDir, name), "utf8"));
  for (const key of ["mice", "keyboards", "switches"]) {
    for (const product of shard[key] ?? []) {
      if (product.status === "discontinued") continue;
      targets.push(product);
    }
  }
}

const failures = [];
for (const product of targets) {
  if (explicitImageIds.has(product.id)) continue;
  const manufacturerSources = (product.sources ?? []).filter(source => source.kind === "manufacturer" && /^https:\/\//i.test(source.url ?? ""));
  if (!manufacturerSources.length) failures.push(`${product.id}: no explicit image and no HTTPS manufacturer source for media fallback`);
}

if (failures.length) {
  console.error("Product media coverage validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

const explicit = targets.filter(product => explicitImageIds.has(product.id)).length;
console.log(`Product media coverage OK: ${targets.length} current/announced mice, keyboards and switches; ${explicit} explicit images; ${targets.length - explicit} official-source fallbacks.`);
