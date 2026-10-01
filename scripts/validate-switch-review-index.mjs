import fs from "node:fs";

const fileUrl = new URL("../src/shared/thereminGoatSwitchReviews.ts", import.meta.url);
const text = fs.readFileSync(fileUrl, "utf8");
const sourceCountMatch = text.match(/THEREMINGOAT_SWITCH_REVIEW_COUNT\s*=\s*(\d+)/);
const arrayMatch = text.match(/thereminGoatSwitchReviews: ExternalSwitchReview\[\] = (\[[\s\S]*\]);\s*$/);

if (!sourceCountMatch || !arrayMatch) {
  throw new Error("Could not parse ThereminGoat switch review directory.");
}

const sourceRows = Number(sourceCountMatch[1]);
const entries = JSON.parse(arrayMatch[1]);

const APPROVED_SCORECARD_ALIASES = {
  "'Aura' Frost Panda": "Aura Frost Panda",
  "Akko V3 Cream Yellow": "Akko V3 Cream Yelow",
  "B.Stone Dark Eyes": "B. Stone Dark Eyes",
  "C3 Kiwi": "Kiwi",
  "Cherry MX Brown (3 Pin)": "Cherry MX Brown",
  "Cherry MX Ergo Clear (3 Pin)": "Cherry MX Ergo Clear",
  "Cherry MX2A RGB Black (3 Pin)": "Cherry MX2A RGB Black",
  "Cherry MX2A RGB Blue (3 Pin)": "Cherry MX2A RGB Blue",
  "Cream Tactile": "Novelkeys Cream Tactile",
  "Everglide Amber Orange V2 Pro!": "Everglide Amber Orange V2 Pro",
  "Everglide Coral Red V2 Pro!": "Everglide Coral Red V2 Pro",
  "Gamakay Venus": "Gamaky Venus",
  "Gateron Kangaroo Inks": "Gateron Kangaroo Ink",
  "Greetech OG Brown": "Greetech OG Brown (5 Pin)",
  "Hexin Workshop Bamboo Green (60g)": "Hexin Bamboo Green 60g",
  "Kailh Deep Sea Silent Pro Whale": "Kailh Deep Sea Silent Pro Tactile Whale",
  "Kailh Pro Burgundy (Plate Mount)": "Kailh Pro Burgundy",
  "Kailh Pro Light Green (Plate Mount)": "Kailh Pro Light Green",
  "Kailh Pro Purple (Plate Mount)": "Kailh Pro Purple",
  "Keygeek Y2 (20mm/45g)": "Keygeek Y2 (20mm_45g)",
  "KK Lightwave": "KK Lightwave V1",
  "NK x Kailh Chocolate": "Novelkeys x Kailh Chocolate",
  "NK x Kailh Speed Heavy Burnt Orange": "Novelkeys x Kailh Speed Heavy Burnt Orange",
  "NK x Kailh Speed Heavy Dark Yellow": "Novelkeys x Kailh Speed Heavy Dark Yellow",
  "NK x Kailh Speed Heavy Pale Blue": "Novelkeys x Kailh Speed Heavy Pale Blue",
  "Novelia": "Novelias",
  "Novelkeys Box Cream": "Novelkeys Box Creams",
  "RRE Blacks": "RRE Black",
  "SP Star Magic Girl (Classic)": "SP Star Magic Girl",
  "TTC Wild (42g.)": "TTC Wild 42g",
  "Vertex V1 (Unlubed)": "Vertex V1",
  "Winkeyless.KR Zeal Clear": "WinkeylessKR Zeal Clear"
};
const expectedTypes = new Set(["Linear", "Tactile", "Clicky", "Silent Linear", "Silent Tactile"]);
const expectedPrefix = "https://github.com/ThereminGoat/switch-scores/blob/master/";

const errors = [];
const names = new Set();
const urls = new Set();

if (sourceRows !== 467) errors.push(`Expected 467 source-sheet rows, found ${sourceRows}.`);
if (entries.length !== 466) errors.push(`Expected 466 deduplicated switch entries, found ${entries.length}.`);

for (const entry of entries) {
  if (names.has(entry.name)) errors.push(`Duplicate switch name: ${entry.name}`);
  names.add(entry.name);

  if (!entry.reviewUrl || typeof entry.reviewUrl !== "string") {
    errors.push(`Missing scorecard URL: ${entry.name}`);
    continue;
  }
  if (!entry.reviewUrl.startsWith(expectedPrefix) || !entry.reviewUrl.endsWith(".pdf")) {
    errors.push(`Unexpected scorecard URL: ${entry.name} -> ${entry.reviewUrl}`);
  }
  if (urls.has(entry.reviewUrl)) errors.push(`Duplicate scorecard URL: ${entry.reviewUrl}`);
  urls.add(entry.reviewUrl);

  const filename = decodeURIComponent(entry.reviewUrl.split("/").pop()).replace(/\.pdf$/i, "");
  const approvedAlias = APPROVED_SCORECARD_ALIASES[entry.name];

  if (filename === entry.name) {
    if (entry.scorecardName) errors.push(`Redundant scorecardName for exact match: ${entry.name}`);
    if (approvedAlias) errors.push(`Alias allowlist is stale for exact match: ${entry.name}`);
  } else {
    if (!entry.scorecardName) errors.push(`Non-exact scorecard match is not declared: ${entry.name} -> ${filename}`);
    if (entry.scorecardName !== filename) errors.push(`scorecardName does not match URL filename: ${entry.name}`);
    if (approvedAlias !== filename) errors.push(`Unreviewed scorecard alias: ${entry.name} -> ${filename}`);
  }

  if (!expectedTypes.has(entry.type)) errors.push(`Unexpected switch type for ${entry.name}: ${entry.type}`);
  if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(entry.reviewedAt)) errors.push(`Invalid review date for ${entry.name}: ${entry.reviewedAt}`);
}

for (const [name, filename] of Object.entries(APPROVED_SCORECARD_ALIASES)) {
  const entry = entries.find(item => item.name === name);
  if (!entry) errors.push(`Approved alias has no directory entry: ${name}`);
  else if (entry.scorecardName !== filename) errors.push(`Approved alias drifted: ${name} -> ${entry.scorecardName ?? "(missing)"}`);
}

if (errors.length) {
  console.error("External switch index validation FAILED:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`External switch index PASS: ${entries.length} unique switches from ${sourceRows} source rows; ${Object.keys(APPROVED_SCORECARD_ALIASES).length} explicitly reviewed title aliases; every entry has a unique scorecard link.`);
