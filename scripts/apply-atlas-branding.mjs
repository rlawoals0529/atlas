// One-time validated migration for the Atlas rename and security release.
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const allowed = new Set([".md", ".tsx", ".ts", ".css", ".html", ".json", ".jsonc", ".yml", ".yaml", ".mjs"]);
const ignored = new Set([".git", "node_modules", "dist", ".wrangler", "generated"]);
let touched = 0;

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
      continue;
    }
    if (!allowed.has(path.extname(entry.name))) continue;
    if (full.endsWith("scripts/apply-atlas-branding.mjs")) continue;
    const original = fs.readFileSync(full, "utf8");
    let next = original
      .replaceAll("INPUT ATLAS", "ATLAS")
      .replaceAll("Input Atlas", "Atlas")
      .replaceAll("input-atlas", "atlas");
    if (next !== original) {
      fs.writeFileSync(full, next);
      touched += 1;
      console.log("renamed", path.relative(ROOT, full));
    }
  }
}

walk(ROOT);
console.log(`Atlas branding updated in ${touched} files.`);
