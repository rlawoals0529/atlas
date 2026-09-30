import type { MouseProduct } from "./types";

export interface SegmentCount {
  label: string;
  count: number;
  sharePct: number;
}

export interface ProductInsights {
  currentCount: number;
  medianWeightG: number | null;
  medianMsrpUsd: number | null;
  wirelessSharePct: number;
  highPollingSharePct: number;
  highPollingPriceDeltaUsd: number | null;
  shapeSegments: SegmentCount[];
  weightSegments: SegmentCount[];
  priceSegments: SegmentCount[];
  pollingSegments: SegmentCount[];
  topBrands: Array<{ brand: string; count: number }>;
  sparseShapeWeightCells: Array<{ label: string; count: number }>;
}

const median = (values: number[]) => {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
};

const average = (values: number[]) => values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;

const segment = (label: string, count: number, total: number): SegmentCount => ({
  label,
  count,
  sharePct: total ? Math.round((count / total) * 100) : 0,
});

const isWireless = (mouse: MouseProduct) => mouse.specs.connectivity.some(value => {
  const text = value.toLowerCase();
  return text.includes("wireless") || text.includes("2.4") || text.includes("bluetooth");
});

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
    { label: "50-59 g", matches: (mouse: MouseProduct) => mouse.specs.weightG >= 50 && mouse.specs.weightG < 60 },
    { label: "60-69 g", matches: (mouse: MouseProduct) => mouse.specs.weightG >= 60 && mouse.specs.weightG < 70 },
    { label: "70+ g", matches: (mouse: MouseProduct) => mouse.specs.weightG >= 70 },
  ];

  const weightSegments = weightBands.map(band => segment(band.label, current.filter(band.matches).length, total));
  const priceSegments = [
    segment("<$80", priced.filter(mouse => (mouse.msrpUsd ?? Infinity) < 80).length, priced.length),
    segment("$80-119", priced.filter(mouse => (mouse.msrpUsd ?? 0) >= 80 && (mouse.msrpUsd ?? Infinity) < 120).length, priced.length),
    segment("$120-159", priced.filter(mouse => (mouse.msrpUsd ?? 0) >= 120 && (mouse.msrpUsd ?? Infinity) < 160).length, priced.length),
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
    return {
      label: `${shape.label} / ${band.label}`,
      count: current.filter(mouse => mouse.specs.shape === shapeValue && band.matches(mouse)).length,
    };
  })).sort((a, b) => a.count - b.count || a.label.localeCompare(b.label)).slice(0, 4);

  return {
    currentCount: total,
    medianWeightG: median(current.map(mouse => mouse.specs.weightG)),
    medianMsrpUsd: median(priced.map(mouse => mouse.msrpUsd as number)),
    wirelessSharePct: total ? Math.round((current.filter(isWireless).length / total) * 100) : 0,
    highPollingSharePct: total ? Math.round((highPolling.length / total) * 100) : 0,
    highPollingPriceDeltaUsd: highPollingPrice != null && standardPollingPrice != null ? Math.round(highPollingPrice - standardPollingPrice) : null,
    shapeSegments,
    weightSegments,
    priceSegments,
    pollingSegments,
    topBrands: [...brandCounts.entries()].map(([brand, count]) => ({ brand, count })).sort((a, b) => b.count - a.count || a.brand.localeCompare(b.brand)).slice(0, 6),
    sparseShapeWeightCells,
  };
}
