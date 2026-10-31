import { test } from "node:test";
import { strict as assert } from "node:assert";
import { demoCurve, driftMultiplier, importDriftPreview, validateCurve } from "../src/shared/drift";
import reference from "./drift-reference.json";

test("ported curves match 30 calculations from the inspected C# methods", () => {
  for (const row of reference) {
    const c = validateCurve({ ...demoCurve, kind: row.kind, acceleration: .01, points: row.kind === "lut" ? [{ speed: 2, output: 2 }, { speed: 10, output: 20 }] : [] });
    assert.ok(Math.abs(driftMultiplier(c, row.speed) - row.gain) < 1e-10 * Math.max(1, row.gain), `${row.kind} at ${row.speed}`);
  }
});

test("Drift Natural/Gain has a flat onset, continuous transition and bounded asymptote", () => {
  assert.equal(driftMultiplier(demoCurve, 0), 1);
  assert.equal(driftMultiplier(demoCurve, 5), 1);
  assert.ok(Math.abs(driftMultiplier(demoCurve, 5.0000001) - 1) < 1e-12);
  let last = 1;
  for (let speed = 0; speed < 200; speed += .1) { const gain = driftMultiplier(demoCurve, speed); assert.ok(gain >= last - 1e-12 && gain < 1.5); last = gain; }
  assert.ok(Math.abs(driftMultiplier(demoCurve, 1e9) - 1.5) < 1e-8);
});
test("Classic gain matches Drift's uncapped exponent-two equation", () => {
  const c = validateCurve({ ...demoCurve, kind: "classic", baseGain: .5, offset: 0, acceleration: .01 });
  assert.equal(driftMultiplier(c, 50), .75);
});
test("LUT interpolates output velocity, uses first ratio and extrapolates the last segment", () => {
  const c = validateCurve({ ...demoCurve, kind: "lut", points: [{ speed: 2, output: 2 }, { speed: 10, output: 20 }] });
  assert.equal(driftMultiplier(c, 0), 1);
  assert.equal(driftMultiplier(c, 6), 11 / 6);
  assert.equal(driftMultiplier(c, 20), 42.5 / 20);
});
test("SavedProfile import respects reference distance and strips personal/evidence fields", () => {
  const response = { CurveKind: "natural", BaseGain: 1, YRatio: 1, Limit: 1.5, Offset: 5, Decay: .1, Acceleration: 0, Points: [] };
  const p = importDriftPreview(JSON.stringify({ Schema: 1, Name: "Private", Payload: "ignored", SourceSession: { secret: true }, Setup: { Dpi: 800, ReferenceCm360: 40 }, Response: response }));
  assert.equal(p.baseCm, 40); assert.ok(!JSON.stringify(p).includes("Private")); assert.ok(!("SourceSession" in p));
  assert.deepEqual(importDriftPreview(JSON.stringify(p)), p);
});
test("imports reject unknown modes, bad scales, unsupported schemas and collapsing float32 knots", () => {
  assert.throws(() => validateCurve({ ...demoCurve, kind: "jump" }));
  assert.throws(() => validateCurve({ ...demoCurve, baseGain: Infinity }));
  assert.throws(() => validateCurve({ ...demoCurve, kind: "lut", points: [{ speed: 1, output: 1 }, { speed: 1 + 1e-10, output: 2 }] }));
  assert.throws(() => importDriftPreview('{"Schema":2}'));
});
