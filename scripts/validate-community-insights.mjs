import fs from "node:fs";

const pilot = JSON.parse(fs.readFileSync("data/community-insights.2026q3.json", "utf8"));
const catalogFiles = ["data/catalog.json", "data/catalog.2026q3.json"];
const products = catalogFiles.flatMap(path => {
  const shard = JSON.parse(fs.readFileSync(path, "utf8"));
  return [...(shard.mice ?? []), ...(shard.mousepads ?? []), ...(shard.skates ?? [])];
});
const productIds = new Set(products.map(product => product.id));

const attributes = new Set(["shape", "size", "grip-fit", "weight", "weight-balance", "coating", "main-clicks", "side-buttons", "scroll-wheel", "skates", "sensor-implementation", "wireless-performance", "battery", "software", "qc-reliability", "price-value"]);
const sentiments = new Set(["positive", "mixed", "negative", "neutral"]);
const strengths = new Set(["anecdotal", "repeated-observation", "structured-sample", "independent-measurement"]);
const consensusValues = new Set(["single-source", "disagreement", "directional", "cross-source-consensus"]);
const sourceTypes = new Set(["reddit", "forum", "review", "video", "support-thread", "other"]);

const errors = [];
const assert = (condition, message) => { if (!condition) errors.push(message); };

assert(pilot.version === 1, "pilot.version must be 1");
assert(/^\d{4}-\d{2}-\d{2}$/.test(pilot.observedAt ?? ""), "pilot.observedAt must be YYYY-MM-DD");
assert(typeof pilot.scope === "string" && pilot.scope.length >= 40, "pilot.scope must explain the pilot boundary");
assert(Array.isArray(pilot.methodology?.limitations) && pilot.methodology.limitations.length >= 3, "methodology must include at least three limitations");
assert((pilot.scope ?? "").toLowerCase().includes("not estimate population sentiment"), "scope must explicitly reject population-sentiment inference");
assert(Array.isArray(pilot.insights) && pilot.insights.length > 0, "pilot.insights must be non-empty");

const ids = new Set();
for (const row of pilot.insights ?? []) {
  assert(typeof row.id === "string" && row.id.length > 0, "every insight needs an id");
  assert(!ids.has(row.id), `duplicate insight id: ${row.id}`);
  ids.add(row.id);
  assert(productIds.has(row.productId), `${row.id}: unknown productId ${row.productId}`);
  assert(attributes.has(row.attribute), `${row.id}: invalid attribute ${row.attribute}`);
  assert(sentiments.has(row.sentiment), `${row.id}: invalid sentiment ${row.sentiment}`);
  assert(strengths.has(row.evidenceStrength), `${row.id}: invalid evidenceStrength ${row.evidenceStrength}`);
  assert(consensusValues.has(row.consensus), `${row.id}: invalid consensus ${row.consensus}`);
  assert(sourceTypes.has(row.sourceType), `${row.id}: invalid sourceType ${row.sourceType}`);
  assert(typeof row.summary === "string" && row.summary.length >= 35, `${row.id}: summary is too short`);
  assert(typeof row.sourceId === "string" && row.sourceId.length > 0, `${row.id}: sourceId is required`);
  assert(typeof row.sourceLabel === "string" && row.sourceLabel.length > 0, `${row.id}: sourceLabel is required`);
  assert(/^https:\/\//.test(row.sourceUrl ?? ""), `${row.id}: sourceUrl must be HTTPS`);
  assert(/^\d{4}-\d{2}-\d{2}$/.test(row.observedAt ?? ""), `${row.id}: observedAt must be YYYY-MM-DD`);
  if (row.publishedAt) assert(/^\d{4}-\d{2}-\d{2}$/.test(row.publishedAt), `${row.id}: publishedAt must be YYYY-MM-DD`);
  if (row.sampleSize != null) assert(Number.isInteger(row.sampleSize) && row.sampleSize >= 1, `${row.id}: sampleSize must be a positive integer`);
  assert(!row.quote, `${row.id}: pilot should store paraphrases rather than copied quotations`);
}

const groups = new Map();
for (const row of pilot.insights ?? []) {
  const key = `${row.productId}::${row.attribute}`;
  const list = groups.get(key) ?? [];
  list.push(row);
  groups.set(key, list);
}

for (const [key, rows] of groups) {
  const sourceIds = new Set(rows.map(row => row.sourceId));
  const sourceTypesInGroup = new Set(rows.map(row => row.sourceType));
  if (rows.some(row => row.consensus === "cross-source-consensus")) {
    assert(sourceIds.size >= 2, `${key}: cross-source-consensus requires at least two source IDs`);
    assert(sourceTypesInGroup.size >= 2, `${key}: cross-source-consensus requires at least two source types`);
  }
  if (rows.some(row => row.consensus === "disagreement")) {
    const disagreementIsExplicit = rows.some(row => typeof row.disagreementNote === "string" && row.disagreementNote.length >= 20);
    assert(disagreementIsExplicit, `${key}: disagreement must include an explicit disagreementNote`);
  }
}

if (errors.length) {
  console.error(`Community evidence validation failed with ${errors.length} issue${errors.length === 1 ? "" : "s"}:`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

const productsCovered = new Set((pilot.insights ?? []).map(row => row.productId)).size;
const sourcesCovered = new Set((pilot.insights ?? []).map(row => row.sourceId)).size;
console.log(`Validated ${pilot.insights.length} community observations across ${productsCovered} products and ${sourcesCovered} traceable sources.`);
