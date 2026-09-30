import { useMemo, useState } from "react";
import { mice } from "../shared/catalog";
import { alignmentOffset, findSimilarShapes, outlineFor, type AlignMode, type ShapeView, type SimilarityMode } from "../shared/shape";
import type { MouseProduct } from "../shared/types";
import { ProductImageCredit, ProductMedia } from "./ProductMedia";

const COLORS = ["#0f766e", "#315f8c", "#6d5fa3", "#a35f13", "#9f3d62"];
const similarityLabels: Record<SimilarityMode, string> = { balanced: "Balanced", claw: "Claw", fingertip: "Fingertip", palm: "Palm" };

type LineStyle = "solid" | "dash" | "dot";
export type ShapeLayer = { id: string; color: string; visible: boolean; opacity: number; lineStyle: LineStyle };

const dashFor = (style: LineStyle) => style === "dash" ? "10 5" : style === "dot" ? "2 5" : undefined;
const fmt = (value: number) => Number.isInteger(value) ? String(value) : value.toFixed(1);
const fallbackMouse = (mouse: MouseProduct) => <span className="shape-fallback">{mouse.brand.slice(0, 1)}{mouse.model.slice(0, 1)}</span>;

function layerMouse(layer: ShapeLayer) {
  return mice.find(mouse => mouse.id === layer.id);
}

export function ShapeCanvas({
  layers,
  view,
  align,
  normalize,
  showDimensions = true,
}: {
  layers: ShapeLayer[];
  view: ShapeView;
  align: AlignMode;
  normalize: boolean;
  showDimensions?: boolean;
}) {
  const W = 960, H = 530, pad = 62;
  const visible = layers.map(layer => ({ layer, mouse: layerMouse(layer) })).filter((item): item is { layer: ShapeLayer; mouse: MouseProduct } => Boolean(item.mouse && item.layer.visible));
  const maxLength = Math.max(...visible.map(({ mouse }) => mouse.specs.lengthMm), 130);
  const maxDim = view === "top"
    ? Math.max(...visible.map(({ mouse }) => mouse.specs.widthMm), 75)
    : Math.max(...visible.map(({ mouse }) => mouse.specs.heightMm), 48);
  const scale = Math.min((W - pad * 2) / (normalize ? 132 : maxLength), (H - pad * 2 - 42) / (normalize ? 82 : maxDim));
  const originX = W / 2;
  const originY = view === "top" ? H / 2 - 14 : H * .72;

  const paths = visible.map(({ layer, mouse }) => {
    const norm = normalize ? 125 / mouse.specs.lengthMm : 1;
    const anchor = alignmentOffset(mouse, align) * norm;
    const points = outlineFor(mouse, view).map(([x, y]) => ({
      x: (x * norm - anchor) * scale + originX,
      y: y * norm * scale + originY,
    }));
    const xs = points.map(point => point.x), ys = points.map(point => point.y);
    return {
      layer,
      mouse,
      coords: points.map(point => `${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(" "),
      box: { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) },
    };
  });

  const dimension = paths[0];
  return <div className="shape-canvas">
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${view} view mouse shape comparison`}>
      <g className="shape-grid">
        {Array.from({ length: 13 }, (_, i) => <line key={`v-${i}`} x1={40 + i * 73.3} y1="24" x2={40 + i * 73.3} y2={H - 38}/>)}
        {Array.from({ length: 7 }, (_, i) => <line key={`h-${i}`} x1="40" y1={45 + i * 70} x2={W - 40} y2={45 + i * 70}/>)}
        <line className="axis" x1={originX} y1="24" x2={originX} y2={H - 38}/>
        <line className="axis" x1="40" y1={originY} x2={W - 40} y2={originY}/>
      </g>
      {paths.map(({ layer, mouse, coords }) => <polygon
        key={mouse.id}
        points={coords}
        fill={layer.color}
        fillOpacity={Math.max(.015, layer.opacity * .045)}
        stroke={layer.color}
        strokeOpacity={Math.max(.4, layer.opacity)}
        strokeWidth="1.8"
        strokeDasharray={dashFor(layer.lineStyle)}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />)}
      {showDimensions && dimension && <g className="shape-dimensions">
        <line x1={dimension.box.minX} y1={H - 34} x2={dimension.box.maxX} y2={H - 34}/>
        <line x1={dimension.box.minX} y1={H - 42} x2={dimension.box.minX} y2={H - 26}/>
        <line x1={dimension.box.maxX} y1={H - 42} x2={dimension.box.maxX} y2={H - 26}/>
        <text x={(dimension.box.minX + dimension.box.maxX) / 2} y={H - 16} textAnchor="middle">{fmt(dimension.mouse.specs.lengthMm)} mm length</text>
        <line x1={dimension.box.maxX + 25} y1={dimension.box.minY} x2={dimension.box.maxX + 25} y2={dimension.box.maxY}/>
        <line x1={dimension.box.maxX + 17} y1={dimension.box.minY} x2={dimension.box.maxX + 33} y2={dimension.box.minY}/>
        <line x1={dimension.box.maxX + 17} y1={dimension.box.maxY} x2={dimension.box.maxX + 33} y2={dimension.box.maxY}/>
        <text x={dimension.box.maxX + 39} y={(dimension.box.minY + dimension.box.maxY) / 2} dominantBaseline="middle">
          {fmt(view === "top" ? dimension.mouse.specs.widthMm : dimension.mouse.specs.heightMm)} mm {view === "top" ? "width" : "height"}
        </text>
      </g>}
    </svg>
    {!visible.length && <div className="shape-empty">Turn on a mouse layer to compare its shell.</div>}
  </div>;
}

function LayerRow({
  layer,
  index,
  onChange,
  onRemove,
}: {
  layer: ShapeLayer;
  index: number;
  onChange: (next: ShapeLayer) => void;
  onRemove: () => void;
}) {
  const mouse = layerMouse(layer);
  if (!mouse) return null;
  return <article className={`shape-layer ${layer.visible ? "" : "muted"}`}>
    <button className="shape-eye" onClick={() => onChange({ ...layer, visible: !layer.visible })} aria-label={layer.visible ? "Hide mouse" : "Show mouse"}>{layer.visible ? "●" : "○"}</button>
    <div className="shape-layer-thumb"><ProductMedia productId={mouse.id} fallback={fallbackMouse(mouse)}/></div>
    <div className="shape-layer-main">
      <span>{String(index + 1).padStart(2, "0")} · {mouse.brand}</span>
      <select value={layer.id} onChange={event => onChange({ ...layer, id: event.target.value })}>{mice.map(item => <option value={item.id} key={item.id}>{item.brand} {item.model}</option>)}</select>
      <small>{fmt(mouse.specs.lengthMm)} × {fmt(mouse.specs.widthMm)} × {fmt(mouse.specs.heightMm)} mm · {fmt(mouse.specs.gripWidthMm ?? mouse.specs.widthMm)} mm grip · {mouse.specs.weightG} g</small>
    </div>
    <label className="shape-color" title="Outline color"><input type="color" value={layer.color} onChange={event => onChange({ ...layer, color: event.target.value })}/><span style={{ background: layer.color }}/></label>
    <select className="shape-line-style" value={layer.lineStyle} onChange={event => onChange({ ...layer, lineStyle: event.target.value as LineStyle })} aria-label="Line style"><option value="solid">Solid</option><option value="dash">Dash</option><option value="dot">Dot</option></select>
    <label className="shape-opacity"><span>{Math.round(layer.opacity * 100)}%</span><input type="range" min="35" max="100" value={Math.round(layer.opacity * 100)} onChange={event => onChange({ ...layer, opacity: +event.target.value / 100 })}/></label>
    <button className="shape-remove" onClick={onRemove} aria-label={`Remove ${mouse.brand} ${mouse.model}`}>×</button>
  </article>;
}

export default function ShapeLabV2({
  similarityMode,
  setSimilarityMode,
}: {
  similarityMode: SimilarityMode;
  setSimilarityMode: (mode: SimilarityMode) => void;
}) {
  const initial = mice.slice(0, 3).map((mouse, index): ShapeLayer => ({ id: mouse.id, color: COLORS[index], visible: true, opacity: .92, lineStyle: index === 1 ? "dash" : index === 2 ? "dot" : "solid" }));
  const [layers, setLayers] = useState<ShapeLayer[]>(initial);
  const [view, setView] = useState<ShapeView>("top");
  const [align, setAlign] = useState<AlignMode>("center");
  const [normalize, setNormalize] = useState(false);
  const [showDimensions, setShowDimensions] = useState(true);
  const [showImages, setShowImages] = useState(true);
  const [referenceId, setReferenceId] = useState(initial[0]?.id ?? mice[0]?.id ?? "");

  const reference = mice.find(mouse => mouse.id === referenceId) ?? mice[0];
  const similar = useMemo(() => reference ? findSimilarShapes(reference, mice, similarityMode) : [], [reference, similarityMode]);
  const updateLayer = (index: number, next: ShapeLayer) => setLayers(current => current.map((layer, i) => i === index ? next : layer));
  const addLayer = () => setLayers(current => {
    if (current.length >= 5) return current;
    const unused = mice.find(mouse => !current.some(layer => layer.id === mouse.id));
    if (!unused) return current;
    const index = current.length;
    return [...current, { id: unused.id, color: COLORS[index % COLORS.length], visible: true, opacity: .92, lineStyle: index % 3 === 1 ? "dash" : index % 3 === 2 ? "dot" : "solid" }];
  });
  const usePair = (id: string) => setLayers([
    { id: reference.id, color: COLORS[0], visible: true, opacity: .95, lineStyle: "solid" },
    { id, color: COLORS[1], visible: true, opacity: .95, lineStyle: "dash" },
  ]);

  return <main className="v5-main v5-page shape-lab-v2">
    <section className="v5-page-head"><div><div className="v5-kicker">GEOMETRY WORKBENCH</div><h1>Shape Lab</h1><p>Layer mice at real scale, control each outline independently, and keep sourced dimensions visible while comparing shell geometry.</p></div><div className="v5-head-stat"><b>{mice.length}</b><span>catalog shapes</span></div></section>

    <section className="shape-toolbar v5-panel">
      <div className="shape-segments">{(["top", "side"] as ShapeView[]).map(item => <button key={item} className={view === item ? "active" : ""} onClick={() => setView(item)}>{item === "top" ? "Top view" : "Side view"}</button>)}</div>
      <label>Alignment<select value={align} onChange={event => setAlign(event.target.value as AlignMode)}><option value="center">Center</option><option value="sensor">Sensor</option><option value="front">Front</option><option value="rear">Rear</option></select></label>
      <label className="shape-toggle"><input type="checkbox" checked={normalize} onChange={event => setNormalize(event.target.checked)}/><span>Normalize length</span></label>
      <label className="shape-toggle"><input type="checkbox" checked={showDimensions} onChange={event => setShowDimensions(event.target.checked)}/><span>Dimensions</span></label>
      <label className="shape-toggle"><input type="checkbox" checked={showImages} onChange={event => setShowImages(event.target.checked)}/><span>Product images</span></label>
    </section>

    <section className="shape-workbench">
      <aside className="shape-layers v5-panel">
        <div className="shape-panel-head"><div><span>COMPARE SET</span><h2>Mouse layers</h2></div><b>{layers.length}/5</b></div>
        <div className="shape-layer-list">{layers.map((layer, index) => <LayerRow key={`${index}-${layer.id}`} layer={layer} index={index} onChange={next => updateLayer(index, next)} onRemove={() => setLayers(current => current.filter((_, i) => i !== index))}/>)}</div>
        <button className="shape-add" onClick={addLayer} disabled={layers.length >= 5}>+ Add mouse</button>
        <p className="shape-method"><b>Outline quality is explicit.</b> A measured or scanned outline is used when Atlas has one. Otherwise the curve is generated from sourced length, width, grip width, height and the catalog geometry model; it remains an approximation rather than a scan.</p>
      </aside>

      <div className="shape-stage v5-panel">
        <div className="shape-stage-head"><div><span>LIVE OVERLAY</span><h2>{view === "top" ? "Top-shell comparison" : "Side-profile comparison"}</h2></div><div><span>{normalize ? "NORMALIZED" : "REAL SCALE"}</span><span>{align.toUpperCase()} ALIGNED</span></div></div>
        <ShapeCanvas layers={layers} view={view} align={align} normalize={normalize} showDimensions={showDimensions}/>
        <div className="shape-spec-strip">{layers.filter(layer => layer.visible).map(layer => {
          const mouse = layerMouse(layer); if (!mouse) return null;
          const quality = mouse.outline?.sourceType ?? "parametric";
          return <article key={mouse.id} style={{ "--shape-color": layer.color } as React.CSSProperties}>
            {showImages && <div className="shape-spec-image"><ProductMedia productId={mouse.id} fallback={fallbackMouse(mouse)}/></div>}
            <div><span>{mouse.brand}</span><b>{mouse.model}</b><small>{fmt(mouse.specs.lengthMm)} L · {fmt(mouse.specs.widthMm)} W · {fmt(mouse.specs.heightMm)} H · {fmt(mouse.specs.gripWidthMm ?? mouse.specs.widthMm)} grip</small><em>{quality === "parametric" ? "modeled outline" : quality.replace("-", " ")}</em></div>
            {showImages && <ProductImageCredit productId={mouse.id}/>}
          </article>;
        })}</div>
      </div>
    </section>

    <section className="shape-similar v5-panel">
      <div className="shape-similar-head"><div><span>SHAPE SEARCH</span><h2>Find close geometry</h2></div><label>Reference<select value={referenceId} onChange={event => setReferenceId(event.target.value)}>{mice.map(mouse => <option key={mouse.id} value={mouse.id}>{mouse.brand} {mouse.model}</option>)}</select></label></div>
      <div className="shape-mode-row">{(Object.keys(similarityLabels) as SimilarityMode[]).map(mode => <button key={mode} className={mode === similarityMode ? "active" : ""} onClick={() => setSimilarityMode(mode)}>{similarityLabels[mode]}</button>)}</div>
      <div className="shape-similar-grid">{similar.slice(0, 8).map((result, index) => <button key={result.mouse.id} onClick={() => usePair(result.mouse.id)}>
        <span className="shape-rank">{String(index + 1).padStart(2, "0")}</span>
        <div className="shape-match-image"><ProductMedia productId={result.mouse.id} fallback={fallbackMouse(result.mouse)}/></div>
        <div><small>{result.mouse.brand}</small><b>{result.mouse.model}</b><p>{result.reasons.slice(0, 2).join(" · ") || "Close modeled geometry"}</p><em>{result.mouse.specs.lengthMm} × {result.mouse.specs.widthMm} × {result.mouse.specs.heightMm} mm</em></div>
        <strong>{result.score}</strong>
      </button>)}</div>
    </section>
  </main>;
}
