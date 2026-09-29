import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dataDir = fileURLToPath(new URL("../data/", import.meta.url));

export function loadCatalog() {
  const files = fs.readdirSync(dataDir)
    .filter((name) => /^catalog(?:\.[a-z0-9-]+)?\.json$/i.test(name))
    .sort((a, b) => {
      if (a === "catalog.json") return -1;
      if (b === "catalog.json") return 1;
      return a.localeCompare(b);
    });

  const merged = { mice: [], mousepads: [], skates: [], shards: [] };
  for (const file of files) {
    const payload = JSON.parse(fs.readFileSync(path.join(dataDir, file), "utf8"));
    merged.mice.push(...(payload.mice ?? []));
    merged.mousepads.push(...(payload.mousepads ?? []));
    merged.skates.push(...(payload.skates ?? []));
    merged.shards.push({ file, counts: {
      mice: payload.mice?.length ?? 0,
      mousepads: payload.mousepads?.length ?? 0,
      skates: payload.skates?.length ?? 0,
    }});
  }

  if (!files.length) throw new Error("No data/catalog*.json files found.");
  return merged;
}
