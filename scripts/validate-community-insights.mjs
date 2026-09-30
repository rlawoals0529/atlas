import fs from "node:fs";
import { catalogGroups, loadCatalog } from "./load-catalog.mjs";

const catalog = loadCatalog();
const products = catalogGroups.flatMap(group => catalog[group] ?? []);
const productIds = new Set(products.map(product => product.id));
const pilotFiles = fs.readdirSync("data").filter(name => /^community-insights(?:\.[a-z0-9-]+)+\.json$/i.test(name)).sort();
const pilots = pilotFiles.map(file => ({ file, data: JSON.parse(fs.readFileSync(`data/${file}`, "utf8")) }));

const attributes = new Set(["shape", "size", "grip-fit", "weight", "weight-balance", "coating", "main-clicks", "side-buttons", "scroll-wheel", "skates", "sensor-implementation", "wireless-performance", "battery", "software", "qc-reliability", "price-value", "glide", "stopping-power", "texture", "skate-compatibility", "dust-sensitivity", "skin-sleeve", "durability"]);
const sentiments = new Set(["positive", "mixed", "negative", "neutral"]);
const strengths = new Set(["anecdotal", "repeated-observation", "structured-sample", "independent-measurement"]);
const consensusValues = new Set(["single-source", "disagreement", "directional", "cross-source-consensus"]);
const sourceTypes = new Set(["reddit", "forum", "review", "video", "x-post", "support-thread", "other"]);

const errors = [];
const assert = (condition, message) => { if (!condition) errors.push(message); };
const ids = new Set();
let insightCount = 0;
const coveredProducts = new Set();
const coveredSources = new Set();

for (const { file, data: pilot } of pilots) {
  assert(pilot.version === 1, `${file}: version must be 1`);
  assert(/^\d{4}-\d{2}-\d{2}$/.test(pilot.observedAt ?? ""), `${file}: observedAt must be YYYY-MM-DD`);
  assert(typeof pilot.scope === "string" && pilot.scope.length >= 40, `${file}: scope must explain the pilot boundary`);
  assert(Array.isArray(pilot.methodology?.limitations) && pilot.methodology.limitations.length >= 3, `${file}: methodology must include at least three limitations`);
  assert((pilot.scope ?? "").toLowerCase().includes("not estimate population sentiment"), `${file}: scope must explicitly reject population-sentiment inference`);
  assert(Array.isArray(pilot.insights) && pilot.insights.length > 0, `${file}: insights must be non-empty`);

  for (const row of pilot.insights ?? []) {
    insightCount += 1;
    coveredProducts.add(row.productId);
    coveredSources.add(row.sourceId);
    assert(typeof row.id === "string" && row.id.length > 0, `${file}: every insight needs an id`);
    assert(!ids.has(row.id), `duplicate insight id across pilots: ${row.id}`);
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
      assert(sourceIds.size >= 2, `${file}/${key}: cross-source-consensus requires at least two source IDs`);
      assert(sourceTypesInGroup.size >= 2, `${file}/${key}: cross-source-consensus requires at least two source types`);
    }
    if (rows.some(row => row.consensus === "disagreement")) {
      const explicit = rows.some(row => typeof row.disagreementNote === "string" && row.disagreementNote.length >= 20);
      assert(explicit, `${file}/${key}: disagreement must include an explicit disagreementNote`);
    }
  }
}

if (!pilots.length) errors.push("No community evidence pilot files found.");
if (errors.length) {
  console.error(`Community evidence validation failed with ${errors.length} issue${errors.length === 1 ? "" : "s"}:`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Validated ${insightCount} community observations across ${coveredProducts.size} products, ${coveredSources.size} traceable sources and ${pilots.length} pilot files.`);
