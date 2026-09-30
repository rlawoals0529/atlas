import type { MouseProduct } from "./types";

export type ShapeView = "top" | "side";
export type AlignMode = "center" | "front" | "rear" | "sensor";
export type SimilarityMode = "balanced" | "claw" | "fingertip" | "palm";
export type Point = [number, number];

const clamp = (n: number, min = 0, max = 1) => Math.max(min, Math.min(max, n));
const humpPct = (m: MouseProduct) => m.geometry?.humpPositionPct ?? (m.specs.hump === "rear" ? 78 : m.specs.hump === "center-rear" ? 65 : m.specs.hump === "front" ? 35 : 50);
const gripWidth = (m: MouseProduct) => m.specs.gripWidthMm ?? m.specs.widthMm * .84;
const frontHeight = (m: MouseProduct) => m.specs.frontHeightMm ?? Math.max(18, m.specs.heightMm * .55);
const geometryValue = (m: MouseProduct, key: keyof NonNullable<MouseProduct["geometry"]>, fallback: number) => {
  const value = m.geometry?.[key];
  return typeof value === "number" ? value : fallback;
};

/**
 * Parametric fallback outline built from Atlas dimensions and geometry fields.
 * Explicit measured/scan outlines always win in outlineFor(). The fallback uses
 * denser rounded stations than the old archetype so the published length, width,
 * grip width and height drive the visible shell instead of a generic slab shape.
 */
const smooth = (t: number) => {
  const n = clamp(t);
  return n * n * (3 - 2 * n);
};
const interpolateStations = (p: number, stations: [number, number][]) => {
  const index = stations.findIndex(([x]) => x >= p);
  if (index <= 0) return stations[0][1];
  if (index < 0) return stations[stations.length - 1][1];
  const [x1, y1] = stations[index - 1];
  const [x2, y2] = stations[index];
  const t = smooth((p - x1) / Math.max(.0001, x2 - x1));
  return y1 + (y2 - y1) * t;
};

export function topOutline(mouse: MouseProduct): Point[] {
  const L = mouse.specs.lengthMm;
  const W = mouse.specs.widthMm;
  const GW = Math.min(W, gripWidth(mouse));
  const frontFlare = (mouse.geometry?.frontFlare ?? ({ low: 30, medium: 55, high: 78 }[mouse.specs.frontFlare])) / 100;
  const rearFlare = (mouse.geometry?.rearFlare ?? 58) / 100;
  const taper = (mouse.geometry?.sideTaper ?? (mouse.specs.sideCurvature === "aggressive" ? 72 : mouse.specs.sideCurvature === "mild" ? 52 : 34)) / 100;
  const waist = Math.min(W * .47, GW * .5) * (1 - taper * .015);
  const frontShoulder = W * (.41 + frontFlare * .055);
  const rearShoulder = W * (.42 + rearFlare * .065);
  const stations: [number, number][] = [
    [0, W * (.18 + frontFlare * .025)],
    [.035, W * (.27 + frontFlare * .035)],
    [.09, W * (.37 + frontFlare * .045)],
    [.17, frontShoulder],
    [.28, Math.max(waist * 1.035, W * .405)],
    [.43, waist],
    [.55, waist * .985],
    [.66, Math.max(waist * 1.035, W * .405)],
    [.78, rearShoulder],
    [.88, W * (.40 + rearFlare * .045)],
    [.95, W * (.31 + rearFlare * .025)],
    [1, W * .18],
  ];
  const samples = Array.from({ length: 49 }, (_, index) => index / 48);
  const ergo = mouse.specs.shape === "ergonomic";
  const right = samples.map(p => {
    const half = interpolateStations(p, stations);
    const asymmetry = ergo ? W * .018 * Math.sin(p * Math.PI) : 0;
    return [p * L, -(half - asymmetry)] as Point;
  });
  const left = [...samples].reverse().map(p => {
    const half = interpolateStations(p, stations);
    const asymmetry = ergo ? W * .032 * Math.sin(p * Math.PI) : 0;
    return [p * L, half + asymmetry] as Point;
  });
  return [...right, ...left];
}

export function sideOutline(mouse: MouseProduct): Point[] {
  const L = mouse.specs.lengthMm;
  const H = mouse.specs.heightMm;
  const front = frontHeight(mouse);
  const hp = clamp(humpPct(mouse) / 100, .25, .82);
  const fullness = clamp((mouse.geometry?.humpFullness ?? 55) / 100);
  const samples = Array.from({ length: 49 }, (_, index) => index / 48);
  const upper = samples.map(p => {
    const noseRise = .48 + .52 * smooth(p / .16);
    const deck = front * noseRise * (1 - .08 * smooth((p - .18) / .30));
    const sigma = .16 + fullness * .07;
    const hump = Math.max(0, H - front * .9) * Math.exp(-((p - hp) ** 2) / (2 * sigma * sigma));
    const rearFall = p <= hp ? 1 : 1 - .72 * smooth((p - hp) / Math.max(.01, 1 - hp));
    const shellHeight = Math.max(H * .16, Math.min(H, (deck + hump) * rearFall));
    return [p * L, -shellHeight] as Point;
  });
  const lower = [...samples].reverse().map(p => [p * L, 0] as Point);
  return [...upper, ...lower];
}

export function outlineFor(mouse: MouseProduct, view: ShapeView): Point[] {
  const explicit = mouse.outline?.[view];
  return explicit?.length ? explicit : (view === "top" ? topOutline(mouse) : sideOutline(mouse));
}

export function alignmentOffset(mouse: MouseProduct, mode: AlignMode): number {
  const L = mouse.specs.lengthMm;
  if (mode === "front") return 0;
  if (mode === "rear") return L;
  if (mode === "sensor") return L / 2 + (mouse.geometry?.sensorOffsetMm ?? 0);
  return L / 2;
}

export interface SimilarShapeResult {
  mouse: MouseProduct;
  score: number;
  distance: number;
  reasons: string[];
  differences: string[];
  components: Record<string, number>;
  mode: SimilarityMode;
}

const diffScore = (a: number, b: number, scale: number) => Math.max(0, 100 - Math.abs(a - b) * scale);

const MODE_WEIGHTS: Record<SimilarityMode, Record<string, number>> = {
  balanced: {
    length: .12, gripWidth: .17, height: .10, humpPosition: .13, frontHeight: .07,
    rearFlare: .08, sideTaper: .08, humpFullness: .08, buttonHeight: .04,
    pinkyClearance: .04, sensorPosition: .04, shapeFamily: .05,
  },
  claw: {
    length: .08, gripWidth: .18, height: .09, humpPosition: .17, frontHeight: .05,
    rearFlare: .12, sideTaper: .09, humpFullness: .11, buttonHeight: .03,
    pinkyClearance: .03, sensorPosition: .02, shapeFamily: .03,
  },
  fingertip: {
    length: .16, gripWidth: .21, height: .10, humpPosition: .07, frontHeight: .11,
    rearFlare: .04, sideTaper: .10, humpFullness: .03, buttonHeight: .07,
    pinkyClearance: .04, sensorPosition: .04, shapeFamily: .03,
  },
  palm: {
    length: .11, gripWidth: .13, height: .14, humpPosition: .12, frontHeight: .04,
    rearFlare: .11, sideTaper: .06, humpFullness: .13, buttonHeight: .02,
    pinkyClearance: .04, sensorPosition: .02, shapeFamily: .08,
  },
};

export function shapeSimilarity(base: MouseProduct, candidate: MouseProduct, mode: SimilarityMode = "balanced"): SimilarShapeResult {
  const aH = humpPct(base), bH = humpPct(candidate);
  const aG = gripWidth(base), bG = gripWidth(candidate);
  const components = {
    length: diffScore(base.specs.lengthMm, candidate.specs.lengthMm, 5.2),
    gripWidth: diffScore(aG, bG, 8.0),
    height: diffScore(base.specs.heightMm, candidate.specs.heightMm, 9.0),
    humpPosition: diffScore(aH, bH, 2.3),
    frontHeight: diffScore(frontHeight(base), frontHeight(candidate), 7.5),
    rearFlare: diffScore(geometryValue(base, "rearFlare", 55), geometryValue(candidate, "rearFlare", 55), 1.1),
    sideTaper: diffScore(geometryValue(base, "sideTaper", 50), geometryValue(candidate, "sideTaper", 50), 1.0),
    humpFullness: diffScore(geometryValue(base, "humpFullness", 55), geometryValue(candidate, "humpFullness", 55), .9),
    buttonHeight: diffScore(geometryValue(base, "buttonHeight", 55), geometryValue(candidate, "buttonHeight", 55), .8),
    pinkyClearance: diffScore(geometryValue(base, "pinkyClearance", 55), geometryValue(candidate, "pinkyClearance", 55), .75),
    sensorPosition: diffScore(geometryValue(base, "sensorOffsetMm", 0), geometryValue(candidate, "sensorOffsetMm", 0), 4.0),
    shapeFamily: base.specs.shape === candidate.specs.shape ? 100 : 42,
  };
  const weights = MODE_WEIGHTS[mode];
  const score = Math.round(Object.entries(weights).reduce((sum, [key, weight]) => sum + (components[key as keyof typeof components] ?? 0) * weight, 0));

  const reasons: string[] = [];
  const differences: string[] = [];
  const dL = candidate.specs.lengthMm - base.specs.lengthMm;
  const dG = bG - aG;
  const dHt = candidate.specs.heightMm - base.specs.heightMm;
  const dHp = bH - aH;
  const dFront = frontHeight(candidate) - frontHeight(base);
  const dRear = geometryValue(candidate, "rearFlare", 55) - geometryValue(base, "rearFlare", 55);
  const dTaper = geometryValue(candidate, "sideTaper", 50) - geometryValue(base, "sideTaper", 50);

  if (Math.abs(dL) <= 2) reasons.push("Nearly identical overall length");
  else differences.push(`${Math.abs(dL).toFixed(1)} mm ${dL > 0 ? "longer" : "shorter"}`);
  if (Math.abs(dG) <= 1.3) reasons.push("Very close grip width");
  else differences.push(`${Math.abs(dG).toFixed(1)} mm ${dG > 0 ? "wider" : "narrower"} at grip`);
  if (Math.abs(dHt) <= 1.5) reasons.push("Similar peak height");
  else differences.push(`${Math.abs(dHt).toFixed(1)} mm ${dHt > 0 ? "taller" : "lower"}`);
  if (Math.abs(dHp) <= 5) reasons.push("Hump peaks in a similar position");
  else differences.push(`Hump sits ${Math.round(Math.abs(dHp))}% ${dHp > 0 ? "farther rearward" : "farther forward"}`);
  if (Math.abs(dFront) > 1.4) differences.push(`${Math.abs(dFront).toFixed(1)} mm ${dFront > 0 ? "higher" : "lower"} front`);
  if (Math.abs(dRear) > 12) differences.push(`${dRear > 0 ? "Fuller" : "narrower"} rear flare`);
  if (Math.abs(dTaper) > 14) differences.push(`${dTaper > 0 ? "More" : "less"} side taper`);
  if (base.specs.shape === candidate.specs.shape) reasons.push(`Same ${base.specs.shape} family`);
  else differences.push(`${candidate.specs.shape} rather than ${base.specs.shape}`);

  if (mode === "claw" && components.humpPosition >= 88 && components.rearFlare >= 84) reasons.push("Rear contact geometry is especially close for claw-style anchoring");
  if (mode === "fingertip" && components.gripWidth >= 88 && components.frontHeight >= 84) reasons.push("Front/grip geometry is especially close for fingertip control");
  if (mode === "palm" && components.humpFullness >= 86 && components.height >= 86) reasons.push("Palm-fill geometry is especially close");

  return { mouse: candidate, score, distance: 100 - score, reasons, differences, components, mode };
}

export function findSimilarShapes(base: MouseProduct, all: MouseProduct[], mode: SimilarityMode = "balanced") {
  return all
    .filter(m => m.id !== base.id)
    .map(m => shapeSimilarity(base, m, mode))
    .sort((a, b) => b.score - a.score);
}
