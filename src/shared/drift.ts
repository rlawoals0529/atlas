import { cm360 } from "./sensitivity";

// Port of Drift Candidate.Multiplier, MathUtil.NaturalGain and
// CurveMath.VelocityRatio. See docs/DRIFT_INTEGRATION.md for source hashes.
export type DriftCurve = {
  kind: "natural" | "classic" | "lut";
  baseGain: number; yRatio: number; limit: number; offset: number;
  decay: number; acceleration: number;
  points: { speed: number; output: number }[];
};
export type DriftPreview = { schema: 1; format: "atlas-drift-preview"; dpi: number; baseCm: number; curve: DriftCurve };
export const demoCurve: DriftCurve = { kind: "natural", baseGain: 1, yRatio: 1, limit: 1.5, offset: 5, decay: .1, acceleration: 0, points: [] };
function number(value: unknown, label: string, min: number, max: number, exclusive = false): number {
  if (typeof value !== "number" || !Number.isFinite(value) || (exclusive ? value <= min : value < min) || value > max) throw new Error(`${label} must be ${exclusive ? "above" : "at least"} ${min} and at most ${max}.`);
  return value;
}
function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Expected a Drift profile object.");
  return value as Record<string, unknown>;
}
export function validateCurve(value: unknown): DriftCurve {
  const c = object(value);
  if (c.kind !== "natural" && c.kind !== "classic" && c.kind !== "lut") throw new Error("Supported curves: Natural / Gain, Classic exponent 2 / Gain, and LUT / Velocity.");
  const curve: DriftCurve = {
    kind: c.kind, baseGain: number(c.baseGain, "Multiplier", 0, 5, true), yRatio: number(c.yRatio, "Y/X", .25, 4),
    limit: number(c.limit, "Limit", 1, 3), offset: number(c.offset, "Offset", 0, 100000),
    decay: number(c.decay, "Decay", 0, 1000), acceleration: number(c.acceleration, "Acceleration", 0, 1), points: [],
  };
  if (!Array.isArray(c.points)) throw new Error("Curve points must be an array.");
  if (curve.kind === "lut") {
    if (c.points.length < 2 || c.points.length > 257) throw new Error("LUT needs 2–257 velocity points.");
    curve.points = c.points.map(item => { const p = object(item); return { speed: Math.fround(number(p.speed, "Point speed", 0, 1000000, true)), output: Math.fround(number(p.output, "Point output", 0, 3000000, true)) }; });
    curve.points.forEach((p, i) => {
      if (p.output / p.speed < .1 || p.output / p.speed > 3 || (i && (p.speed <= curve.points[i - 1].speed || p.output <= curve.points[i - 1].output))) throw new Error("LUT speeds and output must increase; each output/input ratio must be 0.1–3.");
    });
  } else {
    if (c.points.length) throw new Error("Non-LUT curves must not contain points.");
    if (curve.kind === "classic" && curve.acceleration <= 0) throw new Error("Classic acceleration must be positive.");
    if (curve.kind === "natural" && curve.limit > 1.000001 && curve.decay <= 0) throw new Error("Natural curves with a boost need positive decay.");
  }
  return curve;
}
export function driftMultiplier(c: DriftCurve, speed: number): number {
  if (!Number.isFinite(speed) || speed < 0) throw new Error("Input speed must be nonnegative.");
  if (c.kind === "classic") return c.baseGain * (speed <= c.offset || speed <= 0 ? 1 : 1 + c.acceleration * (speed - c.offset) ** 2 / speed);
  if (c.kind === "lut") {
    const p = c.points;
    if (speed <= p[0].speed) return c.baseGain * p[0].output / p[0].speed;
    let hi = p.findIndex(point => point.speed >= speed);
    if (hi < 0) hi = p.length - 1;
    const a = p[hi - 1], b = p[hi];
    return c.baseGain * (a.output + (speed - a.speed) / (b.speed - a.speed) * (b.output - a.output)) / speed;
  }
  if (speed <= c.offset || speed <= 0 || c.limit <= 1.00000001 || c.decay <= 0) return c.baseGain;
  const range = c.limit - 1, a = c.decay / range, u = a * (speed - c.offset);
  const term = Math.abs(u) < .0001 ? u * u * (.5 - u / 6 + u * u / 24) : Math.expm1(-u) + u;
  return c.baseGain * (1 + range * term / (a * speed));
}
export function importDriftPreview(text: string): DriftPreview {
  if (text.length > 12 * 1024 * 1024) throw new Error("Use a profile smaller than 12 MiB.");
  const value = object(JSON.parse(text));
  let curve: DriftCurve, dpi: number, baseCm: number;
  if (value.format === "atlas-drift-preview" && value.schema === 1) {
    curve = validateCurve(value.curve); dpi = number(value.dpi, "DPI", 100, 50000); baseCm = number(value.baseCm, "Base cm/360", 0, 2000, true);
  } else {
    if (value.Schema !== 1) throw new Error("Use a Drift SavedProfile (Schema 1) or an Atlas preview export. Raw Accel settings.json is a different format.");
    const s = object(value.Setup), r = object(value.Response);
    if (Array.isArray(r.Points) && r.Points.length > 257) throw new Error("LUT supports at most 257 velocity points.");
    dpi = number(s.Dpi, "DPI", 100, 50000);
    if (typeof s.ReferenceCm360 === "number" && s.ReferenceCm360 > 0) baseCm = number(s.ReferenceCm360, "Reference cm/360", 0, 2000, true);
    else baseCm = cm360(dpi, number(s.CsSensitivity, "Game sensitivity", 0, 10000, true), number(s.CsYaw, "Yaw", 0, 1, true))!;
    curve = validateCurve({ kind: r.CurveKind, baseGain: r.BaseGain, yRatio: r.YRatio, limit: r.Limit, offset: r.Offset, decay: r.Decay, acceleration: r.Acceleration,
      points: Array.isArray(r.Points) ? r.Points.map(item => { const p = object(item); return { speed: p.Speed, output: p.Output }; }) : r.Points });
  }
  if (!Number.isFinite(baseCm) || baseCm <= 0 || baseCm > 2000 || !Number.isInteger(dpi)) throw new Error("Use whole-number DPI and a baseline distance up to 2000 cm.");
  // Deliberate allowlist: never retain names, paths, payloads, sessions or claims of verification.
  return { schema: 1, format: "atlas-drift-preview", dpi, baseCm, curve };
}
