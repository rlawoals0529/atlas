import fs from "node:fs";
import { scoreRows } from "./lib/score-sheets.mjs";

const commit = "324e870272e83a96ff3f8e13b15b9f4671166674";
const kinds = ["overall", "hard", "soft"];
const sheets = Object.fromEntries(kinds.map(kind => {
  const text = fs.readFileSync(new URL(`../data/sources/theremingoat/${kind}.csv`, import.meta.url), "utf8");
  const rows = scoreRows(text, kind);
  if (rows.length !== 474) throw new Error(`${kind}: expected 474 source rows, received ${rows.length}`);
  return [kind, rows];
}));
const data = { author: "ThereminGoat", commit, retrievedAt: "2026-10-30", sheetDate: "2026-10-24", sheets };
const output = JSON.stringify(data) + "\n";
const target = new URL("../src/shared/thereminGoatScores.json", import.meta.url);
if (process.argv.includes("--check")) {
  if (fs.readFileSync(target, "utf8") !== output) throw new Error("Score snapshot differs from source CSVs. Run npm run scores:generate.");
  console.log("Switch scores PASS: 474 rows in each of Overall / Hard / Soft; source values preserved.");
} else { fs.writeFileSync(target, output); console.log("Generated three attributed score sheets."); }
