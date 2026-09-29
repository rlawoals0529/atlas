import fs from "node:fs";
import { loadCatalog } from "./load-catalog.mjs";

const data = loadCatalog();
const products = [...data.mice, ...data.mousepads, ...data.skates];
const sourceKinds = { manufacturer: 0, independent: 0, community: 0, editorial: 0 };
const confidence = { high: 0, medium: 0, low: 0 };
const dates = [];
let current = 0;
let currentManufacturer = 0;
let currentIndependent = 0;
let sourceInstances = 0;
let evidenceGroups = 0;

for (const product of products) {
  const kinds = new Set((product.sources ?? []).map(source => source.kind));
  if (product.status === "current") {
    current += 1;
    if (kinds.has("manufacturer")) currentManufacturer += 1;
    if (kinds.has("independent")) currentIndependent += 1;
  }
  for (const source of product.sources ?? []) {
    sourceKinds[source.kind] = (sourceKinds[source.kind] ?? 0) + 1;
    sourceInstances += 1;
    if (source.checkedAt) dates.push(source.checkedAt);
  }
  for (const item of Object.values(product.evidence ?? {})) {
    confidence[item.confidence] = (confidence[item.confidence] ?? 0) + 1;
    evidenceGroups += 1;
  }
}

dates.sort();
const pct = (value, total) => total ? Math.round(value / total * 100) : 0;
const report = {
  generatedAt: new Date().toISOString(),
  shards: data.shards,
  counts: {
    products: products.length,
    mice: data.mice.length,
    mousepads: data.mousepads.length,
    skates: data.skates.length,
    current,
  },
  sourceInstances,
  evidenceGroups,
  sourceKinds,
  confidence,
  currentCoverage: {
    manufacturerPct: pct(currentManufacturer, current),
    independentPct: pct(currentIndependent, current),
  },
  sourceCheckWindow: {
    oldest: dates[0] ?? null,
    newest: dates.at(-1) ?? null,
  },
};

fs.mkdirSync(new URL("../generated/", import.meta.url), { recursive: true });
fs.writeFileSync(new URL("../generated/data-report.json", import.meta.url), JSON.stringify(report, null, 2));
console.log(`Catalog: ${report.counts.products} products across ${report.shards.length} shards`);
console.log(`Types: ${report.counts.mice} mice / ${report.counts.mousepads} pads / ${report.counts.skates} skates`);
console.log(`Current-source coverage: ${report.currentCoverage.manufacturerPct}% manufacturer / ${report.currentCoverage.independentPct}% independent`);
console.log(`Evidence: ${report.evidenceGroups} groups / ${report.sourceInstances} source instances`);
