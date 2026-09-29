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
 * Parametric outline built only from Input Atlas' own dimensions/geometry model.
 * It is deliberately labelled approximate. A future measured SVG/scan can replace
 * these points via MouseProduct.outline without changing the overlay UI.
 */
export function topOutline(mouse: MouseProduct): Point[] {
  const L = mouse.specs.lengthMm;
  const W = mouse.specs.widthMm;
  const GW = gripWidth(mouse);
  const frontFlare = mouse.geometry?.frontFlare ?? ({ low: 30, medium: 55, high: 78 }[mouse.specs.frontFlare]);
  const rearFlare = mouse.geometry?.rearFlare ?? 58;
  const taper = mouse.geometry?.sideTaper ?? (mouse.specs.sideCurvature === "aggressive" ? 72 : mouse.specs.sideCurvature === "mild" ? 52 : 34);
  const ergo = mouse.specs.shape === "ergonomic";
  const leftBias = ergo ? .035 * W : 0;
  const rightBias = ergo ? -.015 * W : 0;
  const half = (x: number) => {
    const p = x / L;
    if (p < .17) return W * (.37 + frontFlare / 100 * .08 + p * .12);
    if (p < .55) {
      const t = (p - .17) / .38;
      return (W * .45) * (1 - t) + (GW * .5) * t - taper / 100 * W * .025 * Math.sin(t * Math.PI);
    }
    const t = (p - .55) / .45;
    return (GW * .5) * (1 - t) + W * (.40 + rearFlare / 100 * .095) * Math.sin((1 - t) * Math.PI / 2) * t + W * .19 * t;
  };
  const xs = [0, .06, .13, .22, .34, .48, .62, .75, .87, .95, 1].map(v => v * L);
  const top = xs.map(x => [x, -half(x) + (x / L) * rightBias] as Point);
  const bottom = [...xs].reverse().map(x => [x, half(x) + (x / L) * leftBias] as Point);
  return [...top, ...bottom];
}

export function sideOutline(mouse: MouseProduct): Point[] {
  const L = mouse.specs.lengthMm;
  const H = mouse.specs.heightMm;
  const front = frontHeight(mouse);
  const hp = clamp(humpPct(mouse) / 100, .22, .84) * L;
  const fullness = (mouse.geometry?.humpFullness ?? 55) / 100;
  const xs = [0, .05, .12, .2, .3, .4, .5, .6, .7, .8, .9, 1].map(v => v * L);
  const upper = xs.map(x => {
    const sigma = L * (.20 + fullness * .055);
    const hump = (H - front) * Math.exp(-((x - hp) ** 2) / (2 * sigma * sigma));
    const nose = front * (.70 + .30 * Math.sin(Math.min(1, x / (L * .22)) * Math.PI / 2));
    const rearDrop = x > hp ? H * Math.pow((x - hp) / (L - hp), 1.55) * .68 : 0;
    return [x, -(Math.min(H, nose + hump) - rearDrop)] as Point;
  });
  const lower = [...xs].reverse().map(x => [x, 0] as Point);
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
