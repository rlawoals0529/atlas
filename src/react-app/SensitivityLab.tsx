import { useMemo, useState } from "react";
import { cm360, convertSensitivity, effectiveDpi, gameById, inches360, sensitivityDataset, sensitivityGames } from "../shared/sensitivity";

const number = (value: string, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const fmt = (value: number | null, digits = 3) => value == null ? "—" : Number(value.toFixed(digits)).toString();

export default function SensitivityLab() {
  const [sourceGameId, setSourceGameId] = useState("cs2");
  const [targetGameId, setTargetGameId] = useState("valorant");
  const [sourceDpi, setSourceDpi] = useState(800);
  const [targetDpi, setTargetDpi] = useState(800);
  const [sourceSens, setSourceSens] = useState(1.2);

  const sourceGame = gameById(sourceGameId) ?? sensitivityGames[0];
  const targetGame = gameById(targetGameId) ?? sensitivityGames[1] ?? sensitivityGames[0];
  const converted = useMemo(() => convertSensitivity({
    sourceSensitivity: sourceSens,
    sourceDpi,
    sourceYaw: sourceGame.yaw,
    targetDpi,
    targetYaw: targetGame.yaw,
  }), [sourceDpi, sourceGame.yaw, sourceSens, targetDpi, targetGame.yaw]);
  const sourceCm = cm360(sourceDpi, sourceSens, sourceGame.yaw);
  const targetCm = converted == null ? null : cm360(targetDpi, converted, targetGame.yaw);

  const swap = () => {
    if (converted == null) return;
    setSourceGameId(targetGame.id);
    setTargetGameId(sourceGame.id);
    setSourceDpi(targetDpi);
    setTargetDpi(sourceDpi);
    setSourceSens(Number(converted.toFixed(targetGame.decimals)));
  };

  return <div className="utility-shell sensitivity-shell">
    <header className="utility-topbar">
      <a href="#" className="utility-brand"><b>ATLAS</b><span>SENSITIVITY LAB</span></a>
      <nav><a href="#">Setup</a><a href="#keyboard-lab">Keyboards</a><a href="#product-lab">Product Lab</a></nav>
      <span className="utility-status">BASE HIPFIRE · CM/360</span>
    </header>

    <main className="utility-main">
      <section className="utility-hero">
        <div><span className="utility-kicker">AIM CALIBRATION</span><h1>Keep the same physical turn distance across games.</h1><p>Atlas matches base sensitivity through yaw, DPI and cm/360 instead of using opaque conversion multipliers. Scoped, ADS and FOV-dependent systems are deliberately excluded from this first pass.</p></div>
        <div className="utility-hero-metric"><b>{fmt(sourceCm, 2)}</b><span>CM / 360</span><small>{fmt(inches360(sourceDpi, sourceSens, sourceGame.yaw), 2)} in / 360</small></div>
      </section>

      <section className="sens-workbench">
        <article className="sens-panel">
          <div className="utility-section-head"><span>01 / SOURCE</span><h2>Your current sensitivity</h2></div>
          <label>Game<select value={sourceGameId} onChange={event => setSourceGameId(event.target.value)}>{sensitivityGames.map(game => <option key={game.id} value={game.id}>{game.label}</option>)}</select></label>
          <div className="sens-two"><label>DPI<input inputMode="numeric" value={sourceDpi} onChange={event => setSourceDpi(number(event.target.value, 800))}/></label><label>In-game sensitivity<input inputMode="decimal" value={sourceSens} onChange={event => setSourceSens(number(event.target.value, 1))}/></label></div>
          <div className="sens-presets">{[400,800,1600,3200].map(dpi => <button key={dpi} className={sourceDpi === dpi ? "active" : ""} onClick={() => setSourceDpi(dpi)}>{dpi}</button>)}</div>
          <dl className="sens-metrics"><div><dt>eDPI</dt><dd>{fmt(effectiveDpi(sourceDpi, sourceSens), 1)}</dd></div><div><dt>Yaw</dt><dd>{sourceGame.yaw}</dd></div><div><dt>Confidence</dt><dd className={`confidence ${sourceGame.confidence}`}>{sourceGame.confidence}</dd></div></dl>
        </article>

        <button className="sens-swap" onClick={swap} aria-label="Swap source and target">⇄</button>

        <article className="sens-panel target">
          <div className="utility-section-head"><span>02 / TARGET</span><h2>Equivalent base sensitivity</h2></div>
          <label>Game<select value={targetGameId} onChange={event => setTargetGameId(event.target.value)}>{sensitivityGames.map(game => <option key={game.id} value={game.id}>{game.label}</option>)}</select></label>
          <label>Target DPI<input inputMode="numeric" value={targetDpi} onChange={event => setTargetDpi(number(event.target.value, 800))}/></label>
          <div className="sens-presets">{[400,800,1600,3200].map(dpi => <button key={dpi} className={targetDpi === dpi ? "active" : ""} onClick={() => setTargetDpi(dpi)}>{dpi}</button>)}</div>
          <div className="sens-result"><span>SET IN GAME</span><b>{fmt(converted, targetGame.decimals)}</b><small>{targetGame.label} · {targetDpi} DPI</small></div>
          <dl className="sens-metrics"><div><dt>cm/360</dt><dd>{fmt(targetCm, 2)}</dd></div><div><dt>eDPI</dt><dd>{converted == null ? "—" : fmt(effectiveDpi(targetDpi, converted), 1)}</dd></div><div><dt>Match delta</dt><dd>{sourceCm != null && targetCm != null ? `${Math.abs(sourceCm-targetCm).toFixed(4)} cm` : "—"}</dd></div></dl>
        </article>
      </section>

      <section className="utility-grid sens-explain">
        <article><span>FORMULA</span><h3>Physical-distance match</h3><code>target = source × sourceDPI × sourceYaw ÷ targetDPI ÷ targetYaw</code><p>cm/360 = 360 × 2.54 ÷ (DPI × sensitivity × yaw).</p></article>
        <article><span>BOUNDARY</span><h3>What this does not claim</h3><p>Matching cm/360 does not make different FOVs, recoil systems, zoom optics or aim-assist behavior perceptually identical. This tool matches base horizontal turn distance only.</p></article>
      </section>

      <section className="utility-card sens-sources">
        <div className="utility-section-head"><span>PROVENANCE</span><h2>Where the yaw constants come from</h2></div>
        <p className="utility-note">{sensitivityDataset.scope} Checked {sensitivityDataset.checkedAt}.</p>
        <div className="sens-source-grid">{sensitivityGames.map(game => <article key={game.id}><div><b>{game.label}</b><span className={`confidence ${game.confidence}`}>{game.confidence}</span></div><strong>{game.yaw}° / count / sens</strong><p>{game.note}</p>{game.sources.map(source => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label} ↗</a>)}</article>)}</div>
      </section>
    </main>
  </div>;
}
