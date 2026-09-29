import { useMemo, useState } from "react";
import { catalog, mice, mousepads, skates } from "../shared/catalog";
import { recommendMice, recommendPads, recommendSkates } from "../shared/recommend";
import { alignmentOffset, findSimilarShapes, outlineFor, type AlignMode, type ShapeView } from "../shared/shape";
import type { GameStyle, Grip, MouseProduct, MousepadProduct, Product, UserProfile } from "../shared/types";

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
  "palm-claw-hybrid": "Palm / claw hybrid",
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

const formatHump = (value: string) => value.replace("center-rear", "center / rear");
const scoreClass = (score: number) => score >= 90 ? "elite" : score >= 82 ? "strong" : "good";

function LogoMark() {
  return <div className="logo-mark" aria-hidden="true"><span/><span/><span/></div>;
}

function FitMeter({ value }: { value: number }) {
  return <div className="meter"><div className="meter-fill" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} /></div>;
}

function ProductGlyph({ product }: { product: Product }) {
  if (product.type === "mouse") return <div className={`mouse-glyph ${product.specs.shape}`}><div className="mouse-wheel" /></div>;
  if (product.type === "mousepad") return <div className={`pad-glyph ${product.specs.surfaceClass}`}><span>{product.specs.surfaceClass}</span></div>;
  return <div className="skate-glyph"><span/><span/><span/><span/></div>;
}

function ProductCard({ product, score, compact=false }: { product: Product; score?: number; compact?: boolean }) {
  return <article className={`product-card ${compact ? "compact-card" : ""}`}>
    <div className="product-visual"><ProductGlyph product={product}/>{score != null && <div className={`score-orbit ${scoreClass(score)}`}><b>{score}</b><span>FIT</span></div>}</div>
    <div className="product-copy">
      <div className="eyebrow">{product.brand}</div>
      <h3>{product.model}</h3>
      <p>{product.summary}</p>
      <div className="chips">
        {product.type === "mouse" && <>
          <span>{product.specs.weightG} g</span><span>{product.specs.maxPollingHz >= 1000 ? `${product.specs.maxPollingHz / 1000}K Hz` : `${product.specs.maxPollingHz} Hz`}</span>
          <span>{formatHump(product.specs.hump)} hump</span>{product.specs.gripWidthMm && <span>{product.specs.gripWidthMm} mm grip</span>}
          {(product.specs.programmableButtons ?? 0) > 7 && <span>{product.specs.programmableButtons} inputs</span>}
        </>}
        {product.type === "mousepad" && <><span>{product.specs.surfaceClass}</span><span>{product.specs.firmness}</span><span>{product.feel.staticSpeed}/100 initial</span><span>{product.feel.stoppingPower}/100 stop</span></>}
        {product.type === "skate" && <><span>{product.specs.material.replaceAll("-"," ")}</span><span>{product.specs.format}</span><span>{product.feel.brokenInSpeed ?? product.feel.speed}/100 worn-in</span></>}
      </div>
    </div>
  </article>;
}

function ScoreBreakdown({ breakdown }: { breakdown?: Record<string, number> }) {
  if (!breakdown) return null;
  return <div className="breakdown">{Object.entries(breakdown).map(([k,v]) => <div key={k}><span>{k}</span><FitMeter value={v}/><b>{v}</b></div>)}</div>;
}

function DeltaControl({ label, value, onChange, low, high }: { label: string; value: -2|-1|0|1|2; onChange: (v:-2|-1|0|1|2)=>void; low:string; high:string }) {
  return <label className="delta-control"><span><b>{label}</b><small>{value < 0 ? low : value > 0 ? high : "same"}</small></span><input type="range" min="-2" max="2" step="1" value={value} onChange={e=>onChange(+e.target.value as -2|-1|0|1|2)}/></label>;
}


function ShapeOverlay({ selected, view, align, normalize, opacity }: { selected: MouseProduct[]; view: ShapeView; align: AlignMode; normalize: boolean; opacity: number }) {
  const W=760, H=420, pad=42;
  const palette=["#bcff5c","#5cdfff","#a98bff","#ff9b5c","#ff5ca8"];
  const maxLength=Math.max(...selected.map(m=>m.specs.lengthMm),130);
  const maxDim=view === "top" ? Math.max(...selected.map(m=>m.specs.widthMm),75) : Math.max(...selected.map(m=>m.specs.heightMm),48);
  const scale=Math.min((W-pad*2)/(normalize?130:maxLength),(H-pad*2)/(normalize?80:maxDim));
  const originX=W/2, originY=view === "top" ? H/2 : H*.78;
  const paths=selected.map((mouse,i)=>{
    let pts=outlineFor(mouse,view);
    const len=mouse.specs.lengthMm;
    const norm=normalize ? 125/len : 1;
    const anchor=alignmentOffset(mouse,align);
    const anchorNorm=anchor*norm;
    const coords=pts.map(([x,y])=>{
      const xx=(x*norm-anchorNorm)*scale+originX;
      const yy=y*norm*scale+originY;
      return `${xx.toFixed(1)},${yy.toFixed(1)}`;
    }).join(" ");
    return {mouse,coords,color:palette[i%palette.length]};
  });
  return <div className="overlay-stage">
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${view} view mouse shape overlay`}>
      <g className="overlay-grid"><line x1={originX} y1="18" x2={originX} y2={H-18}/><line x1="18" y1={originY} x2={W-18} y2={originY}/></g>
      {paths.map(({mouse,coords,color})=><polygon key={mouse.id} points={coords} fill={color} fillOpacity={opacity*.10} stroke={color} strokeOpacity={opacity} strokeWidth="2.2" vectorEffect="non-scaling-stroke"/>)}
    </svg>
    <div className="overlay-legend">{paths.map(({mouse,color})=><span key={mouse.id}><i style={{background:color}}/>{mouse.brand} <b>{mouse.model}</b></span>)}</div>
    <div className="overlay-watermark">{normalize ? "NORMALIZED LENGTH" : "REAL SCALE"} · {align.toUpperCase()} ALIGNED · {view.toUpperCase()} VIEW</div>
  </div>;
}

function App() {
  const [profile, setProfile] = useState(defaultProfile);
  const [active, setActive] = useState<"fit"|"shape"|"overlay"|"database"|"compare"|"method">("fit");
  const [dbType, setDbType] = useState<"all"|"mouse"|"mousepad"|"skate">("mouse");
  const [query, setQuery] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [relativeMode, setRelativeMode] = useState(false);
  const [shapeTarget, setShapeTarget] = useState({ length: 122, gripWidth: 59, height: 39, hump: 55, weight: 55 });
  const [compareIds, setCompareIds] = useState<[string,string]>([mice[0]?.id ?? "", mice[1]?.id ?? ""]);
  const [overlayIds, setOverlayIds] = useState<string[]>(mice.slice(0,3).map(m=>m.id));
  const [overlayView, setOverlayView] = useState<ShapeView>("top");
  const [overlayAlign, setOverlayAlign] = useState<AlignMode>("center");
  const [overlayNormalize, setOverlayNormalize] = useState(false);
  const [overlayOpacity, setOverlayOpacity] = useState(.9);
  const [similarBaseId, setSimilarBaseId] = useState(mice[0]?.id ?? "");

  const mouseRec = useMemo(() => recommendMice(profile), [profile]);
  const padRec = useMemo(() => recommendPads(profile), [profile]);
  const topPad = padRec[0]?.product as MousepadProduct | undefined;
  const skateRec = useMemo(() => topPad ? recommendSkates(topPad, profile) : [], [topPad, profile]);
  const filtered = useMemo(() => catalog.filter(p => {
    const haystack = `${p.brand} ${p.model} ${p.summary} ${(p.tags ?? []).join(" ")}`.toLowerCase();
    return (dbType === "all" || p.type === dbType) && haystack.includes(query.toLowerCase());
  }), [dbType, query]);
  const update = <K extends keyof UserProfile>(key: K, value: UserProfile[K]) => setProfile(v => ({...v, [key]: value}));
  const updateRelative = <K extends keyof UserProfile["relative"]>(key: K, value: UserProfile["relative"][K]) => setProfile(v => ({...v, relative:{...v.relative,[key]:value}}));

  const shapeMatches = useMemo(() => mice.map(mouse => {
    const hump = mouse.geometry?.humpPositionPct ?? (mouse.specs.hump === "rear" ? 78 : mouse.specs.hump === "center-rear" ? 65 : mouse.specs.hump === "front" ? 35 : 50);
    const gripWidth = mouse.specs.gripWidthMm ?? mouse.specs.widthMm;
    const dist = Math.sqrt(
      ((mouse.specs.lengthMm-shapeTarget.length)/8)**2 +
      ((gripWidth-shapeTarget.gripWidth)/5)**2 +
      ((mouse.specs.heightMm-shapeTarget.height)/4)**2 +
      ((hump-shapeTarget.hump)/15)**2 +
      ((mouse.specs.weightG-shapeTarget.weight)/15)**2
    );
    return { mouse, score: Math.round(Math.max(0, 100-dist*18)), hump, gripWidth };
  }).sort((a,b)=>b.score-a.score), [shapeTarget]);

  const compareMice = compareIds.map(id => mice.find(m=>m.id===id)).filter(Boolean) as MouseProduct[];
  const overlayMice = overlayIds.map(id=>mice.find(m=>m.id===id)).filter(Boolean) as MouseProduct[];
  const similarBase = mice.find(m=>m.id===similarBaseId) ?? mice[0];
  const similarShapes = useMemo(() => similarBase ? findSimilarShapes(similarBase,mice) : [], [similarBase]);

  return <div className="app-shell">
    <div className="ambient a1"/><div className="ambient a2"/>
    <header className="topbar">
      <button className="brand" onClick={() => setActive("fit")}><LogoMark/><span>INPUT <b>ATLAS</b></span><small>GAMING LAB</small></button>
      <nav>
        <button className={active === "fit" ? "active" : ""} onClick={() => setActive("fit")}>Find your setup</button>
        <button className={active === "shape" ? "active" : ""} onClick={() => setActive("shape")}>Shape finder</button>
        <button className={active === "overlay" ? "active" : ""} onClick={() => setActive("overlay")}>Shape lab</button>
        <button className={active === "database" ? "active" : ""} onClick={() => setActive("database")}>Database <span className="count">{catalog.length}</span></button>
        <button className={active === "compare" ? "active" : ""} onClick={() => setActive("compare")}>Compare</button>
        <button className={active === "method" ? "active" : ""} onClick={() => setActive("method")}>Method</button>
      </nav>
      <div className="status-pill"><i/> gaming-mouse first</div>
    </header>

    {active === "fit" && <main>
      <section className="hero">
        <div className="hero-copy">
          <div className="kicker">GAMING MOUSE FIT ENGINE <span>v0.3</span></div>
          <h1>Fit your aim.<br/><em>Not the hype.</em></h1>
          <p>Hand geometry, grip subtype, game, sensitivity, shape, clicks, wheel, pad friction and skate wear — modeled as one gaming system.</p>
          <div className="hero-actions"><button className="primary" onClick={()=>document.getElementById("profile")?.scrollIntoView({behavior:"smooth"})}>Build my profile</button><button onClick={()=>setRelativeMode(v=>!v)}>I already own a mouse</button></div>
          <div className="hero-stat-row"><div><b>{mice.length}</b><span>gaming mice</span></div><div><b>{mousepads.length}</b><span>aim surfaces</span></div><div><b>{skates.length}</b><span>skate families</span></div><div><b>8</b><span>game profiles</span></div></div>
        </div>
        <div className="hero-graphic">
          <div className="crosshair"><span/><span/></div><div className="mouse-wireframe"><div className="mw-line l1"/><div className="mw-line l2"/><div className="mw-wheel"/></div>
          <div className="coordinate x">SHAPE / 5 AXES</div><div className="coordinate y">GRIP / 8 TYPES</div><div className="coordinate z">SURFACE / STACK</div><div className="scanline"/>
        </div>
      </section>

      <section className="game-strip panel">
        <div><span className="micro-label">PRIMARY GAME PROFILE</span><strong>{gameLabels[profile.gameStyle]}</strong></div>
        <div className="game-buttons">{(Object.keys(gameLabels) as GameStyle[]).map(g=><button key={g} className={profile.gameStyle===g?"selected":""} onClick={()=>update("gameStyle",g)}>{gameLabels[g]}</button>)}</div>
      </section>

      <section className="fit-grid" id="profile">
        <aside className="profile-panel panel">
          <div className="section-head"><div><span>01</span><h2>Your aim profile</h2></div><small>live scoring</small></div>
          <div className="field-pair"><label>Hand length <b>{profile.handLengthCm.toFixed(1)} cm</b><input type="range" min="15" max="23" step="0.1" value={profile.handLengthCm} onChange={e=>update("handLengthCm",+e.target.value)}/></label><label>Hand width <b>{profile.handWidthCm.toFixed(1)} cm</b><input type="range" min="7" max="13" step="0.1" value={profile.handWidthCm} onChange={e=>update("handWidthCm",+e.target.value)}/></label></div>
          <label className="field-label">Grip subtype</label><div className="option-grid grip-grid">{(Object.keys(gripLabels) as Grip[]).map(g=><button key={g} className={profile.grip===g?"selected":""} onClick={()=>update("grip",g)}>{gripLabels[g]}</button>)}</div>
          <div className="field-pair compact"><label>Finger layout<select value={profile.fingerLayout} onChange={e=>update("fingerLayout",e.target.value as UserProfile["fingerLayout"])}><option value="1-2-2">1-2-2</option><option value="1-3-1-wheel">1-3-1 / finger on wheel</option><option value="1-3-1-m2">1-3-1 / finger on M2</option></select></label><label>Aim style<select value={profile.aimStyle} onChange={e=>update("aimStyle",e.target.value as UserProfile["aimStyle"])}><option value="finger">Finger</option><option value="wrist">Wrist</option><option value="hybrid">Hybrid</option><option value="arm">Arm</option></select></label></div>
          <div className="field-pair compact"><label>Sensitivity <b>{profile.cm360} cm/360</b><input type="range" min="15" max="100" value={profile.cm360} onChange={e=>update("cm360",+e.target.value)}/></label><label>DPI<select value={profile.dpi} onChange={e=>update("dpi",+e.target.value)}><option value="400">400</option><option value="800">800</option><option value="1600">1600</option><option value="3200">3200</option></select></label></div>
          <div className="field-pair compact"><label>Mouse weight<select value={profile.weightPreference} onChange={e=>update("weightPreference",e.target.value as UserProfile["weightPreference"])}><option value="ultralight">Ultra-light</option><option value="light">Light</option><option value="medium">Medium</option><option value="heavy">Heavy / feature-rich</option><option value="any">No preference</option></select></label><label>Shape<select value={profile.shapePreference} onChange={e=>update("shapePreference",e.target.value as UserProfile["shapePreference"])}><option value="any">Any</option><option value="symmetrical">Symmetrical</option><option value="ergonomic">Ergonomic</option></select></label></div>
          <button className="advanced-toggle" onClick={()=>setShowAdvanced(v=>!v)}>{showAdvanced ? "Hide" : "Show"} enthusiast controls <span>{showAdvanced?"−":"+"}</span></button>
          {showAdvanced && <div className="advanced-fields">
            <div className="field-pair compact"><label>Click feel<select value={profile.clickPreference} onChange={e=>update("clickPreference",e.target.value as UserProfile["clickPreference"])}><option value="any">Any</option><option value="light">Light</option><option value="medium">Medium</option><option value="firm">Firm</option></select></label><label>Wheel<select value={profile.wheelPreference} onChange={e=>update("wheelPreference",e.target.value as UserProfile["wheelPreference"])}><option value="any">Any</option><option value="light">Light scroll</option><option value="defined">Defined steps</option><option value="free-spin">Free-spin</option></select></label></div>
            <div className="field-pair compact"><label>Extra buttons<select value={profile.extraButtons} onChange={e=>update("extraButtons",e.target.value as UserProfile["extraButtons"])}><option value="minimal">Minimal</option><option value="some">Some</option><option value="many">Many / MMO</option></select></label><label>Hand moisture<select value={profile.handMoisture} onChange={e=>update("handMoisture",e.target.value as UserProfile["handMoisture"])}><option value="dry">Dry</option><option value="normal">Normal</option><option value="sweaty">Sweaty</option></select></label></div>
            <div className="field-pair compact"><label>Display<select value={profile.displayHz} onChange={e=>update("displayHz",+e.target.value)}><option value="144">144 Hz</option><option value="165">165 Hz</option><option value="240">240 Hz</option><option value="360">360 Hz</option><option value="480">480+ Hz</option></select></label><label>CPU tier<select value={profile.cpuTier} onChange={e=>update("cpuTier",e.target.value as UserProfile["cpuTier"])}><option value="entry">Entry</option><option value="mid">Midrange</option><option value="high">High-end</option></select></label></div>
            <label className="budget-field">Budget <b>${profile.budgetUsd}</b><input type="range" min="40" max="300" step="5" value={profile.budgetUsd} onChange={e=>update("budgetUsd",+e.target.value)}/></label>
          </div>}
          <div className="divider"/>
          <div className="pad-tuner"><label>Desired pad speed <b>{profile.padSpeed}/100</b><input type="range" min="10" max="98" value={profile.padSpeed} onChange={e=>update("padSpeed",+e.target.value)}/><div className="range-ends"><span>CONTROL</span><span>SPEED</span></div></label></div>
          <div className="field-pair compact"><label>Texture tolerance <b>{profile.textureTolerance}</b><input type="range" min="10" max="100" value={profile.textureTolerance} onChange={e=>update("textureTolerance",+e.target.value)}/></label><label>Pressure<select value={profile.pressureHabit} onChange={e=>update("pressureHabit",e.target.value as UserProfile["pressureHabit"])}><option value="light">Light</option><option value="variable">Variable</option><option value="heavy">Heavy</option></select></label></div>
          <div className="field-pair compact"><label>Climate<select value={profile.climate} onChange={e=>update("climate",e.target.value as UserProfile["climate"])}><option value="dry">Dry</option><option value="normal">Normal</option><option value="humid">Humid</option></select></label><label className="inline-check">Arm sleeve<input type="checkbox" checked={profile.sleeve} onChange={e=>update("sleeve",e.target.checked)}/></label></div>
        </aside>

        <div className="results-column">
          {relativeMode && <section className="relative-panel panel">
            <div className="section-head"><div><span>↔</span><h2>Move from what you own</h2></div><button className="text-button" onClick={()=>setRelativeMode(false)}>close</button></div>
            <label className="current-mouse">Current mouse<select value={profile.relative.currentMouseId ?? ""} onChange={e=>updateRelative("currentMouseId",e.target.value || undefined)}><option value="">Choose a mouse…</option>{mice.map(m=><option value={m.id} key={m.id}>{m.brand} {m.model}</option>)}</select></label>
            <div className="delta-grid">
              <DeltaControl label="Overall size" value={profile.relative.sizeDelta} onChange={v=>updateRelative("sizeDelta",v)} low="smaller" high="larger"/>
              <DeltaControl label="Grip width" value={profile.relative.widthDelta} onChange={v=>updateRelative("widthDelta",v)} low="narrower" high="wider"/>
              <DeltaControl label="Hump volume" value={profile.relative.humpDelta} onChange={v=>updateRelative("humpDelta",v)} low="lower" high="taller"/>
              <DeltaControl label="Weight" value={profile.relative.weightDelta} onChange={v=>updateRelative("weightDelta",v)} low="lighter" high="heavier"/>
              <DeltaControl label="Palm support" value={profile.relative.palmSupportDelta} onChange={v=>updateRelative("palmSupportDelta",v)} low="less contact" high="more support"/>
            </div>
          </section>}
          <div className="section-head results-head"><div><span>02</span><h2>Best gaming-mouse matches</h2></div><small>no universal leaderboard</small></div>
          {mouseRec.slice(0,5).map((r, i)=><div className={`result-wrap rank-${i+1}`} key={r.product.id}>
            <div className="rank">{String(i+1).padStart(2,"0")}</div><ProductCard product={r.product} score={r.score}/>
            <div className="why"><div><b>Why it fits</b>{r.reasons.slice(0,3).map(x=><p key={x}>+ {x}</p>)}</div>{r.cautions.length>0&&<div className="caution"><b>Watch</b><p>{r.cautions[0]}</p></div>}</div>
            <ScoreBreakdown breakdown={r.breakdown}/>
          </div>)}
        </div>
      </section>

      <section className="pairing-section panel">
        <div className="section-head"><div><span>03</span><h2>Complete the aiming surface</h2></div><small>pad + skate interaction</small></div>
        <div className="pairing-grid">
          <div className="pair-card"><div className="pair-label">PAD MATCH</div>{topPad && <ProductCard product={topPad} score={padRec[0].score}/>}<div className="feel-bars"><label>Initial speed <FitMeter value={topPad?.feel.staticSpeed ?? 0}/></label><label>Dynamic speed <FitMeter value={topPad?.feel.dynamicSpeed ?? 0}/></label><label>Stopping <FitMeter value={topPad?.feel.stoppingPower ?? 0}/></label><label>Pressure response <FitMeter value={topPad?.feel.pressureResponse ?? 0}/></label></div></div>
          <div className="pair-link"><span>×</span><small>INTERACTION<br/>MODEL</small></div>
          <div className="pair-card"><div className="pair-label">SKATE MATCH</div>{skateRec[0] && <ProductCard product={skateRec[0].product} score={skateRec[0].score}/>}<div className="compat-note"><b>Broken-in behavior matters.</b> {skateRec[0]?.cautions[0] ?? "Surface compatibility verified in seed data."}</div></div>
        </div>
        <div className="alternates"><span>Surface alternatives</span>{padRec.slice(1,4).map(r=><button key={r.product.id} onClick={()=>{}}><b>{r.score}</b>{r.product.brand} {r.product.model}</button>)}</div>
      </section>
    </main>}

    {active === "shape" && <main className="shape-page">
      <section className="db-head"><div><div className="kicker">GEOMETRY SEARCH</div><h1>Shape finder</h1><p>Search by the geometry you actually feel in-hand. Grip width and hump location matter more than a single “medium mouse” label.</p></div><div className="db-count"><b>{mice.length}</b><span>gaming shapes</span></div></section>
      <section className="shape-layout">
        <aside className="shape-controls panel">
          <div className="section-head"><div><span>01</span><h2>Target shape</h2></div><small>nearest geometry</small></div>
          {([
            ["Length", "length", 108, 135, "mm"],
            ["Grip width", "gripWidth", 50, 72, "mm"],
            ["Height", "height", 32, 47, "mm"],
            ["Hump position", "hump", 25, 85, "% rear"],
            ["Weight", "weight", 30, 120, "g"],
          ] as const).map(([label,key,min,max,unit])=><label className="shape-slider" key={key}><span>{label}<b>{shapeTarget[key]} {unit}</b></span><input type="range" min={min} max={max} step="1" value={shapeTarget[key]} onChange={e=>setShapeTarget(v=>({...v,[key]:+e.target.value}))}/></label>)}
          <div className="shape-note">Hump-position values are explicit geometry where available and normalized editorial estimates elsewhere. The UI keeps that distinction in product evidence.</div>
        </aside>
        <div className="shape-results"><div className="section-head"><div><span>02</span><h2>Closest shapes</h2></div><small>5-axis distance</small></div>{shapeMatches.slice(0,8).map((x,i)=><div className="shape-result panel" key={x.mouse.id}><div className="shape-rank">{i+1}</div><ProductGlyph product={x.mouse}/><div><div className="eyebrow">{x.mouse.brand}</div><h3>{x.mouse.model}</h3><div className="shape-stats"><span>{x.mouse.specs.lengthMm} L</span><span>{x.gripWidth} grip</span><span>{x.mouse.specs.heightMm} H</span><span>{Math.round(x.hump)}% hump</span><span>{x.mouse.specs.weightG} g</span></div></div><div className="shape-score"><b>{x.score}</b><span>GEOMETRY</span></div></div>)}</div>
      </section>
    </main>}

    {active === "overlay" && <main className="overlay-page">
      <section className="db-head"><div><div className="kicker">SHAPE LAB / OWN GEOMETRY MODEL</div><h1>Overlay. Align. Find similar.</h1><p>Compare gaming-mouse geometry without flattening everything into length × width. Input Atlas can preserve real scale or normalize length, align by center/front/rear/sensor, and explain where similar shapes actually diverge.</p></div><div className="db-count"><b>{mice.length}</b><span>searchable shapes</span></div></section>
      <div className="overlay-layout">
        <aside className="overlay-controls panel">
          <div className="section-head"><div><span>01</span><h2>Overlay set</h2></div><small>up to 5</small></div>
          {[0,1,2,3,4].map(i=><label className="overlay-picker" key={i}>Layer {i+1}<select value={overlayIds[i] ?? ""} onChange={e=>setOverlayIds(cur=>{ const next=[...cur]; if(e.target.value) next[i]=e.target.value; else next.splice(i,1); return next.filter(Boolean).slice(0,5); })}><option value="">None</option>{mice.map(m=><option value={m.id} key={m.id}>{m.brand} {m.model}</option>)}</select></label>)}
          <div className="overlay-options"><label>View<select value={overlayView} onChange={e=>setOverlayView(e.target.value as ShapeView)}><option value="top">Top</option><option value="side">Side</option></select></label><label>Align<select value={overlayAlign} onChange={e=>setOverlayAlign(e.target.value as AlignMode)}><option value="center">Center</option><option value="sensor">Sensor</option><option value="front">Front</option><option value="rear">Rear</option></select></label></div>
          <label className="inline-check">Normalize all to same length <input type="checkbox" checked={overlayNormalize} onChange={e=>setOverlayNormalize(e.target.checked)}/></label>
          <label className="shape-slider"><span>Outline opacity <b>{Math.round(overlayOpacity*100)}%</b></span><input type="range" min="25" max="100" value={overlayOpacity*100} onChange={e=>setOverlayOpacity(+e.target.value/100)}/></label>
          <div className="shape-note"><b>Current outlines are Atlas-parametric.</b> They are derived from our own dimensions, hump, flare and curvature fields, not copied from another comparison site. The schema can later accept measured SVG outlines or 3D scans with provenance.</div>
        </aside>
        <section className="overlay-workbench">
          <div className="panel overlay-panel"><div className="section-head"><div><span>02</span><h2>Live overlay</h2></div><small>{overlayView} view</small></div><ShapeOverlay selected={overlayMice} view={overlayView} align={overlayAlign} normalize={overlayNormalize} opacity={overlayOpacity}/></div>
          <div className="panel similar-panel"><div className="section-head"><div><span>03</span><h2>Find similar</h2></div><small>8-axis geometry</small></div>
            <label className="similar-base">Reference mouse<select value={similarBaseId} onChange={e=>setSimilarBaseId(e.target.value)}>{mice.map(m=><option value={m.id} key={m.id}>{m.brand} {m.model}</option>)}</select></label>
            <div className="similar-list">{similarShapes.slice(0,10).map((r,i)=><button key={r.mouse.id} className="similar-row" onClick={()=>setOverlayIds([similarBase.id,r.mouse.id])}><span className="similar-rank">{String(i+1).padStart(2,"0")}</span><div><div className="eyebrow">{r.mouse.brand}</div><h3>{r.mouse.model}</h3><p>{r.reasons.slice(0,2).join(" · ") || "Close composite geometry"}</p><small>{r.differences.slice(0,2).join(" · ")}</small></div><div className="shape-score"><b>{r.score}</b><span>SHAPE</span></div></button>)}</div>
          </div>
        </section>
      </div>
    </main>}

    {active === "database" && <main className="database-page">
      <section className="db-head"><div><div className="kicker">CANONICAL DATASET</div><h1>Gaming input database</h1><p>Gaming mice first; pads and skates stay because they change how the mouse actually feels. Facts, measurements and editorial fit vectors retain separate provenance.</p></div><div className="db-count"><b>{filtered.length}</b><span>matching records</span></div></section>
      <div className="db-toolbar panel"><input placeholder="Search brand, model, grip, material, game…" value={query} onChange={e=>setQuery(e.target.value)}/><div className="segmented">{(["mouse","mousepad","skate","all"] as const).map(t=><button className={dbType===t?"active":""} onClick={()=>setDbType(t)} key={t}>{t}</button>)}</div></div>
      <div className="database-grid">{filtered.map(p=><ProductCard product={p} key={p.id}/>)}</div>
    </main>}

    {active === "compare" && <main className="compare-page">
      <section className="db-head"><div><div className="kicker">SIDE BY SIDE</div><h1>Compare mice</h1><p>Compare geometry and gaming features without collapsing them into a fake universal score.</p></div></section>
      <div className="compare-selectors panel">{[0,1].map(i=><label key={i}>Mouse {i+1}<select value={compareIds[i]} onChange={e=>setCompareIds(v=>i===0?[e.target.value,v[1]]:[v[0],e.target.value])}>{mice.map(m=><option value={m.id} key={m.id}>{m.brand} {m.model}</option>)}</select></label>)}</div>
      {compareMice.length===2 && <div className="compare-table panel">
        <div className="compare-head"><div/><div><ProductGlyph product={compareMice[0]}/><span>{compareMice[0].brand}</span><h2>{compareMice[0].model}</h2></div><div><ProductGlyph product={compareMice[1]}/><span>{compareMice[1].brand}</span><h2>{compareMice[1].model}</h2></div></div>
        {[
          ["Weight", `${compareMice[0].specs.weightG} g`, `${compareMice[1].specs.weightG} g`],
          ["Length", `${compareMice[0].specs.lengthMm} mm`, `${compareMice[1].specs.lengthMm} mm`],
          ["Overall width", `${compareMice[0].specs.widthMm} mm`, `${compareMice[1].specs.widthMm} mm`],
          ["Grip width", `${compareMice[0].specs.gripWidthMm ?? "—"} mm`, `${compareMice[1].specs.gripWidthMm ?? "—"} mm`],
          ["Height", `${compareMice[0].specs.heightMm} mm`, `${compareMice[1].specs.heightMm} mm`],
          ["Hump", formatHump(compareMice[0].specs.hump), formatHump(compareMice[1].specs.hump)],
          ["Shape", compareMice[0].specs.shape, compareMice[1].specs.shape],
          ["Sensor", compareMice[0].specs.sensor, compareMice[1].specs.sensor],
          ["Polling ceiling", `${compareMice[0].specs.maxPollingHz/1000}K Hz`, `${compareMice[1].specs.maxPollingHz/1000}K Hz`],
          ["Main switches", compareMice[0].specs.mainSwitch ?? compareMice[0].specs.switchType, compareMice[1].specs.mainSwitch ?? compareMice[1].specs.switchType],
          ["Programmable inputs", String(compareMice[0].specs.programmableButtons ?? "—"), String(compareMice[1].specs.programmableButtons ?? "—")],
          ["Wheel", compareMice[0].specs.freeSpinWheel ? "Free-spin + ratchet" : compareMice[0].fit.wheelTactility ? `${compareMice[0].fit.wheelTactility}/100 tactility` : "Standard", compareMice[1].specs.freeSpinWheel ? "Free-spin + ratchet" : compareMice[1].fit.wheelTactility ? `${compareMice[1].fit.wheelTactility}/100 tactility` : "Standard"],
          ["Palm support index", `${compareMice[0].fit.palmSupport ?? "—"}/100`, `${compareMice[1].fit.palmSupport ?? "—"}/100`],
          ["Sweaty-hand coating", `${compareMice[0].fit.coatingSweaty}/100`, `${compareMice[1].fit.coatingSweaty}/100`],
        ].map(row=><div className="compare-row" key={row[0]}><b>{row[0]}</b><span>{row[1]}</span><span>{row[2]}</span></div>)}
      </div>}
    </main>}

    {active === "method" && <main className="method-page">
      <section className="db-head"><div><div className="kicker">WHY THIS EXISTS</div><h1>Evidence before rankings.</h1><p>Gaming-mouse enthusiasts care about interactions ordinary spec sheets erase. Input Atlas models them directly and keeps subjective inference visibly separate from measurement.</p></div></section>
      <div className="method-grid">
        <article className="panel"><span className="method-num">01</span><h2>Gaming fit is contextual</h2><p>Tactical FPS, tracking, arena, battle royale, MMO, MOBA and general gaming weight shape, mass, buttons, clicks and wheel behavior differently. There is no universal winner.</p></article>
        <article className="panel"><span className="method-num">02</span><h2>Shape beats spec theater</h2><p>Hand geometry, hump placement, side curvature, grip width, finger layout and contact style carry more fit weight than maximum CPI or a polling-rate badge.</p></article>
        <article className="panel"><span className="method-num">03</span><h2>Surfaces are systems</h2><p>Pad speed is split into initial and dynamic behavior, then modified by foam firmness, pressure habit, skate material, texture, humidity, sleeve use, break-in and wear.</p></article>
        <article className="panel"><span className="method-num">04</span><h2>Lifecycle matters</h2><p>Skates and cloth surfaces can feel different fresh, broken-in and worn. Those states remain separate fields instead of being flattened into one permanent “speed” score.</p></article>
        <article className="panel"><span className="method-num">05</span><h2>Claims keep provenance</h2><p>Manufacturer specifications, independent measurements, community observations and our derived fit vectors never share the same evidence label.</p></article>
        <article className="panel"><span className="method-num">06</span><h2>No fake precision</h2><p>Normalized 0–100 feel values are comparative indices. Actual measured latency, friction or force is stored separately with the test method and source.</p></article>
      </div>
      <div className="source-stack panel"><h2>Evidence classes</h2><div><span className="source-badge manufacturer">M</span><b>Manufacturer</b><p>Dimensions, materials, polling support, included hardware, official compatibility.</p></div><div><span className="source-badge independent">I</span><b>Independent</b><p>Measured latency, weight, CPI behavior, click force/travel, controlled comparisons and geometry.</p></div><div><span className="source-badge community">C</span><b>Community</b><p>Long-term wear, coating behavior, grip-specific fit, humidity, QC patterns and uncommon combinations.</p></div><div><span className="source-badge editorial">A</span><b>Atlas model</b><p>Normalized fit and feel vectors derived from sourced facts, explicitly labeled as editorial inference rather than measurement.</p></div></div>
    </main>}
    <footer><span>INPUT ATLAS / gaming research build v0.3</span><span>{catalog.length} canonical products</span><span>Cloudflare Workers + D1</span></footer>
  </div>
}

export default App;
