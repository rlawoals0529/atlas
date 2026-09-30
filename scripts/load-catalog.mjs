import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dataDir = fileURLToPath(new URL("../data/", import.meta.url));
export const catalogGroups = ["mice", "mousepads", "skates", "keyboards", "switches"];

export function loadCatalog() {
  const files = fs.readdirSync(dataDir)
    .filter((name) => /^catalog(?:\.[a-z0-9-]+)?\.json$/i.test(name))
    .sort((a, b) => {
      if (a === "catalog.json") return -1;
      if (b === "catalog.json") return 1;
      return a.localeCompare(b);
    });

  const merged = { mice: [], mousepads: [], skates: [], keyboards: [], switches: [], shards: [] };
  for (const file of files) {
    const payload = JSON.parse(fs.readFileSync(path.join(dataDir, file), "utf8"));
    for (const group of catalogGroups) merged[group].push(...(payload[group] ?? []));
    merged.shards.push({ file, counts: Object.fromEntries(catalogGroups.map(group => [group, payload[group]?.length ?? 0])) });
  }

  if (!files.length) throw new Error("No data/catalog*.json files found.");
  return merged;
}
