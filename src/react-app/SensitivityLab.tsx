import { useMemo, useState } from "react";
import { cm360, convertSensitivity, effectiveDpi, gameById, inches360, sensitivityDataset, sensitivityForCm360, sensitivityGames } from "../shared/sensitivity";

const positiveNumber = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
};

const fmt = (value: number | null, digits = 3) => value == null ? "—" : Number(value.toFixed(digits)).toString();
const gameOptions = [...sensitivityGames, { id: "custom", label: "Custom yaw" }];

export default function SensitivityLab() {
  const [sourceGameId, setSourceGameId] = useState("cs2");
  const [targetGameId, setTargetGameId] = useState("valorant");
  const [sourceDpiInput, setSourceDpiInput] = useState("800");
  const [targetDpiInput, setTargetDpiInput] = useState("800");
  const [sourceSensInput, setSourceSensInput] = useState("1.2");
  const [sourceCustomYawInput, setSourceCustomYawInput] = useState("0.022");
  const [targetCustomYawInput, setTargetCustomYawInput] = useState("0.022");
  const [matcherCmInput, setMatcherCmInput] = useState("35");
  const [matcherDpiInput, setMatcherDpiInput] = useState("800");
  const [matcherGameId, setMatcherGameId] = useState("valorant");
  const [matcherCustomYawInput, setMatcherCustomYawInput] = useState("0.07");

  const sourceDpi = positiveNumber(sourceDpiInput);
  const targetDpi = positiveNumber(targetDpiInput);
  const sourceSens = positiveNumber(sourceSensInput);
  const sourceCustomYaw = positiveNumber(sourceCustomYawInput);
  const targetCustomYaw = positiveNumber(targetCustomYawInput);
  const matcherCm = positiveNumber(matcherCmInput);
  const matcherDpi = positiveNumber(matcherDpiInput);
  const matcherCustomYaw = positiveNumber(matcherCustomYawInput);

  const sourceGame = gameById(sourceGameId);
  const targetGame = gameById(targetGameId);
  const matcherGame = gameById(matcherGameId);
  const sourceYaw = sourceGame?.yaw ?? sourceCustomYaw;
  const targetYaw = targetGame?.yaw ?? targetCustomYaw;
  const matcherYaw = matcherGame?.yaw ?? matcherCustomYaw;
  const sourceDecimals = sourceGame?.decimals ?? 6;
  const targetDecimals = targetGame?.decimals ?? 6;

  const converted = useMemo(() => convertSensitivity({
    sourceSensitivity: sourceSens,
    sourceDpi,
    sourceYaw,
    targetDpi,
    targetYaw,
  }), [sourceDpi, sourceSens, sourceYaw, targetDpi, targetYaw]);
  const sourceCm = cm360(sourceDpi, sourceSens, sourceYaw);
  const targetCm = converted == null ? null : cm360(targetDpi, converted, targetYaw);
  const matcherSensitivity = sensitivityForCm360(matcherDpi, matcherCm, matcherYaw);

  const swap = () => {
    if (converted == null) return;
    const nextSourceId = targetGameId;
    const nextTargetId = sourceGameId;
    const nextSourceDpi = targetDpiInput;
    const nextTargetDpi = sourceDpiInput;
    const nextSourceCustomYaw = targetCustomYawInput;
    const nextTargetCustomYaw = sourceCustomYawInput;
    setSourceGameId(nextSourceId);
    setTargetGameId(nextTargetId);
    setSourceDpiInput(nextSourceDpi);
    setTargetDpiInput(nextTargetDpi);
    setSourceCustomYawInput(nextSourceCustomYaw);
    setTargetCustomYawInput(nextTargetCustomYaw);
    setSourceSensInput(fmt(converted, targetDecimals));
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
        <div className="utility-hero-metric"><b>{fmt(sourceCm, 2)}</b><span>CM / 360</span><small>{fmt(inches360(sourceDpi, sourceSens, sourceYaw), 2)} in / 360</small></div>
      </section>

      <section className="sens-workbench">
        <article className="sens-panel">
          <div className="utility-section-head"><span>01 / SOURCE</span><h2>Your current sensitivity</h2></div>
          <label>Game<select value={sourceGameId} onChange={event => setSourceGameId(event.target.value)}>{gameOptions.map(game => <option key={game.id} value={game.id}>{game.label}</option>)}</select></label>
          {sourceGameId === "custom" && <label>Yaw · degrees/count at sens 1<input inputMode="decimal" value={sourceCustomYawInput} onChange={event => setSourceCustomYawInput(event.target.value)}/></label>}
          <div className="sens-two"><label>DPI<input inputMode="numeric" value={sourceDpiInput} onChange={event => setSourceDpiInput(event.target.value)}/></label><label>In-game sensitivity<input inputMode="decimal" value={sourceSensInput} onChange={event => setSourceSensInput(event.target.value)}/></label></div>
          <div className="sens-presets">{[400,800,1600,3200].map(dpi => <button key={dpi} className={sourceDpi === dpi ? "active" : ""} onClick={() => setSourceDpiInput(String(dpi))}>{dpi}</button>)}</div>
          <dl className="sens-metrics"><div><dt>eDPI</dt><dd>{sourceDpi > 0 && sourceSens > 0 ? fmt(effectiveDpi(sourceDpi, sourceSens), 1) : "—"}</dd></div><div><dt>Yaw</dt><dd>{sourceYaw || "—"}</dd></div><div><dt>Source</dt><dd>{sourceGame ? sourceGame.confidence : "manual"}</dd></div></dl>
        </article>

        <button className="sens-swap" onClick={swap} aria-label="Swap source and target">⇄</button>

        <article className="sens-panel target">
          <div className="utility-section-head"><span>02 / TARGET</span><h2>Equivalent base sensitivity</h2></div>
          <label>Game<select value={targetGameId} onChange={event => setTargetGameId(event.target.value)}>{gameOptions.map(game => <option key={game.id} value={game.id}>{game.label}</option>)}</select></label>
          {targetGameId === "custom" && <label>Yaw · degrees/count at sens 1<input inputMode="decimal" value={targetCustomYawInput} onChange={event => setTargetCustomYawInput(event.target.value)}/></label>}
          <label>Target DPI<input inputMode="numeric" value={targetDpiInput} onChange={event => setTargetDpiInput(event.target.value)}/></label>
          <div className="sens-presets">{[400,800,1600,3200].map(dpi => <button key={dpi} className={targetDpi === dpi ? "active" : ""} onClick={() => setTargetDpiInput(String(dpi))}>{dpi}</button>)}</div>
          <div className="sens-result"><span>SET IN GAME</span><b>{fmt(converted, targetDecimals)}</b><small>{targetGame?.label ?? "Custom yaw"} · {targetDpi || "—"} DPI</small></div>
          <dl className="sens-metrics"><div><dt>cm/360</dt><dd>{fmt(targetCm, 2)}</dd></div><div><dt>eDPI</dt><dd>{converted == null || targetDpi <= 0 ? "—" : fmt(effectiveDpi(targetDpi, converted), 1)}</dd></div><div><dt>Match delta</dt><dd>{sourceCm != null && targetCm != null ? `${Math.abs(sourceCm-targetCm).toFixed(4)} cm` : "—"}</dd></div></dl>
        </article>
      </section>

      <section className="utility-card sens-matcher">
        <div className="utility-section-head"><span>CM/360 MATCHER</span><h2>Start with a physical distance instead</h2></div>
        <p className="utility-note">Useful when you already know the turn distance you want. Atlas solves the in-game sensitivity from your target cm/360, DPI and game yaw.</p>
        <div className="sens-two">
          <label>Target cm/360<input inputMode="decimal" value={matcherCmInput} onChange={event => setMatcherCmInput(event.target.value)}/></label>
          <label>DPI<input inputMode="numeric" value={matcherDpiInput} onChange={event => setMatcherDpiInput(event.target.value)}/></label>
        </div>
        <label>Game<select value={matcherGameId} onChange={event => setMatcherGameId(event.target.value)}>{gameOptions.map(game => <option key={game.id} value={game.id}>{game.label}</option>)}</select></label>
        {matcherGameId === "custom" && <label>Yaw · degrees/count at sens 1<input inputMode="decimal" value={matcherCustomYawInput} onChange={event => setMatcherCustomYawInput(event.target.value)}/></label>}
        <div className="sens-result"><span>SET IN GAME</span><b>{fmt(matcherSensitivity, matcherGame?.decimals ?? 6)}</b><small>{matcherGame?.label ?? "Custom yaw"} · {matcherDpi || "—"} DPI · {matcherCm || "—"} cm/360</small></div>
      </section>

      <section className="utility-grid sens-explain">
        <article><span>FORMULA</span><h3>Physical-distance match</h3><code>target = source × sourceDPI × sourceYaw ÷ targetDPI ÷ targetYaw</code><p>cm/360 = 360 × 2.54 ÷ (DPI × sensitivity × yaw).</p></article>
        <article><span>BOUNDARY</span><h3>What this does not claim</h3><p>Matching cm/360 does not make different FOVs, recoil systems, zoom optics or aim-assist behavior perceptually identical. This tool matches base horizontal turn distance only.</p></article>
      </section>

      <section className="utility-card sens-sources">
        <div className="utility-section-head"><span>PROVENANCE</span><h2>Where the yaw constants come from</h2></div>
        <p className="utility-note">{sensitivityDataset.scope} Checked {sensitivityDataset.checkedAt}. Games without a sourced Atlas preset can still be used through Custom yaw; that value remains user-supplied and is never promoted into the dataset automatically.</p>
        <div className="sens-source-grid">{sensitivityGames.map(game => <article key={game.id}><div><b>{game.label}</b><span className={`confidence ${game.confidence}`}>{game.confidence}</span></div><strong>{game.yaw}° / count / sens</strong><p>{game.note}</p>{game.sources.map(source => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label} ↗</a>)}</article>)}</div>
      </section>
    </main>
  </div>;
}
