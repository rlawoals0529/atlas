import { useMemo, useState } from "react";
import { catalog, mice, mousepads, skates } from "../shared/catalog";
import { evidenceHealth, evidenceRows, familyFor, productSearchText, sourceKindMeta } from "../shared/productMeta";
import { recommendMice, recommendPads, recommendSkates } from "../shared/recommend";
import { shapeSimilarity, type SimilarityMode } from "../shared/shape";
import ShapeLabV2, { ShapeCanvas, type ShapeLayer } from "./ShapeLabV2";
import { ProductMedia } from "./ProductMedia";
import type { GameStyle, Grip, MouseProduct, MousepadProduct, Product, SkateProduct, UserProfile } from "../shared/types";
import "./v05.css";

const VERSION = "0.8";

const defaultProfile: UserProfile = {
  handLengthCm: 19,
  handWidthCm: 10,
  grip: "relaxed-claw",
  fingerLayout: "1-2-2",
  aimStyle: "hybrid",
  gameStyle: "tactical-fps",
  cm360: 42,
  dpi: 1600,
  displayHz: 240,
  cpuTier: "mid",
  weightPreference: "light",
  shapePreference: "any",
  clickPreference: "any",
  wheelPreference: "any",
  extraButtons: "minimal",
  padSpeed: 55,
  textureTolerance: 60,
  pressureHabit: "variable",
  climate: "normal",
  handMoisture: "normal",
  sleeve: false,
  budgetUsd: 180,
  relative: { sizeDelta: 0, widthDelta: 0, humpDelta: 0, weightDelta: 0, palmSupportDelta: 0 },
};

const gripLabels: Record<Grip, string> = {
  palm: "Palm",
  "relaxed-claw": "Relaxed claw",
  "aggressive-claw": "Aggressive claw",
  "pincer-claw": "Pincer claw",
  "knuckle-claw": "Knuckle claw",
  fingertip: "Fingertip",
  "extended-fingertip": "Extended fingertip",
  "palm-claw-hybrid": "Palm / claw",
};

const gameLabels: Record<GameStyle, string> = {
  "tactical-fps": "Tactical FPS",
  "tracking-fps": "Tracking FPS",
  "arena-fps": "Arena FPS",
  "battle-royale": "Battle royale",
  "moba-rts": "MOBA / RTS",
  mmo: "MMO",
  action: "Action / general",
  mixed: "Mixed gaming",
};

const similarityLabels: Record<SimilarityMode, string> = {
  balanced: "Balanced",
  claw: "Claw",
  fingertip: "Fingertip",
  palm: "Palm",
};

const formatHump = (value: string) => value.replace("center-rear", "center / rear");
const pollingLabel = (hz: number) => hz >= 1000 ? `${hz / 1000}K Hz` : `${hz} Hz`;
const money = (value?: number) => value == null ? "—" : `$${value.toFixed(value % 1 ? 2 : 0)}`;

function LogoMark() {
  return <span className="v5-logo" aria-hidden="true"><i/><i/><i/></span>;
}

function Meter({ value, label }: { value: number; label?: string }) {
  return <div className="v5-meter" aria-label={label ? `${label}: ${Math.round(value)} out of 100` : undefined}><i style={{ width: `${Math.max(0, Math.min(100, value))}%` }}/></div>;
}

function ProductArt({ product }: { product: Product }) {
  if (product.type === "mouse") {
    const rear = product.geometry?.rearFlare ?? 55;
    const taper = product.geometry?.sideTaper ?? 50;
    return <div className={`v5-mouse-art ${product.specs.shape}`} style={{ "--rear": `${rear}%`, "--taper": `${taper}%` } as React.CSSProperties}><i/><span/></div>;
  }
  if (product.type === "mousepad") return <div className={`v5-pad-art ${product.specs.surfaceClass}`}><span>{product.specs.surfaceClass}</span></div>;
  return <div className="v5-skate-art"><i/><i/><i/><i/></div>;
}

function EvidenceBadge({ kind }: { kind: keyof typeof sourceKindMeta }) {
  const meta = sourceKindMeta[kind];
  return <span className={`v5-source-badge ${kind}`} title={meta.description}>{meta.short}</span>;
}

function ProductCard({ product, score, onOpen, compact = false }: { product: Product; score?: number; onOpen: (product: Product) => void; compact?: boolean }) {
  const health = evidenceHealth(product);
  return <button className={`v5-product-card ${compact ? "compact" : ""}`} onClick={() => onOpen(product)}>
    <div className="v5-product-art"><ProductMedia productId={product.id} fallback={<ProductArt product={product}/>} className={`v5-product-real-image ${product.type}`}/></div>
    <div className="v5-product-copy">
      <div className="v5-card-top"><span className="v5-eyebrow">{product.brand}</span><span className="v5-card-meta">{score != null && <span className="v5-fit-badge" title="Profile fit signal, not an objective product rating"><b>{score}</b><span>PROFILE FIT</span></span>}<span className={`v5-health h${Math.floor(health.score / 20)}`}>{health.label} data</span></span></div>
      <h3>{product.model}</h3>
      {!compact && <p>{product.summary}</p>}
      <div className="v5-chips">
        {product.type === "mouse" && <><span>{product.specs.lengthMm} × {product.specs.widthMm} × {product.specs.heightMm} mm</span><span>{product.specs.weightG} g</span><span>{pollingLabel(product.specs.maxPollingHz)}</span><span>{product.specs.gripWidthMm ?? product.specs.widthMm} mm grip</span><span>{formatHump(product.specs.hump)}</span></>}
        {product.type === "mousepad" && <><span>{product.specs.surfaceClass}</span><span>{product.specs.firmness}</span><span>{product.feel.dynamicSpeed}/100 glide</span><span>{product.feel.stoppingPower}/100 stop</span></>}
        {product.type === "skate" && <><span>{product.specs.material.replaceAll("-", " ")}</span><span>{product.specs.format}</span><span>{product.feel.brokenInSpeed ?? product.feel.speed}/100 glide</span></>}
      </div>
    </div>
  </button>;
}

function ShapeOverlay({ selected, normalize = false }: { selected: MouseProduct[]; normalize?: boolean; view?: "top" | "side"; align?: "center" | "front" | "rear" | "sensor" }) {
  const colors = ["#0f766e", "#315f8c", "#6d5fa3", "#a35f13", "#9f3d62"];
  const layers: ShapeLayer[] = selected.map((mouse, index) => ({
    id: mouse.id,
    color: colors[index % colors.length],
    visible: true,
    opacity: .94,
    lineStyle: index === 1 ? "dash" : index === 2 ? "dot" : "solid",
  }));
  return <ShapeCanvas layers={layers} view="top" align="center" normalize={normalize} showDimensions/>;
}

function SpecRow({ label, value }: { label: string; value: React.ReactNode }) {
  return <div className="v5-spec-row"><span>{label}</span><b>{value}</b></div>;
}

function ProductInspector({ product, onClose, onOpen }: { product: Product; onClose: () => void; onOpen: (product: Product) => void }) {
  const health = evidenceHealth(product);
  const family = familyFor(product.id);
  const siblings = family?.memberIds.map(id => catalog.find(item => item.id === id)).filter((item): item is Product => Boolean(item && item.id !== product.id)) ?? [];
  const evidence = evidenceRows(product);
  return <div className="v5-inspector-shell" role="dialog" aria-modal="true" aria-label={`${product.brand} ${product.model} details`}>
    <button className="v5-inspector-backdrop" aria-label="Close product details" onClick={onClose}/>
    <aside className="v5-inspector">
      <div className="v5-inspector-head"><div><span className="v5-eyebrow">{product.brand} / {product.type}</span><h2>{product.model}</h2></div><button className="v5-icon-button" onClick={onClose} aria-label="Close">×</button></div>
      <div className="v5-detail-hero"><ProductMedia productId={product.id} fallback={<ProductArt product={product}/>} className={`v5-detail-real-image ${product.type}`}/><div className="v5-detail-score"><b>{health.score}</b><span>DATA HEALTH</span><small>{health.label}</small></div></div>
      <div className="v5-detail-summary"><p>{product.summary}</p><div className="v5-chips"><span>{product.status}</span><span>{money(product.msrpUsd)} MSRP</span>{(product.tags ?? []).slice(0, 4).map(tag => <span key={tag}>{tag}</span>)}</div></div>

      {family && <section className="v5-detail-section"><div className="v5-detail-title"><span>LINEAGE</span><h3>{family.label}</h3></div><p className="v5-family-note">{family.relationship}</p>{siblings.length > 0 && <div className="v5-family-list">{siblings.map(item => <button key={item.id} onClick={() => onOpen(item)}><span>{item.brand}</span><b>{item.model}</b><small>open record →</small></button>)}</div>}</section>}

      <section className="v5-detail-section"><div className="v5-detail-title"><span>SPECIFICATION</span><h3>What is known</h3></div><div className="v5-spec-grid">
        {product.type === "mouse" && <MouseSpecs product={product}/>} 
        {product.type === "mousepad" && <PadSpecs product={product}/>} 
        {product.type === "skate" && <SkateSpecs product={product}/>} 
      </div></section>

      {product.type === "mouse" && <section className="v5-detail-section"><div className="v5-detail-title"><span>FIT MODEL</span><h3>Grip and contact profile</h3></div><div className="v5-fit-grid">{Object.entries(product.fit.grip).sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0)).map(([key, value]) => <div key={key}><span>{gripLabels[key as Grip] ?? key}</span><Meter value={value ?? 0}/><b>{value}</b></div>)}</div><div className="v5-mini-stats"><span>Hands {product.fit.handLengthCm[0]}–{product.fit.handLengthCm[1]} cm</span><span>Width {product.fit.handWidthCm[0]}–{product.fit.handWidthCm[1]} cm</span><span>Palm support {product.fit.palmSupport ?? "—"}/100</span><span>Lift security {product.fit.liftSecurity ?? "—"}/100</span></div></section>}

      {product.type === "mousepad" && <section className="v5-detail-section"><div className="v5-detail-title"><span>SURFACE MODEL</span><h3>Glide and control</h3></div><FeelGrid rows={[["Initial speed", product.feel.staticSpeed], ["Dynamic speed", product.feel.dynamicSpeed], ["Stopping", product.feel.stoppingPower], ["Texture", product.feel.texture], ["Pressure response", product.feel.pressureResponse], ["Humidity resistance", product.feel.humidityResistance], ["X/Y consistency", product.feel.xyConsistency], ["Sleeve compatibility", product.feel.sleeveCompatibility]]}/></section>}

      {product.type === "skate" && <section className="v5-detail-section"><div className="v5-detail-title"><span>GLIDE MODEL</span><h3>Fresh, broken-in and wear</h3></div><FeelGrid rows={[["Fresh speed", product.feel.freshSpeed ?? product.feel.speed], ["Broken-in speed", product.feel.brokenInSpeed ?? product.feel.speed], ["Control", product.feel.control], ["Durability", product.feel.durability], ["Wear resistance", 100 - (product.feel.wearRate ?? 50)], ["Dust tolerance", 100 - (product.feel.dustSensitivity ?? 50)]]}/></section>}

      <section className="v5-detail-section evidence"><div className="v5-detail-title"><span>EVIDENCE</span><h3>Why you can trust each field</h3></div><div className="v5-evidence-summary"><b>{health.sourceCount}</b><span>sources</span><b>{health.evidenceCount}</b><span>evidence groups</span></div>{evidence.map(row => <div className="v5-evidence-row" key={row.field}><div><b>{row.field}</b><span className={`v5-confidence ${row.confidence}`}>{row.confidence}</span></div>{row.note && <p>{row.note}</p>}<div className="v5-source-list">{row.sources.map(source => <a key={source.id} href={source.url} target="_blank" rel="noreferrer"><EvidenceBadge kind={source.kind}/><span>{source.label}</span><small>{source.checkedAt}</small></a>)}</div></div>)}</section>

      <section className="v5-detail-section"><div className="v5-detail-title"><span>ALL SOURCES</span><h3>Provenance ledger</h3></div><div className="v5-source-ledger">{product.sources.map(source => <a key={source.id} href={source.url} target="_blank" rel="noreferrer"><EvidenceBadge kind={source.kind}/><div><b>{source.label}</b><small>{sourceKindMeta[source.kind].label} · checked {source.checkedAt}</small></div><span>↗</span></a>)}</div></section>
    </aside>
  </div>;
}

function MouseSpecs({ product }: { product: MouseProduct }) {
  return <><SpecRow label="Dimensions" value={`${product.specs.lengthMm} × ${product.specs.widthMm} × ${product.specs.heightMm} mm`}/><SpecRow label="Grip width" value={`${product.specs.gripWidthMm ?? "—"} mm`}/><SpecRow label="Weight" value={`${product.specs.weightG} g`}/><SpecRow label="Shape" value={`${product.specs.shape} · ${formatHump(product.specs.hump)} hump`}/><SpecRow label="Sensor" value={product.specs.sensor}/><SpecRow label="Polling ceiling" value={pollingLabel(product.specs.maxPollingHz)}/><SpecRow label="Main switches" value={product.specs.mainSwitch ?? product.specs.switchType}/><SpecRow label="Encoder" value={product.specs.encoder ?? "—"}/><SpecRow label="MCU" value={product.specs.mcu ?? "—"}/><SpecRow label="Connectivity" value={product.specs.connectivity.join(" · ")}/><SpecRow label="Buttons" value={product.specs.programmableButtons ?? "—"}/><SpecRow label="Battery" value={product.specs.battery8kHours ? `${product.specs.battery1kHours ?? "—"}h @1K · ${product.specs.battery8kHours}h @8K` : product.specs.battery4kHours ? `${product.specs.battery1kHours ?? "—"}h @1K · ${product.specs.battery4kHours}h @4K` : product.specs.battery1kHours ? `${product.specs.battery1kHours}h @1K` : "—"}/><SpecRow label="Software" value={product.specs.webDriver ? "Web configuration" : product.specs.driverless ? "Driverless / on-device" : "Desktop software / varies"}/><SpecRow label="Stock skates" value={product.specs.stockSkateMaterial ?? "—"}/></>;
}

function PadSpecs({ product }: { product: MousepadProduct }) {
  return <><SpecRow label="Surface" value={`${product.specs.surfaceClass} · ${product.specs.surfaceMaterial}`}/><SpecRow label="Base" value={product.specs.baseMaterial}/><SpecRow label="Firmness" value={product.specs.firmness}/><SpecRow label="Size" value={`${product.specs.widthMm} × ${product.specs.heightMm} mm`}/><SpecRow label="Thickness" value={`${product.specs.thicknessMm} mm`}/><SpecRow label="Edges" value={product.specs.stitchedEdges ? "Stitched" : "Unstitched / hard edge"}/><SpecRow label="Break-in change" value={`${product.feel.breakInChange ?? "—"}/100`}/><SpecRow label="Worn-zone stability" value={`${product.feel.wornZoneStability ?? "—"}/100`}/><SpecRow label="Cleaning recovery" value={`${product.feel.cleaningRecovery ?? "—"}/100`}/></>;
}

function SkateSpecs({ product }: { product: SkateProduct }) {
  return <><SpecRow label="Material" value={product.specs.material.replaceAll("-", " ")}/><SpecRow label="Format" value={product.specs.format}/><SpecRow label="Thickness" value={product.specs.thicknessMm ? `${product.specs.thicknessMm} mm` : "—"}/><SpecRow label="Diameter" value={product.specs.diameterMm ? `${product.specs.diameterMm} mm` : "—"}/><SpecRow label="Cushion layer" value={product.specs.cushionLayer ? "Yes" : "No"}/><SpecRow label="Anti-collapse" value={product.specs.antiCollapse ? "Yes" : "No"}/><SpecRow label="Cloth" value={product.compatibility.cloth ? "Compatible" : "Avoid"}/><SpecRow label="Hybrid" value={product.compatibility.hybrid ? "Compatible" : "Avoid"}/><SpecRow label="Glass" value={product.compatibility.glass ? "Compatible" : "Avoid"}/><SpecRow label="Plastic" value={product.compatibility.plastic ? "Compatible" : "Avoid"}/><SpecRow label="Soft-base behavior" value={product.compatibility.softBase}/></>;
}

function FeelGrid({ rows }: { rows: [string, number][] }) {
  return <div className="v5-feel-grid">{rows.map(([label, value]) => <div key={label}><span>{label}</span><Meter value={value}/><b>{value}</b></div>)}</div>;
}

function DeltaControl({ label, value, onChange, low, high }: { label: string; value: -2 | -1 | 0 | 1 | 2; onChange: (value: -2 | -1 | 0 | 1 | 2) => void; low: string; high: string }) {
  return <label className="v5-delta"><span>{label}<b>{value < 0 ? low : value > 0 ? high : "same"}</b></span><input type="range" min="-2" max="2" step="1" value={value} onChange={event => onChange(+event.target.value as -2 | -1 | 0 | 1 | 2)}/></label>;
}

function AppV05() {
  const [active, setActive] = useState<"fit" | "lab" | "catalog" | "compare" | "method">("fit");
  const [profile, setProfile] = useState(defaultProfile);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [relativeMode, setRelativeMode] = useState(false);

  const [similarityMode, setSimilarityMode] = useState<SimilarityMode>("balanced");
  const [dbType, setDbType] = useState<"all" | "mouse" | "mousepad" | "skate">("mouse");
  const [query, setQuery] = useState("");
  const [brandFilter, setBrandFilter] = useState("all");
  const [shapeFilter, setShapeFilter] = useState<"all" | "symmetrical" | "ergonomic">("all");
  const [minPolling, setMinPolling] = useState(0);
  const [maxWeight, setMaxWeight] = useState(140);
  const [wirelessOnly, setWirelessOnly] = useState(false);
  const [currentOnly, setCurrentOnly] = useState(true);
  const [sort, setSort] = useState<"name" | "weight" | "polling" | "price" | "evidence">("name");

  const [compareIds, setCompareIds] = useState<[string, string]>([mice[0]?.id ?? "", mice[1]?.id ?? ""]);
  const [shapeMouseIds, setShapeMouseIds] = useState<string[]>(() => mice.slice(0, 3).map(mouse => mouse.id));

  const selected = selectedId ? catalog.find(product => product.id === selectedId) ?? null : null;
  const openProduct = (product: Product) => setSelectedId(product.id);
  const addMouseToShapeLab = (mouse: MouseProduct) => {
    setShapeMouseIds(current => current.includes(mouse.id) ? current : [...current, mouse.id].slice(-5));
    setActive("lab");
  };
  const compareMouseShape = (mouse: MouseProduct) => {
    const partner = mouseRec.find(result => result.product.id !== mouse.id)?.product as MouseProduct | undefined;
    setShapeMouseIds(partner ? [mouse.id, partner.id] : [mouse.id]);
    setActive("lab");
  };
  const update = <K extends keyof UserProfile>(key: K, value: UserProfile[K]) => setProfile(current => ({ ...current, [key]: value }));
  const updateRelative = <K extends keyof UserProfile["relative"]>(key: K, value: UserProfile["relative"][K]) => setProfile(current => ({ ...current, relative: { ...current.relative, [key]: value } }));

  const mouseRec = useMemo(() => recommendMice(profile), [profile]);
  const padRec = useMemo(() => recommendPads(profile), [profile]);
  const topPad = padRec[0]?.product as MousepadProduct | undefined;
  const skateRec = useMemo(() => topPad ? recommendSkates(topPad, profile) : [], [topPad, profile]);

  const brands = useMemo(() => [...new Set(catalog.filter(product => dbType === "all" || product.type === dbType).map(product => product.brand))].sort(), [dbType]);
  const filtered = useMemo(() => {
    const items = catalog.filter(product => {
      if (dbType !== "all" && product.type !== dbType) return false;
      if (currentOnly && product.status !== "current") return false;
      if (brandFilter !== "all" && product.brand !== brandFilter) return false;
      if (query && !productSearchText(product).includes(query.toLowerCase())) return false;
      if (product.type === "mouse") {
        if (shapeFilter !== "all" && product.specs.shape !== shapeFilter) return false;
        if (product.specs.maxPollingHz < minPolling) return false;
        if (product.specs.weightG > maxWeight) return false;
        if (wirelessOnly && !product.specs.connectivity.some(mode => /2\.4|wireless|lightspeed/i.test(mode))) return false;
      }
      return true;
    });
    return items.sort((a, b) => {
      if (sort === "name") return `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`);
      if (sort === "price") return (a.msrpUsd ?? 9999) - (b.msrpUsd ?? 9999);
      if (sort === "evidence") return evidenceHealth(b).score - evidenceHealth(a).score;
      if (sort === "weight") return a.type === "mouse" && b.type === "mouse" ? a.specs.weightG - b.specs.weightG : 0;
      if (sort === "polling") return a.type === "mouse" && b.type === "mouse" ? b.specs.maxPollingHz - a.specs.maxPollingHz : 0;
      return 0;
    });
  }, [dbType, currentOnly, brandFilter, query, shapeFilter, minPolling, maxWeight, wirelessOnly, sort]);

  const compareMice = compareIds.map(id => mice.find(mouse => mouse.id === id)).filter((mouse): mouse is MouseProduct => Boolean(mouse));
  const compareShape = compareMice.length === 2 ? shapeSimilarity(compareMice[0], compareMice[1], similarityMode) : null;

  const evidenceAverage = Math.round(catalog.reduce((sum, product) => sum + evidenceHealth(product).score, 0) / Math.max(1, catalog.length));
  const manufacturerCount = catalog.filter(product => product.sources.some(source => source.kind === "manufacturer")).length;
  const independentCount = catalog.filter(product => product.sources.some(source => source.kind === "independent")).length;

  return <div className="v5-shell">
    <header className="v5-topbar">
      <button className="v5-brand" onClick={() => setActive("fit")}><LogoMark/><span><b>ATLAS</b></span><small>v{VERSION}</small></button>
      <nav>{([['fit', 'Find your setup'], ['lab', 'Shape lab'], ['catalog', 'Database'], ['compare', 'Compare'], ['method', 'Method']] as const).map(([id, label]) => <button key={id} className={active === id ? "active" : ""} onClick={() => setActive(id)}>{label}{id === "catalog" && <span>{catalog.length}</span>}</button>)}<a className="v5-product-lab-nav" href="#product-lab">Product lab</a></nav>
      <div className="v5-top-status"><i/> evidence-aware build</div>
    </header>

    {active === "fit" && <main className="v5-main">
      <section className="v5-hero">
        <div className="v5-hero-copy"><div className="v5-kicker">PERIPHERAL FIT ENGINE / MOUSE-FIRST</div><h1>Build around <em>your hand,</em><br/>not a tier list.</h1><p>Input Atlas combines grip geometry, game style, sensitivity, shell shape, surface friction, skate wear and source quality into one explainable setup model.</p><div className="v5-hero-actions"><button className="primary" onClick={() => document.getElementById("v5-profile")?.scrollIntoView({ behavior: "smooth" })}>Build my profile</button><button onClick={() => setActive("lab")}>Open Shape Lab</button></div><div className="v5-stat-strip"><span><b>{mice.length}</b>mice</span><span><b>{mousepads.length}</b>surfaces</span><span><b>{skates.length}</b>skate families</span><span><b>{evidenceAverage}</b>avg data health</span></div></div>
        <div className="v5-hero-lab"><div className="v5-radar"><i/><i/><i/><span>FIT</span></div><div className="v5-hero-readout"><span>HAND GEOMETRY</span><b>{profile.handLengthCm.toFixed(1)} × {profile.handWidthCm.toFixed(1)} cm</b><span>CONTACT MODEL</span><b>{gripLabels[profile.grip]}</b><span>SURFACE TARGET</span><b>{profile.padSpeed}/100 glide</b></div><div className="v5-scan"/></div>
      </section>

      <section className="v5-gamebar v5-panel"><div><span className="v5-label">PRIMARY GAME</span><b>{gameLabels[profile.gameStyle]}</b></div><div>{(Object.keys(gameLabels) as GameStyle[]).map(game => <button key={game} className={profile.gameStyle === game ? "selected" : ""} onClick={() => update("gameStyle", game)}>{gameLabels[game]}</button>)}</div></section>

      <section className="v5-fit-layout" id="v5-profile">
        <aside className="v5-profile v5-panel"><div className="v5-section-head"><span>01</span><div><small>LIVE PROFILE</small><h2>Your aim geometry</h2></div></div>
          <div className="v5-control-pair"><label>Hand length <b>{profile.handLengthCm.toFixed(1)} cm</b><input type="range" min="15" max="23" step=".1" value={profile.handLengthCm} onChange={event => update("handLengthCm", +event.target.value)}/></label><label>Hand width <b>{profile.handWidthCm.toFixed(1)} cm</b><input type="range" min="7" max="13" step=".1" value={profile.handWidthCm} onChange={event => update("handWidthCm", +event.target.value)}/></label></div>
          <span className="v5-label">GRIP SUBTYPE</span><div className="v5-option-grid">{(Object.keys(gripLabels) as Grip[]).map(grip => <button key={grip} className={profile.grip === grip ? "selected" : ""} onClick={() => update("grip", grip)}>{gripLabels[grip]}</button>)}</div>
          <div className="v5-control-pair compact"><label>Aim style<select value={profile.aimStyle} onChange={event => update("aimStyle", event.target.value as UserProfile["aimStyle"])}><option value="finger">Finger</option><option value="wrist">Wrist</option><option value="hybrid">Hybrid</option><option value="arm">Arm</option></select></label><label>Mouse weight<select value={profile.weightPreference} onChange={event => update("weightPreference", event.target.value as UserProfile["weightPreference"])}><option value="ultralight">Ultralight</option><option value="light">Light</option><option value="medium">Medium</option><option value="heavy">Heavy / features</option><option value="any">Any</option></select></label></div>
          <div className="v5-control-pair compact"><label>Sensitivity <b>{profile.cm360} cm/360</b><input type="range" min="15" max="100" value={profile.cm360} onChange={event => update("cm360", +event.target.value)}/></label><label>Budget <b>${profile.budgetUsd}</b><input type="range" min="40" max="300" step="5" value={profile.budgetUsd} onChange={event => update("budgetUsd", +event.target.value)}/></label></div>
          <label className="v5-full-control">Desired pad speed <b>{profile.padSpeed}/100</b><input type="range" min="10" max="98" value={profile.padSpeed} onChange={event => update("padSpeed", +event.target.value)}/><span className="v5-range-ends"><i>CONTROL</i><i>SPEED</i></span></label>
          <button className="v5-disclosure" onClick={() => setShowAdvanced(value => !value)}>{showAdvanced ? "Hide" : "Show"} enthusiast controls <span>{showAdvanced ? "−" : "+"}</span></button>
          {showAdvanced && <div className="v5-advanced"><div className="v5-control-pair compact"><label>Shape<select value={profile.shapePreference} onChange={event => update("shapePreference", event.target.value as UserProfile["shapePreference"])}><option value="any">Any</option><option value="symmetrical">Symmetrical</option><option value="ergonomic">Ergonomic</option></select></label><label>Click feel<select value={profile.clickPreference} onChange={event => update("clickPreference", event.target.value as UserProfile["clickPreference"])}><option value="any">Any</option><option value="light">Light</option><option value="medium">Medium</option><option value="firm">Firm</option></select></label></div><div className="v5-control-pair compact"><label>Texture tolerance <b>{profile.textureTolerance}</b><input type="range" min="10" max="100" value={profile.textureTolerance} onChange={event => update("textureTolerance", +event.target.value)}/></label><label>Pressure<select value={profile.pressureHabit} onChange={event => update("pressureHabit", event.target.value as UserProfile["pressureHabit"])}><option value="light">Light</option><option value="variable">Variable</option><option value="heavy">Heavy</option></select></label></div><div className="v5-control-pair compact"><label>Climate<select value={profile.climate} onChange={event => update("climate", event.target.value as UserProfile["climate"])}><option value="dry">Dry</option><option value="normal">Normal</option><option value="humid">Humid</option></select></label><label>Hand moisture<select value={profile.handMoisture} onChange={event => update("handMoisture", event.target.value as UserProfile["handMoisture"])}><option value="dry">Dry</option><option value="normal">Normal</option><option value="sweaty">Sweaty</option></select></label></div><label className="v5-check">Arm sleeve<input type="checkbox" checked={profile.sleeve} onChange={event => update("sleeve", event.target.checked)}/></label></div>}
          <button className="v5-disclosure secondary" onClick={() => setRelativeMode(value => !value)}>Move from a mouse I own <span>{relativeMode ? "−" : "+"}</span></button>
          {relativeMode && <div className="v5-relative"><label>Current mouse<select value={profile.relative.currentMouseId ?? ""} onChange={event => updateRelative("currentMouseId", event.target.value || undefined)}><option value="">Choose…</option>{mice.map(mouse => <option value={mouse.id} key={mouse.id}>{mouse.brand} {mouse.model}</option>)}</select></label><DeltaControl label="Size" value={profile.relative.sizeDelta} onChange={value => updateRelative("sizeDelta", value)} low="smaller" high="larger"/><DeltaControl label="Grip width" value={profile.relative.widthDelta} onChange={value => updateRelative("widthDelta", value)} low="narrower" high="wider"/><DeltaControl label="Hump" value={profile.relative.humpDelta} onChange={value => updateRelative("humpDelta", value)} low="lower" high="taller"/><DeltaControl label="Weight" value={profile.relative.weightDelta} onChange={value => updateRelative("weightDelta", value)} low="lighter" high="heavier"/><DeltaControl label="Palm support" value={profile.relative.palmSupportDelta} onChange={value => updateRelative("palmSupportDelta", value)} low="less" high="more"/></div>}
        </aside>

        <div className="v5-results"><div className="v5-section-head"><span>02</span><div><small>EXPLAINABLE RANKING</small><h2>Best mouse matches</h2></div><em>profile fit, not product rating</em></div>{mouseRec.slice(0, 5).map((result, index) => <article className="v5-result v5-panel" key={result.product.id}><span className="v5-rank">{String(index + 1).padStart(2, "0")}</span><ProductCard product={result.product} score={result.score} onOpen={openProduct}/><div className="v5-result-actions"><button type="button" onClick={() => compareMouseShape(result.product)}>Compare shape</button><button type="button" className="primary" onClick={() => addMouseToShapeLab(result.product)}>Add to Shape Lab</button></div><div className="v5-why"><div><b>WHY IT FITS</b>{result.reasons.slice(0, 3).map(reason => <p key={reason}>+ {reason}</p>)}</div>{result.cautions[0] && <div className="watch"><b>WATCH</b><p>{result.cautions[0]}</p></div>}</div>{result.breakdown && <div className="v5-breakdown">{Object.entries(result.breakdown).map(([label, value]) => <div key={label}><span>{label}</span><Meter value={value}/><b>{value}</b></div>)}</div>}</article>)}</div>
      </section>

      <section className="v5-stack v5-panel"><div className="v5-section-head"><span>03</span><div><small>SYSTEM MATCH</small><h2>Complete the aiming surface</h2></div><em>mouse × pad × skate</em></div><div className="v5-stack-grid">{topPad && <div><span className="v5-label">PAD MATCH</span><ProductCard product={topPad} score={padRec[0].score} onOpen={openProduct}/><FeelGrid rows={[["Initial", topPad.feel.staticSpeed], ["Dynamic", topPad.feel.dynamicSpeed], ["Stopping", topPad.feel.stoppingPower]]}/></div>}<div className="v5-stack-x">×<small>INTERACTION<br/>MODEL</small></div>{skateRec[0] && <div><span className="v5-label">SKATE MATCH</span><ProductCard product={skateRec[0].product} score={skateRec[0].score} onOpen={openProduct}/><p className="v5-stack-note">{skateRec[0].cautions[0] ?? "Compatibility and broken-in behavior are part of the score."}</p></div>}</div></section>
    </main>}

    {active === "lab" && <ShapeLabV2 similarityMode={similarityMode} setSimilarityMode={setSimilarityMode} selectedMouseIds={shapeMouseIds} onSelectedMouseIdsChange={setShapeMouseIds}/>} 

    {active === "catalog" && <main className="v5-main v5-page">
      <section className="v5-page-head"><div><div className="v5-kicker">CANONICAL DATASET</div><h1>Peripheral database</h1><p>Filter the products by the dimensions and platform traits that matter, then open any record to see provenance, evidence health and family context.</p></div><div className="v5-head-stat"><b>{filtered.length}</b><span>matching records</span></div></section>
      <section className="v5-db-toolbar v5-panel"><div className="v5-db-search"><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search model, grip, material, source, game…"/><div className="v5-segmented">{(["mouse", "mousepad", "skate", "all"] as const).map(type => <button key={type} className={dbType === type ? "active" : ""} onClick={() => { setDbType(type); setBrandFilter("all"); }}>{type}</button>)}</div></div><div className="v5-filter-row"><label>Brand<select value={brandFilter} onChange={event => setBrandFilter(event.target.value)}><option value="all">All brands</option>{brands.map(brand => <option value={brand} key={brand}>{brand}</option>)}</select></label>{(dbType === "mouse" || dbType === "all") && <><label>Shape<select value={shapeFilter} onChange={event => setShapeFilter(event.target.value as typeof shapeFilter)}><option value="all">All shapes</option><option value="symmetrical">Symmetrical</option><option value="ergonomic">Ergonomic</option></select></label><label>Polling<select value={minPolling} onChange={event => setMinPolling(+event.target.value)}><option value="0">Any polling</option><option value="1000">1K+</option><option value="4000">4K+</option><option value="8000">8K</option></select></label><label>Max weight<select value={maxWeight} onChange={event => setMaxWeight(+event.target.value)}><option value="45">≤45 g</option><option value="55">≤55 g</option><option value="65">≤65 g</option><option value="80">≤80 g</option><option value="140">Any weight</option></select></label></>}<label>Sort<select value={sort} onChange={event => setSort(event.target.value as typeof sort)}><option value="name">Name</option><option value="evidence">Data health</option><option value="price">Price</option>{(dbType === "mouse" || dbType === "all") && <><option value="weight">Weight</option><option value="polling">Polling</option></>}</select></label><label className="v5-check small">Current only<input type="checkbox" checked={currentOnly} onChange={event => setCurrentOnly(event.target.checked)}/></label>{(dbType === "mouse" || dbType === "all") && <label className="v5-check small">Wireless<input type="checkbox" checked={wirelessOnly} onChange={event => setWirelessOnly(event.target.checked)}/></label>}<button className="v5-reset" onClick={() => { setQuery(""); setBrandFilter("all"); setShapeFilter("all"); setMinPolling(0); setMaxWeight(140); setWirelessOnly(false); setCurrentOnly(true); setSort("name"); }}>Reset</button></div></section>
      <div className="v5-database-grid">{filtered.map(product => <ProductCard product={product} key={product.id} onOpen={openProduct}/>)}</div>
    </main>}

    {active === "compare" && <main className="v5-main v5-page">
      <section className="v5-page-head"><div><div className="v5-kicker">SIDE-BY-SIDE</div><h1>Compare mice</h1><p>See raw deltas and grip-aware shape similarity together. A higher polling ceiling or lower weight is context, not an automatic verdict.</p></div></section>
      <section className="v5-compare-select v5-panel"><label>Mouse A<select value={compareIds[0]} onChange={event => setCompareIds(current => [event.target.value, current[1]])}>{mice.map(mouse => <option value={mouse.id} key={mouse.id}>{mouse.brand} {mouse.model}</option>)}</select></label><label>Mouse B<select value={compareIds[1]} onChange={event => setCompareIds(current => [current[0], event.target.value])}>{mice.map(mouse => <option value={mouse.id} key={mouse.id}>{mouse.brand} {mouse.model}</option>)}</select></label><div className="v5-mode-grid compact">{(Object.keys(similarityLabels) as SimilarityMode[]).map(mode => <button key={mode} className={similarityMode === mode ? "selected" : ""} onClick={() => setSimilarityMode(mode)}>{similarityLabels[mode]}</button>)}</div></section>
      {compareMice.length === 2 && <><section className="v5-compare-overview"><ProductCard product={compareMice[0]} onOpen={openProduct}/><div className="v5-vs"><span>{compareShape?.score ?? "—"}</span><b>{similarityLabels[similarityMode]} shape</b><small>similarity</small></div><ProductCard product={compareMice[1]} onOpen={openProduct}/></section><section className="v5-panel v5-compare-shape"><ShapeOverlay selected={compareMice} view="top" align="center" normalize={false}/></section><section className="v5-compare-table v5-panel"><div className="v5-compare-head"><span>ATTRIBUTE</span><b>{compareMice[0].brand} {compareMice[0].model}</b><b>{compareMice[1].brand} {compareMice[1].model}</b></div>{[["Weight", `${compareMice[0].specs.weightG} g`, `${compareMice[1].specs.weightG} g`], ["Length", `${compareMice[0].specs.lengthMm} mm`, `${compareMice[1].specs.lengthMm} mm`], ["Grip width", `${compareMice[0].specs.gripWidthMm ?? "—"} mm`, `${compareMice[1].specs.gripWidthMm ?? "—"} mm`], ["Height", `${compareMice[0].specs.heightMm} mm`, `${compareMice[1].specs.heightMm} mm`], ["Hump", formatHump(compareMice[0].specs.hump), formatHump(compareMice[1].specs.hump)], ["Shape", compareMice[0].specs.shape, compareMice[1].specs.shape], ["Sensor", compareMice[0].specs.sensor, compareMice[1].specs.sensor], ["Polling", pollingLabel(compareMice[0].specs.maxPollingHz), pollingLabel(compareMice[1].specs.maxPollingHz)], ["Main switches", compareMice[0].specs.mainSwitch ?? compareMice[0].specs.switchType, compareMice[1].specs.mainSwitch ?? compareMice[1].specs.switchType], ["Palm support", `${compareMice[0].fit.palmSupport ?? "—"}/100`, `${compareMice[1].fit.palmSupport ?? "—"}/100`], ["Evidence health", `${evidenceHealth(compareMice[0]).score}/100`, `${evidenceHealth(compareMice[1]).score}/100`]].map(([label, a, b]) => <div className="v5-compare-row" key={label}><span>{label}</span><b className={a !== b ? "different" : ""}>{a}</b><b className={a !== b ? "different" : ""}>{b}</b></div>)}</section>{compareShape && <section className="v5-panel v5-compare-components"><div className="v5-section-head"><span>Δ</span><div><small>SHAPE COMPONENTS</small><h2>Where the shells diverge</h2></div></div><div className="v5-component-grid">{Object.entries(compareShape.components).map(([key, value]) => <div key={key}><span>{key.replace(/([A-Z])/g, " $1")}</span><Meter value={value}/><b>{Math.round(value)}</b></div>)}</div><p>{compareShape.differences.join(" · ") || "No large modeled differences."}</p></section>}</>}
    </main>}

    {active === "method" && <main className="v5-main v5-page">
      <section className="v5-page-head"><div><div className="v5-kicker">METHODOLOGY / DATA HEALTH</div><h1>Evidence before rankings.</h1><p>Every score should be traceable to what is measured, what is claimed, and what Input Atlas is inferring. The interface exposes those layers instead of blending them together.</p></div><div className="v5-head-stat"><b>{evidenceAverage}</b><span>average health</span></div></section>
      <section className="v5-method-stats"><div className="v5-panel"><b>{catalog.length}</b><span>canonical products</span></div><div className="v5-panel"><b>{manufacturerCount}</b><span>with official sources</span></div><div className="v5-panel"><b>{independentCount}</b><span>with independent sources</span></div><div className="v5-panel"><b>4</b><span>source classes</span></div></section>
      <section className="v5-method-grid">{[["01", "Fit is contextual", "Grip subtype, hand geometry, game style and contact preferences are weighted separately. There is no universal best mouse."], ["02", "Shape beats spec theater", "Grip width, hump position, flare, taper, front height and palm fill matter more to fit than a maximum-CPI badge."], ["03", "Surfaces are systems", "Initial glide, dynamic glide, stopping, pressure, humidity, sleeve use and skate material are modeled as interacting variables."], ["04", "Lifecycle matters", "Fresh, broken-in and worn behavior stay separate where the data supports it, especially for skates and cloth surfaces."], ["05", "Claims keep provenance", "Manufacturer specifications, independent measurements, community observations and Atlas inference remain visibly distinct."], ["06", "No fake precision", "0–100 fit and feel values are comparative indices. True measured latency, friction or force belongs in separate measured fields with methodology." ]].map(([num, title, body]) => <article className="v5-panel" key={num}><span>{num}</span><h2>{title}</h2><p>{body}</p></article>)}</section>
      <section className="v5-source-explainer v5-panel"><div className="v5-section-head"><span>07</span><div><small>PROVENANCE</small><h2>Source classes</h2></div></div>{Object.entries(sourceKindMeta).map(([kind, meta]) => <div key={kind}><EvidenceBadge kind={kind as keyof typeof sourceKindMeta}/><b>{meta.label}</b><p>{meta.description}</p></div>)}</section>
    </main>}

    <footer className="v5-footer"><span>ATLAS / research build v{VERSION}</span><span>{catalog.length} canonical products</span><span>Cloudflare Workers + D1</span></footer>
    {selected && <ProductInspector product={selected} onClose={() => setSelectedId(null)} onOpen={openProduct}/>} 
  </div>;
}

export default AppV05;
