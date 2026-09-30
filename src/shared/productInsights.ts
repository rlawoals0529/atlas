import { shapeSimilarity } from "./shape";
import type { MouseProduct } from "./types";

export type FindingKind = "observed" | "hypothesis" | "evidence-needed" | "recommendation";

export interface SegmentCount {
  label: string;
  count: number;
  sharePct: number;
}

export interface ProductPosition {
  productId: string;
  brand: string;
  model: string;
  weightG: number;
  msrpUsd: number | null;
  pollingHz: number;
  shape: "symmetrical" | "ergonomic";
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
  shapeSegments: SegmentCount[];
  weightSegments: SegmentCount[];
  priceSegments: SegmentCount[];
  pollingSegments: SegmentCount[];
  topBrands: Array<{ brand: string; count: number; sharePct: number }>;
  sparseShapeWeightCells: Array<{ label: string; count: number }>;
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

  const shapeSegments = [
    segment("Symmetrical", current.filter(mouse => mouse.specs.shape === "symmetrical").length, total),
    segment("Ergonomic", current.filter(mouse => mouse.specs.shape === "ergonomic").length, total),
  ];

  const weightBands = [
    { label: "<50 g", matches: (mouse: MouseProduct) => mouse.specs.weightG < 50 },
    { label: "50–59 g", matches: (mouse: MouseProduct) => mouse.specs.weightG >= 50 && mouse.specs.weightG < 60 },
    { label: "60–69 g", matches: (mouse: MouseProduct) => mouse.specs.weightG >= 60 && mouse.specs.weightG < 70 },
    { label: "70+ g", matches: (mouse: MouseProduct) => mouse.specs.weightG >= 70 },
  ];
  const weightSegments = weightBands.map(band => segment(band.label, current.filter(band.matches).length, total));

  const priceSegments = [
    segment("<$80", priced.filter(mouse => (mouse.msrpUsd ?? Infinity) < 80).length, priced.length),
    segment("$80–119", priced.filter(mouse => (mouse.msrpUsd ?? 0) >= 80 && (mouse.msrpUsd ?? Infinity) < 120).length, priced.length),
    segment("$120–159", priced.filter(mouse => (mouse.msrpUsd ?? 0) >= 120 && (mouse.msrpUsd ?? Infinity) < 160).length, priced.length),
    segment("$160+", priced.filter(mouse => (mouse.msrpUsd ?? 0) >= 160).length, priced.length),
  ];

  const pollingSegments = [
    segment("1K or lower", current.filter(mouse => mouse.specs.maxPollingHz <= 1000).length, total),
    segment("2K", current.filter(mouse => mouse.specs.maxPollingHz === 2000).length, total),
    segment("4K", current.filter(mouse => mouse.specs.maxPollingHz === 4000).length, total),
    segment("8K+", current.filter(mouse => mouse.specs.maxPollingHz >= 8000).length, total),
  ];

  const sparseShapeWeightCells = shapeSegments.flatMap(shape => weightBands.map(band => {
    const shapeValue = shape.label === "Symmetrical" ? "symmetrical" : "ergonomic";
    return { label: `${shape.label} / ${band.label}`, count: current.filter(mouse => mouse.specs.shape === shapeValue && band.matches(mouse)).length };
  })).sort((a, b) => a.count - b.count || a.label.localeCompare(b.label)).slice(0, 6);

  const highPollingPriceDeltaUsd = highPollingPrice != null && standardPollingPrice != null ? Math.round(highPollingPrice - standardPollingPrice) : null;
  const positions = current.map(mouse => ({ productId: mouse.id, brand: mouse.brand, model: mouse.model, weightG: mouse.specs.weightG, msrpUsd: mouse.msrpUsd ?? null, pollingHz: mouse.specs.maxPollingHz, shape: mouse.specs.shape }));

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

  const statements: InsightStatement[] = [
    { kind: "observed", title: "Current catalog mix", body: `${total} current mouse records are represented; ${priced.length} have an MSRP captured. ${pct(current.filter(isWireless).length, total)}% of current records include a wireless mode.`, evidence: ["Atlas catalog status, MSRP and connectivity fields"] },
    { kind: "observed", title: "High-polling price association", body: highPollingPriceDeltaUsd == null ? "The catalog does not yet contain enough priced products in both polling groups to compare average MSRP." : `Within the priced Atlas sample, 4K+ products average ${highPollingPriceDeltaUsd >= 0 ? "$" + highPollingPriceDeltaUsd + " more" : "$" + Math.abs(highPollingPriceDeltaUsd) + " less"} MSRP than lower-polling products. This is association, not causation.`, evidence: ["Atlas MSRP and advertised maximum polling fields"] },
    { kind: "hypothesis", title: "Sparse combinations need customer evidence", body: "Shape × weight cells with few catalog records are useful research prompts, but curation bias, demand, manufacturing constraints and economics can all produce sparsity." },
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
    shapeSegments,
    weightSegments,
    priceSegments,
    pollingSegments,
    topBrands: [...brandCounts.entries()].map(([brand, count]) => ({ brand, count, sharePct: pct(count, total) })).sort((a, b) => b.count - a.count || a.brand.localeCompare(b.brand)).slice(0, 8),
    sparseShapeWeightCells,
    positions,
    brandPositioning,
    statements,
  };
}
