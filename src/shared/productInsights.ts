import { shapeSimilarity } from "./shape";
import type { MouseProduct } from "./types";

export type FindingKind = "observed" | "hypothesis" | "evidence-needed" | "recommendation";

export interface SegmentCount {
  label: string;
  count: number;
  sharePct: number;
}

export interface CatalogMatrixCell {
  x: string;
  y: string;
  count: number;
  sharePct: number;
  denominator: number;
}

export interface FeatureAdoptionRow {
  feature: string;
  enabledCount: number;
  knownCount: number;
  unknownCount: number;
  shareOfKnownPct: number;
}

export interface ProductPosition {
  productId: string;
  brand: string;
  model: string;
  weightG: number;
  lengthMm: number;
  widthMm: number;
  heightMm: number;
  msrpUsd: number | null;
  pollingHz: number;
  shape: "symmetrical" | "ergonomic";
  hump: MouseProduct["specs"]["hump"];
}

export interface CompetitorMatch {
  productId: string;
  brand: string;
  model: string;
  score: number;
  shapeScore: number;
  weightDeltaG: number;
  priceDeltaUsd: number | null;
  pollingRatio: number;
  rationale: string[];
}

export interface BrandPositioning {
  brand: string;
  currentCount: number;
  medianWeightG: number | null;
  medianMsrpUsd: number | null;
  wirelessSharePct: number;
  highPollingSharePct: number;
}

export interface InsightStatement {
  kind: FindingKind;
  title: string;
  body: string;
  evidence?: string[];
}

export interface ProductInsights {
  currentCount: number;
  pricedCount: number;
  medianWeightG: number | null;
  medianMsrpUsd: number | null;
  wirelessSharePct: number;
  highPollingSharePct: number;
  highPollingPriceDeltaUsd: number | null;
  weightPriceCorrelation: number | null;
  pollingPriceCorrelation: number | null;
  catalogBrandRepresentationHhi: number;
  shapeSegments: SegmentCount[];
  weightSegments: SegmentCount[];
  priceSegments: SegmentCount[];
  pollingSegments: SegmentCount[];
  lifecycleSegments: SegmentCount[];
  topBrands: Array<{ brand: string; count: number; sharePct: number }>;
  sparseShapeWeightCells: Array<{ label: string; count: number }>;
  shapeWeightMatrix: CatalogMatrixCell[];
  shapePriceMatrix: CatalogMatrixCell[];
  weightPriceMatrix: CatalogMatrixCell[];
  featureAdoption: FeatureAdoptionRow[];
  positions: ProductPosition[];
  brandPositioning: BrandPositioning[];
  statements: InsightStatement[];
}

const median = (values: number[]) => {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
};

const average = (values: number[]) => values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
const pct = (value: number, total: number) => total ? Math.round((value / total) * 1000) / 10 : 0;
const segment = (label: string, count: number, total: number): SegmentCount => ({ label, count, sharePct: pct(count, total) });
const isWireless = (mouse: MouseProduct) => mouse.specs.connectivity.some(value => /wireless|2\.4|bluetooth/i.test(value));
const round2 = (value: number) => Math.round(value * 100) / 100;

function pearson(pairs: Array<[number, number]>): number | null {
  if (pairs.length < 3) return null;
  const meanX = pairs.reduce((sum, [x]) => sum + x, 0) / pairs.length;
  const meanY = pairs.reduce((sum, [, y]) => sum + y, 0) / pairs.length;
  let numerator = 0;
  let xSquare = 0;
  let ySquare = 0;
  for (const [x, y] of pairs) {
    const dx = x - meanX;
    const dy = y - meanY;
    numerator += dx * dy;
    xSquare += dx * dx;
    ySquare += dy * dy;
  }
  if (!xSquare || !ySquare) return null;
  return round2(numerator / Math.sqrt(xSquare * ySquare));
}

const weightBands = [
  { label: "<50 g", matches: (mouse: MouseProduct) => mouse.specs.weightG < 50 },
  { label: "50–59 g", matches: (mouse: MouseProduct) => mouse.specs.weightG >= 50 && mouse.specs.weightG < 60 },
  { label: "60–69 g", matches: (mouse: MouseProduct) => mouse.specs.weightG >= 60 && mouse.specs.weightG < 70 },
  { label: "70+ g", matches: (mouse: MouseProduct) => mouse.specs.weightG >= 70 },
];

const priceBands = [
  { label: "<$80", matches: (mouse: MouseProduct) => mouse.msrpUsd != null && mouse.msrpUsd < 80 },
  { label: "$80–119", matches: (mouse: MouseProduct) => mouse.msrpUsd != null && mouse.msrpUsd >= 80 && mouse.msrpUsd < 120 },
  { label: "$120–159", matches: (mouse: MouseProduct) => mouse.msrpUsd != null && mouse.msrpUsd >= 120 && mouse.msrpUsd < 160 },
  { label: "$160+", matches: (mouse: MouseProduct) => mouse.msrpUsd != null && mouse.msrpUsd >= 160 },
];

const shapeBands = [
  { label: "Symmetrical", matches: (mouse: MouseProduct) => mouse.specs.shape === "symmetrical" },
  { label: "Ergonomic", matches: (mouse: MouseProduct) => mouse.specs.shape === "ergonomic" },
];

function matrix(
  products: MouseProduct[],
  xBands: Array<{ label: string; matches: (mouse: MouseProduct) => boolean }>,
  yBands: Array<{ label: string; matches: (mouse: MouseProduct) => boolean }>,
): CatalogMatrixCell[] {
  const denominator = products.length;
  return yBands.flatMap(y => xBands.map(x => {
    const count = products.filter(mouse => x.matches(mouse) && y.matches(mouse)).length;
    return { x: x.label, y: y.label, count, sharePct: pct(count, denominator), denominator };
  }));
}

function adoptionOptionalBoolean(products: MouseProduct[], feature: string, picker: (mouse: MouseProduct) => boolean | undefined): FeatureAdoptionRow {
  const known = products.filter(mouse => picker(mouse) !== undefined);
  const enabled = known.filter(mouse => picker(mouse) === true);
  return { feature, enabledCount: enabled.length, knownCount: known.length, unknownCount: products.length - known.length, shareOfKnownPct: pct(enabled.length, known.length) };
}

function adoptionOptionalNumber(products: MouseProduct[], feature: string, picker: (mouse: MouseProduct) => number | undefined, predicate: (value: number) => boolean): FeatureAdoptionRow {
  const known = products.filter(mouse => picker(mouse) !== undefined);
  const enabled = known.filter(mouse => predicate(picker(mouse) as number));
  return { feature, enabledCount: enabled.length, knownCount: known.length, unknownCount: products.length - known.length, shareOfKnownPct: pct(enabled.length, known.length) };
}

export function directCompetitorsFor(base: MouseProduct, products: MouseProduct[], limit = 6): CompetitorMatch[] {
  const candidates = products.filter(product => product.status === "current" && product.id !== base.id);
  return candidates.map(candidate => {
    const shape = shapeSimilarity(base, candidate, "balanced");
    const weightDeltaG = candidate.specs.weightG - base.specs.weightG;
    const priceDeltaUsd = base.msrpUsd != null && candidate.msrpUsd != null ? candidate.msrpUsd - base.msrpUsd : null;
    const weightScore = Math.max(0, 100 - Math.abs(weightDeltaG) * 3.5);
    const priceScore = priceDeltaUsd == null ? 65 : Math.max(0, 100 - Math.abs(priceDeltaUsd) * 0.7);
    const pollingRatio = Math.min(base.specs.maxPollingHz, candidate.specs.maxPollingHz) / Math.max(base.specs.maxPollingHz, candidate.specs.maxPollingHz);
    const pollingScore = pollingRatio * 100;
    const connectivityScore = isWireless(base) === isWireless(candidate) ? 100 : 45;
    const score = Math.round(shape.score * .52 + weightScore * .18 + priceScore * .12 + pollingScore * .1 + connectivityScore * .08);
    const rationale = [
      `${shape.score}% balanced shape similarity`,
      Math.abs(weightDeltaG) <= 5 ? "very similar weight" : `${Math.abs(weightDeltaG).toFixed(1)} g ${weightDeltaG > 0 ? "heavier" : "lighter"}`,
      priceDeltaUsd == null ? "price comparison incomplete" : Math.abs(priceDeltaUsd) <= 20 ? "similar MSRP band" : `$${Math.abs(Math.round(priceDeltaUsd))} ${priceDeltaUsd > 0 ? "higher" : "lower"} MSRP`,
    ];
    return { productId: candidate.id, brand: candidate.brand, model: candidate.model, score, shapeScore: shape.score, weightDeltaG, priceDeltaUsd, pollingRatio, rationale };
  }).sort((a, b) => b.score - a.score || b.shapeScore - a.shapeScore || a.productId.localeCompare(b.productId)).slice(0, limit);
}

export function analyzeMouseCatalog(products: MouseProduct[]): ProductInsights {
  const current = products.filter(product => product.status === "current");
  const total = current.length;
  const priced = current.filter(product => typeof product.msrpUsd === "number");
  const highPolling = current.filter(product => product.specs.maxPollingHz >= 4000);
  const standardPolling = current.filter(product => product.specs.maxPollingHz < 4000);
  const highPollingPrice = average(highPolling.flatMap(product => product.msrpUsd == null ? [] : [product.msrpUsd]));
  const standardPollingPrice = average(standardPolling.flatMap(product => product.msrpUsd == null ? [] : [product.msrpUsd]));

  const brandCounts = new Map<string, number>();
  for (const mouse of current) brandCounts.set(mouse.brand, (brandCounts.get(mouse.brand) ?? 0) + 1);

  const shapeSegments = shapeBands.map(band => segment(band.label, current.filter(band.matches).length, total));
  const weightSegments = weightBands.map(band => segment(band.label, current.filter(band.matches).length, total));
  const priceSegments = priceBands.map(band => segment(band.label, priced.filter(band.matches).length, priced.length));
  const pollingSegments = [
    segment("1K or lower", current.filter(mouse => mouse.specs.maxPollingHz <= 1000).length, total),
    segment("2K", current.filter(mouse => mouse.specs.maxPollingHz === 2000).length, total),
    segment("4K", current.filter(mouse => mouse.specs.maxPollingHz === 4000).length, total),
    segment("8K+", current.filter(mouse => mouse.specs.maxPollingHz >= 8000).length, total),
  ];
  const lifecycleSegments = (["current", "announced", "discontinued"] as const).map(status => segment(status, products.filter(mouse => mouse.status === status).length, products.length));

  const shapeWeightMatrix = matrix(current, weightBands, shapeBands);
  const shapePriceMatrix = matrix(priced, priceBands, shapeBands);
  const weightPriceMatrix = matrix(priced, priceBands, weightBands);
  const sparseShapeWeightCells = shapeWeightMatrix.map(cell => ({ label: `${cell.y} / ${cell.x}`, count: cell.count })).sort((a, b) => a.count - b.count || a.label.localeCompare(b.label)).slice(0, 6);

  const highPollingPriceDeltaUsd = highPollingPrice != null && standardPollingPrice != null ? Math.round(highPollingPrice - standardPollingPrice) : null;
  const positions = current.map(mouse => ({ productId: mouse.id, brand: mouse.brand, model: mouse.model, weightG: mouse.specs.weightG, lengthMm: mouse.specs.lengthMm, widthMm: mouse.specs.widthMm, heightMm: mouse.specs.heightMm, msrpUsd: mouse.msrpUsd ?? null, pollingHz: mouse.specs.maxPollingHz, shape: mouse.specs.shape, hump: mouse.specs.hump }));

  const brandPositioning = [...new Set(current.map(mouse => mouse.brand))].map(brand => {
    const lineup = current.filter(mouse => mouse.brand === brand);
    const lineupPriced = lineup.flatMap(mouse => mouse.msrpUsd == null ? [] : [mouse.msrpUsd]);
    return {
      brand,
      currentCount: lineup.length,
      medianWeightG: median(lineup.map(mouse => mouse.specs.weightG)),
      medianMsrpUsd: median(lineupPriced),
      wirelessSharePct: pct(lineup.filter(isWireless).length, lineup.length),
      highPollingSharePct: pct(lineup.filter(mouse => mouse.specs.maxPollingHz >= 4000).length, lineup.length),
    };
  }).sort((a, b) => b.currentCount - a.currentCount || a.brand.localeCompare(b.brand));

  const brandRepresentationHhi = Math.round([...brandCounts.values()].reduce((sum, count) => sum + Math.pow(count / Math.max(total, 1), 2), 0) * 10_000);
  const featureAdoption: FeatureAdoptionRow[] = [
    { feature: "Wireless mode", enabledCount: current.filter(isWireless).length, knownCount: current.length, unknownCount: 0, shareOfKnownPct: pct(current.filter(isWireless).length, current.length) },
    { feature: "4K+ advertised polling", enabledCount: current.filter(mouse => mouse.specs.maxPollingHz >= 4000).length, knownCount: current.length, unknownCount: 0, shareOfKnownPct: pct(current.filter(mouse => mouse.specs.maxPollingHz >= 4000).length, current.length) },
    { feature: "8K advertised polling", enabledCount: current.filter(mouse => mouse.specs.maxPollingHz >= 8000).length, knownCount: current.length, unknownCount: 0, shareOfKnownPct: pct(current.filter(mouse => mouse.specs.maxPollingHz >= 8000).length, current.length) },
    { feature: "Non-mechanical primary switch", enabledCount: current.filter(mouse => mouse.specs.switchType !== "mechanical").length, knownCount: current.length, unknownCount: 0, shareOfKnownPct: pct(current.filter(mouse => mouse.specs.switchType !== "mechanical").length, current.length) },
    adoptionOptionalBoolean(current, "Web configuration", mouse => mouse.specs.webDriver),
    adoptionOptionalBoolean(current, "Driverless configuration", mouse => mouse.specs.driverless),
    adoptionOptionalNumber(current, "Onboard profiles", mouse => mouse.specs.onboardProfiles, value => value > 0),
    adoptionOptionalBoolean(current, "Tilt wheel", mouse => mouse.specs.tiltWheel),
  ];

  const weightPriceCorrelation = pearson(priced.map(mouse => [mouse.specs.weightG, mouse.msrpUsd as number]));
  const pollingPriceCorrelation = pearson(priced.map(mouse => [mouse.specs.maxPollingHz, mouse.msrpUsd as number]));

  const statements: InsightStatement[] = [
    { kind: "observed", title: "Current catalog mix", body: `${total} current mouse records are represented; ${priced.length} have an MSRP captured. ${pct(current.filter(isWireless).length, total)}% of current records include a wireless mode.`, evidence: ["Atlas catalog status, MSRP and connectivity fields"] },
    { kind: "observed", title: "High-polling price association", body: highPollingPriceDeltaUsd == null ? "The catalog does not yet contain enough priced products in both polling groups to compare average MSRP." : `Within the priced Atlas sample, 4K+ products average ${highPollingPriceDeltaUsd >= 0 ? "$" + highPollingPriceDeltaUsd + " more" : "$" + Math.abs(highPollingPriceDeltaUsd) + " less"} MSRP than lower-polling products. This is association, not causation.`, evidence: ["Atlas MSRP and advertised maximum polling fields"] },
    { kind: "observed", title: "Catalog representation concentration", body: `The current Atlas sample has a brand-representation HHI of ${brandRepresentationHhi}. This measures curation concentration inside Atlas only; it is not a market-concentration measure.`, evidence: ["Counts of current Atlas records by brand"] },
    { kind: "hypothesis", title: "Sparse combinations need customer evidence", body: "Shape × weight, shape × price and weight × price cells with few catalog records are useful research prompts, but curation bias, demand, manufacturing constraints and economics can all produce sparsity." },
    { kind: "evidence-needed", title: "What specifications cannot answer", body: "Opportunity sizing needs traffic, conversion, sales/rank history, customer sentiment, returns/reliability and willingness-to-pay evidence before a product recommendation is justified." },
  ];

  return {
    currentCount: total,
    pricedCount: priced.length,
    medianWeightG: median(current.map(mouse => mouse.specs.weightG)),
    medianMsrpUsd: median(priced.map(mouse => mouse.msrpUsd as number)),
    wirelessSharePct: pct(current.filter(isWireless).length, total),
    highPollingSharePct: pct(highPolling.length, total),
    highPollingPriceDeltaUsd,
    weightPriceCorrelation,
    pollingPriceCorrelation,
    catalogBrandRepresentationHhi: brandRepresentationHhi,
    shapeSegments,
    weightSegments,
    priceSegments,
    pollingSegments,
    lifecycleSegments,
    topBrands: [...brandCounts.entries()].map(([brand, count]) => ({ brand, count, sharePct: pct(count, total) })).sort((a, b) => b.count - a.count || a.brand.localeCompare(b.brand)).slice(0, 8),
    sparseShapeWeightCells,
    shapeWeightMatrix,
    shapePriceMatrix,
    weightPriceMatrix,
    featureAdoption,
    positions,
    brandPositioning,
    statements,
  };
}
