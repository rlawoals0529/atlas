import type { CatalogProduct, SourceKind } from "./types";
import { evidenceHealth } from "./productMeta";

export function catalogStats(products: CatalogProduct[]) {
  const sourceKinds: Record<SourceKind, number> = { manufacturer: 0, independent: 0, community: 0, editorial: 0 };
  const confidence = { high: 0, medium: 0, low: 0 };
  const checkedDates: string[] = [];
  let current = 0;
  let currentWithManufacturer = 0;
  let currentWithIndependent = 0;
  let totalSources = 0;
  let totalEvidence = 0;
  let healthTotal = 0;

  for (const product of products) {
    if (product.status === "current") current += 1;
    const kinds = new Set(product.sources.map(source => source.kind));
    if (product.status === "current" && kinds.has("manufacturer")) currentWithManufacturer += 1;
    if (product.status === "current" && kinds.has("independent")) currentWithIndependent += 1;
    for (const source of product.sources) {
      sourceKinds[source.kind] += 1;
      totalSources += 1;
      checkedDates.push(source.checkedAt);
    }
    for (const item of Object.values(product.evidence ?? {})) {
      confidence[item.confidence] += 1;
      totalEvidence += 1;
    }
    healthTotal += evidenceHealth(product).score;
  }

  checkedDates.sort();
  const pct = (value: number, denominator: number) => denominator ? Math.round((value / denominator) * 100) : 0;
  return {
    products: products.length,
    current,
    status: {
      current,
      announced: products.filter(product => product.status === "announced").length,
      discontinued: products.filter(product => product.status === "discontinued").length,
    },
    evidenceHealthAverage: Math.round(healthTotal / Math.max(1, products.length)),
    sourceInstances: totalSources,
    evidenceGroups: totalEvidence,
    sourceKinds,
    confidence,
    currentCoverage: {
      manufacturerPct: pct(currentWithManufacturer, current),
      independentPct: pct(currentWithIndependent, current),
    },
    checkedAt: {
      oldest: checkedDates[0] ?? null,
      newest: checkedDates.at(-1) ?? null,
    },
  };
}
