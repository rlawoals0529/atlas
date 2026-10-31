import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { demoCurve, driftMultiplier, importDriftPreview, type DriftCurve, type DriftPreview } from "../shared/drift";
import "./drift-desk.css";

const fmt = (n: number) => Number.isFinite(n) ? n.toFixed(2) : "-";
function CurvePlot({ curve, probe }: { curve: DriftCurve; probe: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const draw = () => {
      const width = canvas.clientWidth, height = 260, dpr = window.devicePixelRatio || 1;
      if (!width) return;
      canvas.width = width * dpr; canvas.height = height * dpr;
      const ctx = canvas.getContext("2d"); if (!ctx) return;
      ctx.scale(dpr, dpr); const left = 42, top = 18, w = width - 58, h = 208;
      const peak = Math.max(...Array.from({ length: 321 }, (_, i) => driftMultiplier(curve, i / 4)), ...curve.points.filter(p => p.speed <= 80).map(p => driftMultiplier(curve, p.speed)));
      const max = Math.max(1.8, peak * 1.08);
      const x = (v: number) => left + v / 80 * w, y = (v: number) => top + h - v / max * h;
      ctx.font = "11px system-ui"; ctx.lineWidth = 1; ctx.textAlign = "right";
      for (let i = 0; i <= 4; i++) {
        const v = max * i / 4; ctx.strokeStyle = "#2a3a46"; ctx.beginPath(); ctx.moveTo(left, y(v)); ctx.lineTo(left + w, y(v)); ctx.stroke();
        ctx.fillStyle = "#a6b5c1"; ctx.fillText(v.toFixed(1), left - 8, y(v) + 4);
      }
      ctx.textAlign = "center";
      for (let v = 0; v <= 80; v += 20) { ctx.fillStyle = "#a6b5c1"; ctx.fillText(String(v), x(v), top + h + 22); }
      ctx.setLineDash([4, 4]); ctx.strokeStyle = "#a6b5c1"; ctx.beginPath(); ctx.moveTo(left, y(1)); ctx.lineTo(left + w, y(1)); ctx.stroke(); ctx.setLineDash([]);
      ctx.strokeStyle = "#69c9f5"; ctx.lineWidth = 2.5; ctx.beginPath();
      for (let i = 0; i <= 320; i++) { const v = i / 4; if (!i) ctx.moveTo(x(v), y(driftMultiplier(curve, v))); else ctx.lineTo(x(v), y(driftMultiplier(curve, v))); } ctx.stroke();
      ctx.strokeStyle = "#fc9775"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x(probe), top); ctx.lineTo(x(probe), top + h); ctx.stroke();
      ctx.fillStyle = "#fc9775"; ctx.beginPath(); ctx.arc(x(probe), y(driftMultiplier(curve, probe)), 4, 0, Math.PI * 2); ctx.fill();
    };
    const observer = new ResizeObserver(draw); observer.observe(canvas); draw(); return () => observer.disconnect();
  }, [curve, probe]);
  return <figure className="drift-plot"><figcaption><b>Horizontal response</b><span>Solid: curve � dashed: neutral 1x � orange: speed probe</span></figcaption><canvas ref={ref} role="img" aria-label="Calculated sensitivity multiplier against input speed, from zero to 80 counts per millisecond. Exact probe values are listed below."/><div className="drift-axis"><span>Sensitivity multiplier x</span><span>Input speed � counts/ms</span></div></figure>;
}

export default function DriftCurveDesk({ baselineCm, dpi }: { baselineCm: number | null; dpi: number }) {
  const [curve, setCurve] = useState<DriftCurve>({ ...demoCurve });
  const [imported, setImported] = useState<DriftPreview | null>(null);
  const [status, setStatus] = useState("Example curve loaded. Test changes in Drift before using them in-game.");
  const [error, setError] = useState("");
  const [probe, setProbe] = useState(20);
  const [pasted, setPasted] = useState("");
  const base = imported?.baseCm ?? baselineCm, actualDpi = imported?.dpi ?? dpi;
  const valid = base !== null && Number.isFinite(base) && base > 0 && base <= 2000 && Number.isInteger(actualDpi) && actualDpi >= 100 && actualDpi <= 50000;
  const gain = driftMultiplier(curve, probe), slow = driftMultiplier(curve, 0);
  const change = (key: keyof Pick<DriftCurve, "baseGain" | "yRatio" | "offset" | "limit" | "decay" | "acceleration">, value: string) => {
    setCurve(c => { const next = { ...c, [key]: Number(value) }; if (next.kind === "natural" && next.limit > 1.000001 && next.decay <= 0) next.decay = .001; return next; }); setStatus("Curve updated. Ready to compare in Drift.");
  };
  const load = (text: string) => {
    try { const p = importDriftPreview(text); setCurve(p.curve); setImported(p); setError(""); setPasted(""); setStatus("Profile loaded. Showing its curve, DPI and baseline distance."); }
    catch (e) { setError(e instanceof Error ? e.message : "Could not read this profile."); }
  };
  const file = async (event: ChangeEvent<HTMLInputElement>) => {
    const f = event.target.files?.[0]; if (!f) return;
    if (f.size > 12 * 1024 * 1024) setError("Choose a profile smaller than 12 MiB.");
    else { try { load(await f.text()); } catch { setError("Could not read that file."); } }
    event.target.value = "";
  };
  const download = () => {
    if (!valid) return;
    const payload: DriftPreview = { schema: 1, format: "atlas-drift-preview", dpi: actualDpi, baseCm: base!, curve };
    const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }));
    const a = document.createElement("a"); a.href = url; a.download = "atlas-drift-preview.json"; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus("Preview saved. Reopen this JSON in Atlas to continue editing.");
  };
  const controls = [
    { key: "baseGain", label: "Base multiplier", min: Math.min(.05, curve.baseGain), max: 5, step: .01 },
    { key: "yRatio", label: "Y/X ratio", min: .25, max: 4, step: .01 },
    ...(curve.kind === "natural" ? [{ key: "offset", label: "Input offset � counts/ms", min: 0, max: Math.max(40, curve.offset), step: .1 }, { key: "limit", label: "Boost limit � relative to base", min: 1, max: 3, step: .01 }, { key: "decay", label: "Decay rate", min: .001, max: Math.max(1, curve.decay), step: .001 }] : curve.kind === "classic" ? [{ key: "offset", label: "Input offset � counts/ms", min: 0, max: Math.max(40, curve.offset), step: .1 }, { key: "acceleration", label: "Acceleration � uncapped", min: .001, max: 1, step: .001 }] : []),
  ] as const;
  return <section className="drift-desk" aria-labelledby="drift-heading">
    <header className="drift-heading"><div><span className="desk-eyebrow">DRIFT / RESPONSE EXPLORER</span><h2 id="drift-heading">See how your curve responds.</h2><p>Adjust a curve or open a saved Drift profile. Move the speed slider to see the sensitivity and turn distance at that mouse speed.</p></div><div className="drift-stamp"><b>CURVE PREVIEW</b><span>Calculated in your browser</span><small>Your mouse settings stay unchanged.</small></div></header>
    <div className="drift-layout"><aside className="drift-controls"><div className="drift-control-head"><span>{curve.kind === "lut" ? "LUT / Velocity" : curve.kind === "classic" ? "Classic / Gain � exponent 2" : "Natural / Gain"}</span><button type="button" onClick={() => { setCurve({ ...demoCurve }); setImported(null); setError(""); setStatus("Illustrative draft reset. Uses the converter's current baseline."); }}>Reset demo</button></div>
      <p className="drift-note">{imported ? "Imported baseline" : "Converter baseline"}: {valid ? `${fmt(base!)} cm/360 at ${actualDpi} DPI, before this curve` : "enter valid source values in Convert first"}.</p>
      {imported && <button className="drift-link" type="button" onClick={() => { setImported(null); setStatus("Using the converter baseline with this curve. This is a new, untested combination."); }}>Use converter baseline</button>}
      {controls.map(control => <label key={control.key}><span>{control.label}<output>{curve[control.key as keyof DriftCurve] as number}</output></span><input type="range" aria-label={control.label} min={control.min} max={control.max} step={control.step} value={curve[control.key as keyof DriftCurve] as number} onChange={event => change(control.key as Parameters<typeof change>[0], event.target.value)}/></label>)}
      {curve.kind === "lut" && <p className="drift-note">{curve.points.length} imported velocity knots. Interpolation and the last-segment tail follow Drift. Shape editing remains in the native app.</p>}
      <p className="drift-note">Sliders cover common preview values. Imported values are kept until you edit them.</p>
    </aside><div className="drift-instrument"><CurvePlot curve={curve} probe={probe}/><label className="drift-probe"><span>Speed probe <output>{probe.toFixed(1)} counts/ms</output></span><input type="range" aria-label="Speed probe" min="0" max="80" step=".1" value={probe} onChange={event => setProbe(Number(event.target.value))}/><small>{valid ? `${fmt(probe * 2540 / actualDpi)} cm/s at this DPI` : "Physical speed needs valid DPI"} � simulated input, not a live sensor reading</small></label><dl className="drift-readouts" aria-live="polite"><div><dt>Slow horizontal</dt><dd>{valid ? fmt(base! / slow) : "-"}<small>cm/360</small></dd></div><div><dt>At probe speed</dt><dd>{valid ? fmt(base! / gain) : "-"}<small>cm/360 equivalent</small></dd></div><div><dt>Vertical at probe</dt><dd>{valid ? fmt(base! / gain / curve.yRatio) : "-"}<small>cm/360 equivalent</small></dd></div></dl><p className="drift-note">{fmt(gain)}x at the probe. Equivalent distance assumes constant hand speed; a real turn changes speed. Natural's limit is approached gradually; Classic is uncapped. This is Whole-mode response with no DPI normalization or other driver transforms.</p></div></div>
    <div className="drift-bridge"><div><span className="desk-eyebrow">BRING YOUR CURVE</span><h3>Open a saved curve</h3><p>Open a Drift SavedProfile or an Atlas preview JSON. Atlas reads the curve, DPI and baseline distance in this tab; personal details and trial history are left out.</p><label className="drift-file">Open profile JSON<input type="file" accept=".json,application/json" onChange={file}/></label></div><div><details><summary>Paste profile JSON instead</summary><label className="drift-paste">Profile JSON<textarea value={pasted} onChange={event => setPasted(event.target.value)} maxLength={12 * 1024 * 1024} placeholder="Drift SavedProfile: Schema, Setup and Response"/></label><button type="button" onClick={() => load(pasted)}>Preview pasted profile</button></details><p className="drift-note">Save an Atlas preview to reopen here later. For Drift, use a native SavedProfile; for the driver, export settings from Drift.</p><button className="drift-export" type="button" onClick={download} disabled={!valid}>Download preview JSON</button></div></div>
    <p className="drift-status" role="status">{status}</p>{error && <p className="drift-error" role="alert">{error}</p>}
    <footer className="drift-boundary"><b>Try the curve in Drift</b><p>Use Drift's aiming trials to compare a candidate with your reference, then check tracking, comfort and in-game feel. This graph calculates the response; aiming results come from those trials.</p><a href="https://github.com/RawAccelOfficial/rawaccel/blob/v1.6.1/doc/Guide.md" target="_blank" rel="noreferrer">Raw Accel 1.6.1 guide</a></footer>
  </section>;
}
