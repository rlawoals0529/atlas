import fs from "node:fs";

const data = JSON.parse(fs.readFileSync("data/sensitivity-games.json", "utf8"));
const errors = [];
const assert = (condition, message) => { if (!condition) errors.push(message); };

assert(data.version === 1, "sensitivity dataset version must be 1");
assert(/^\d{4}-\d{2}-\d{2}$/.test(data.checkedAt ?? ""), "checkedAt must be YYYY-MM-DD");
assert(typeof data.scope === "string" && data.scope.toLowerCase().includes("base hipfire"), "scope must explicitly limit conversions to base hipfire");
assert(Array.isArray(data.games) && data.games.length >= 2, "at least two sensitivity presets are required");

const ids = new Set();
for (const game of data.games ?? []) {
  assert(typeof game.id === "string" && game.id.length > 0, "each sensitivity preset needs an id");
  assert(!ids.has(game.id), `duplicate sensitivity preset id: ${game.id}`);
  ids.add(game.id);
  assert(typeof game.label === "string" && game.label.length > 0, `${game.id}: label is required`);
  assert(Number.isFinite(game.yaw) && game.yaw > 0 && game.yaw < 1, `${game.id}: yaw must be a positive degree-per-count value below 1`);
  assert(Number.isInteger(game.decimals) && game.decimals >= 0 && game.decimals <= 8, `${game.id}: decimals must be 0..8`);
  assert(["high", "medium", "low"].includes(game.confidence), `${game.id}: invalid confidence`);
  assert(Array.isArray(game.sources) && game.sources.length > 0, `${game.id}: at least one provenance source is required`);
  for (const source of game.sources ?? []) {
    assert(typeof source.label === "string" && source.label.length > 0, `${game.id}: source label is required`);
    assert(/^https:\/\//.test(source.url ?? ""), `${game.id}: source URL must be HTTPS`);
  }
  assert(typeof game.note === "string" && game.note.length >= 30, `${game.id}: note must explain evidence/limitations`);
}

const byId = id => data.games.find(game => game.id === id);
const cs2 = byId("cs2");
const valorant = byId("valorant");
if (cs2 && valorant) {
  const dpi = 800;
  const sourceSensitivity = 1;
  const converted = sourceSensitivity * dpi * cs2.yaw / (dpi * valorant.yaw);
  const cm = (sens, yaw) => (360 * 2.54) / (dpi * sens * yaw);
  assert(Math.abs(converted - 0.3142857142857143) < 1e-12, "CS2 → VALORANT reference conversion changed unexpectedly");
  assert(Math.abs(cm(sourceSensitivity, cs2.yaw) - cm(converted, valorant.yaw)) < 1e-9, "cross-game conversion must preserve cm/360");
}

if (errors.length) {
  console.error(`Sensitivity validation failed with ${errors.length} issue${errors.length === 1 ? "" : "s"}:`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log(`Validated ${data.games.length} sensitivity presets and cm/360 conversion invariants.`);
