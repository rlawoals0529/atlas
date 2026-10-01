import { useId, useMemo, useState } from "react";
import { keyboards, switches } from "../shared/catalog";
import { evidenceHealth, evidenceRows, sourceKindMeta } from "../shared/productMeta";
import type { KeyboardProduct, KeyboardSwitchProduct } from "../shared/types";
import { ProductMedia } from "./ProductMedia";
import { useModalDialog } from "./useModalDialog";

type KeyboardLabProduct = KeyboardProduct | KeyboardSwitchProduct;

const money = (value?: number) => value == null ? "—" : `$${value.toFixed(value % 1 ? 2 : 0)}`;
const polling = (value: number) => value >= 1000 ? `${value / 1000}K Hz` : `${value} Hz`;
const force = (point?: { value: number; unit: "gf" | "cN" }) => point ? `${point.value} ${point.unit}` : "—";
const human = (value: string) => value.replaceAll("-", " ").replace(/\b\w/g, char => char.toUpperCase());

function ProductGlyph({ product }: { product: KeyboardLabProduct }) {
  if (product.type === "switch") return <div className={`kb-switch-glyph ${product.specs.technology}`}><i/><span>{product.specs.feel}</span></div>;
  return <div className={`kb-board-glyph f-${product.specs.formFactor.replace(/[^a-z0-9]/gi, "")}`}><div className="kb-key-row">{Array.from({length: 14}, (_, i) => <i key={i}/>)}</div><div className="kb-key-row short">{Array.from({length: 13}, (_, i) => <i key={i}/>)}</div><div className="kb-key-row">{Array.from({length: 12}, (_, i) => <i key={i}/>)}</div><span>{product.specs.formFactor}</span></div>;
}

function ProductVisual({ product }: { product: KeyboardLabProduct }) {
  return <ProductMedia productId={product.id} className={`kb-product-media ${product.type}`} fallback={<ProductGlyph product={product}/>}/>;
}

function Chips({ product }: { product: KeyboardLabProduct }) {
  if (product.type === "switch") {
    const silent = [product.model, product.summary, ...(product.tags ?? [])].join(" ").toLowerCase().includes("silent");
    return <><span>{human(product.specs.technology)}</span><span>{human(product.specs.feel)}</span>{silent && <span>silent</span>}<span>{force(product.specs.actuationForce)} actuation</span><span>{product.specs.totalTravelMm} mm travel</span>{product.specs.compatibility?.length ? <span>board compatibility varies</span> : null}</>;
  }
  return <><span>{product.specs.formFactor}</span><span>{human(product.specs.switchTechnology)}</span><span>{polling(product.specs.maxPollingHz)}</span>{product.specs.minActuationMm != null && <span>{product.specs.minActuationMm} mm min</span>}{product.specs.rapidTrigger && <span>rapid trigger</span>}</>;
}

function Specs({ product }: { product: KeyboardLabProduct }) {
  if (product.type === "switch") return <dl className="kb-spec-list">
    <div><dt>Technology</dt><dd>{human(product.specs.technology)}</dd></div>
    <div><dt>Feel</dt><dd>{human(product.specs.feel)}</dd></div>
    <div><dt>Initial force</dt><dd>{force(product.specs.initialForce)}</dd></div>
    <div><dt>Actuation force</dt><dd>{force(product.specs.actuationForce)}</dd></div>
    <div><dt>Bottom-out force</dt><dd>{force(product.specs.bottomOutForce)}</dd></div>
    <div><dt>Pre-travel</dt><dd>{product.specs.preTravelMm == null ? "—" : `${product.specs.preTravelMm} mm`}</dd></div>
    <div><dt>Total travel</dt><dd>{product.specs.totalTravelMm} mm</dd></div>
    <div><dt>Factory lube</dt><dd>{product.specs.factoryLubed == null ? "unknown" : product.specs.factoryLubed ? "yes" : "no"}</dd></div>
    <div><dt>Rated lifetime</dt><dd>{product.specs.ratedKeystrokesM == null ? "—" : `${product.specs.ratedKeystrokesM}M`}</dd></div>
    {product.specs.magneticFluxGs && <div><dt>Magnetic flux</dt><dd>{product.specs.magneticFluxGs.initial} → {product.specs.magneticFluxGs.bottomOut} G</dd></div>}
  </dl>;

  return <dl className="kb-spec-list">
    <div><dt>Form factor</dt><dd>{product.specs.formFactor}</dd></div>
    <div><dt>Layout</dt><dd>{product.specs.layout}</dd></div>
    <div><dt>Switch tech</dt><dd>{human(product.specs.switchTechnology)}</dd></div>
    <div><dt>Stock switch</dt><dd>{product.specs.stockSwitch}</dd></div>
    <div><dt>Polling ceiling</dt><dd>{polling(product.specs.maxPollingHz)}</dd></div>
    <div><dt>Actuation range</dt><dd>{product.specs.minActuationMm != null && product.specs.maxActuationMm != null ? `${product.specs.minActuationMm}–${product.specs.maxActuationMm} mm` : "—"}</dd></div>
    <div><dt>Rapid Trigger</dt><dd>{product.specs.rapidTrigger ? "yes" : "no"}</dd></div>
    <div><dt>SOCD / Snap Tap</dt><dd>{product.specs.socd == null ? "unknown" : product.specs.socd ? "supported" : "not listed"}</dd></div>
    <div><dt>Hot-swap</dt><dd>{product.specs.hotSwappable ? "yes" : "no"}</dd></div>
    <div><dt>Case</dt><dd>{product.specs.caseMaterial}</dd></div>
    <div><dt>Plate</dt><dd>{product.specs.plateMaterial ?? "—"}</dd></div>
    <div><dt>Configurator</dt><dd>{product.specs.webConfigurator ? "web" : product.specs.software ?? "—"}</dd></div>
  </dl>;
}

function Inspector({ product, onClose }: { product: KeyboardLabProduct; onClose: () => void }) {
  const health = evidenceHealth(product);
  const rows = evidenceRows(product);
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useModalDialog<HTMLElement>(onClose);
  return <div className="kb-inspector-shell">
    <button type="button" className="kb-backdrop" tabIndex={-1} aria-hidden="true" onClick={onClose}/>
    <aside ref={dialogRef} className="kb-inspector" role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={descriptionId} tabIndex={-1}>
      <header><div><span>{product.type.toUpperCase()} / {product.brand}</span><h2 id={titleId}>{product.model}</h2></div><button type="button" data-dialog-initial-focus onClick={onClose} aria-label={`Close ${product.brand} ${product.model} details`}>×</button></header>
      <div className="kb-detail-art"><ProductVisual product={product}/><div><b>{health.score}</b><span>DATA HEALTH</span><small>{health.label}</small></div></div>
      <p className="kb-summary" id={descriptionId}>{product.summary}</p>
      <div className="kb-chip-row"><Chips product={product}/><span>{money(product.msrpUsd)} MSRP</span><span>{product.status}</span></div>
      <section><div className="utility-section-head"><span>SPECIFICATION</span><h3>Source-backed hardware facts</h3></div><Specs product={product}/></section>
      {product.type === "switch" && product.specs.compatibility?.length ? <section><div className="utility-section-head"><span>COMPATIBILITY</span><h3>Board caveats</h3></div>{product.specs.compatibility.map(item => <p className="kb-callout" key={item}>{item}</p>)}</section> : null}
      <section><div className="utility-section-head"><span>EVIDENCE</span><h3>Field provenance</h3></div>{rows.map(row => <article className="kb-evidence" key={row.field}><div><b>{human(row.field)}</b><span className={`confidence ${row.confidence}`}>{row.confidence}</span></div>{row.note && <p>{row.note}</p>}{row.sources.map(source => <a key={source.id} href={source.url} target="_blank" rel="noreferrer"><i>{sourceKindMeta[source.kind].short}</i><span>{source.label}</span><small>{source.checkedAt} ↗</small></a>)}</article>)}</section>
    </aside>
  </div>;
}

export default function KeyboardLab() {
  const [kind, setKind] = useState<"all" | "keyboard" | "switch">("all");
  const [query, setQuery] = useState("");
  const [technology, setTechnology] = useState("all");
  const [selected, setSelected] = useState<KeyboardLabProduct | null>(null);
  const products = useMemo(() => [...keyboards, ...switches] as KeyboardLabProduct[], []);
  const filtered = useMemo(() => products.filter(product => {
    if (kind !== "all" && product.type !== kind) return false;
    const tech = product.type === "keyboard" ? product.specs.switchTechnology : product.specs.technology;
    if (technology !== "all" && tech !== technology) return false;
    const haystack = [product.brand, product.model, product.summary, product.type, ...(product.tags ?? []), tech].join(" ").toLowerCase();
    return !query.trim() || haystack.includes(query.trim().toLowerCase());
  }), [kind, products, query, technology]);
  const technologies = [...new Set(products.map(product => product.type === "keyboard" ? product.specs.switchTechnology : product.specs.technology))];

  return <div className="utility-shell keyboard-shell">
    <header className="utility-topbar">
      <a href="#" className="utility-brand"><b>ATLAS</b><span>KEYBOARD LAB</span></a>
      <nav><a href="#">Setup</a><a href="#sensitivity">Sensitivity</a><a href="#product-lab">Product Lab</a></nav>
      <span className="utility-status">{keyboards.length} BOARDS · {switches.length} SWITCHES</span>
    </header>

    <main className="utility-main">
      <section className="utility-hero keyboard-hero">
        <div><span className="utility-kicker">INPUT HARDWARE</span><h1>Gaming keyboards without the spec-sheet shortcuts.</h1><p>Compare switch technology, actuation range, polling, configurability and build choices while keeping manufacturer claims, independent review observations and subjective switch impressions visibly separate.</p></div>
        <div className="kb-hero-stack"><span>MECHANICAL</span><b>HE / OPTICAL / MX</b><small>compatibility is implementation-specific</small></div>
      </section>

      <section className="kb-research-boundary">
        <b>Switch review policy</b><p>ThereminGoat scorecards and long-form reviews are useful expert evidence, but Atlas does not copy composite scores into a universal ranking. Switch smoothness, weighting, sound and tactile preference stay source-attributed and preference-dependent.</p><a href="https://github.com/ThereminGoat/switch-scores" target="_blank" rel="noreferrer">ThereminGoat switch-scores source ↗</a>
      </section>

      <section className="kb-toolbar">
        <div className="kb-segments">{(["all","keyboard","switch"] as const).map(value => <button key={value} className={kind === value ? "active" : ""} onClick={() => setKind(value)}>{value === "all" ? "All hardware" : value === "keyboard" ? "Keyboards" : "Switches"}</button>)}</div>
        <input placeholder="Search brand, model, technology…" value={query} onChange={event => setQuery(event.target.value)}/>
        <select value={technology} onChange={event => setTechnology(event.target.value)}><option value="all">All technologies</option>{technologies.map(value => <option key={value} value={value}>{human(value)}</option>)}</select>
        <span>{filtered.length} records</span>
      </section>

      <section className="kb-grid">{filtered.map(product => {
        const health = evidenceHealth(product);
        return <button className="kb-card" key={product.id} onClick={() => setSelected(product)} aria-label={`Open ${product.brand} ${product.model} record`}>
          <div className="kb-card-art"><ProductVisual product={product}/></div>
          <div className="kb-card-copy">
            <span>{product.brand} · {product.type}</span>
            <h2>{product.model}</h2>
            <div className="kb-chip-row"><Chips product={product}/></div>
            <p>{product.summary}</p>
            <footer><span>{health.sourceCount} source{health.sourceCount === 1 ? "" : "s"}</span><i>View details →</i></footer>
          </div>
        </button>;
      })}</section>

      <section className="utility-grid kb-principles">
        <article><span>01</span><h3>Actuation is not latency</h3><p>A 0.1 mm minimum actuation setting is a configurable travel threshold, not a measured end-to-end input latency value.</p></article>
        <article><span>02</span><h3>HE compatibility is not universal</h3><p>Magnetic switch polarity, flux curve, PCB thickness, sensor calibration and firmware support can all make a physically MX-shaped switch incompatible.</p></article>
        <article><span>03</span><h3>Preference stays preference</h3><p>Sound, smoothness, tactile shape and spring weight can be expertly reviewed without becoming a universal “best switch” score.</p></article>
      </section>
    </main>
    {selected && <Inspector product={selected} onClose={() => setSelected(null)}/>} 
  </div>;
}
