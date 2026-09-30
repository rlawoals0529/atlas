import { useEffect, useMemo, useState } from "react";
import { mice } from "../shared/catalog";
import { alignmentOffset, findSimilarShapes, outlineFor, type AlignMode, type ShapeView, type SimilarityMode } from "../shared/shape";
import type { MouseProduct } from "../shared/types";
import { ProductImageCredit, ProductMedia } from "./ProductMedia";

const COLORS = ["#0f766e", "#315f8c", "#6d5fa3", "#a35f13", "#9f3d62"];
const similarityLabels: Record<SimilarityMode, string> = { balanced: "Balanced", claw: "Claw", fingertip: "Fingertip", palm: "Palm" };

type LineStyle = "solid" | "dash" | "dot";
export type ShapeLayer = { id: string; color: string; visible: boolean; opacity: number; lineStyle: LineStyle };

type ShapeShareState = {
  layers: ShapeLayer[];
  view: ShapeView;
  align: AlignMode;
  normalize: boolean;
  showDimensions: boolean;
  showImages: boolean;
  showFills: boolean;
  showLabels: boolean;
  similarityMode?: SimilarityMode;
  referenceId?: string;
};

const readShapeShareState = (): ShapeShareState | null => {
  if (typeof window === "undefined") return null;
  const raw = new URL(window.location.href).searchParams.get("shape");
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<ShapeShareState>;
    const validIds = new Set(mice.map(mouse => mouse.id));
    const layers = Array.isArray(parsed.layers)
      ? parsed.layers.filter(layer => layer && validIds.has(layer.id)).slice(0, 5).map((layer, index): ShapeLayer => ({
          id: layer.id,
          color: /^#[0-9a-f]{6}$/i.test(layer.color ?? "") ? layer.color : COLORS[index % COLORS.length],
          visible: layer.visible !== false,
          opacity: Math.max(.35, Math.min(1, Number(layer.opacity) || .92)),
          lineStyle: layer.lineStyle === "dash" || layer.lineStyle === "dot" ? layer.lineStyle : "solid",
        }))
      : [];
    if (!layers.length) return null;
    return {
      layers,
      view: parsed.view === "side" ? "side" : "top",
      align: parsed.align === "sensor" || parsed.align === "front" || parsed.align === "rear" ? parsed.align : "center",
      normalize: Boolean(parsed.normalize),
      showDimensions: parsed.showDimensions !== false,
      showImages: parsed.showImages !== false,
      showFills: Boolean(parsed.showFills),
      showLabels: parsed.showLabels !== false,
      similarityMode: parsed.similarityMode,
      referenceId: typeof parsed.referenceId === "string" && validIds.has(parsed.referenceId) ? parsed.referenceId : layers[0].id,
    };
  } catch {
    return null;
  }
};

const dashFor = (style: LineStyle) => style === "dash" ? "10 5" : style === "dot" ? "2 5" : undefined;
const fmt = (value: number) => Number.isInteger(value) ? String(value) : value.toFixed(1);
const fallbackMouse = (mouse: MouseProduct) => <span className="shape-fallback">{mouse.brand.slice(0, 1)}{mouse.model.slice(0, 1)}</span>;
const qualityLabel = (mouse: MouseProduct, view: ShapeView) => {
  if (!mouse.outline?.[view]?.length) return "PARAMETRIC ESTIMATE";
  if (mouse.outline.sourceType === "traced-reference") return "TRACED REFERENCE";
  if (mouse.outline.sourceType === "measured-svg") return "MEASURED";
  if (mouse.outline.sourceType === "scan") return "MEASURED SCAN";
  return "PARAMETRIC ESTIMATE";
};

function layerMouse(layer: ShapeLayer) {
  return mice.find(mouse => mouse.id === layer.id);
}

export function ShapeCanvas({
  layers,
  view,
  align,
  normalize,
  showDimensions = true,
  showFills = false,
  showLabels = true,
}: {
  layers: ShapeLayer[];
  view: ShapeView;
  align: AlignMode;
  normalize: boolean;
  showDimensions?: boolean;
  showFills?: boolean;
  showLabels?: boolean;
}) {
  const W = 960, H = 560, pad = 62;
  const visible = layers.map(layer => ({ layer, mouse: layerMouse(layer) })).filter((item): item is { layer: ShapeLayer; mouse: MouseProduct } => Boolean(item.mouse && item.layer.visible));
  const maxLength = Math.max(...visible.map(({ mouse }) => mouse.specs.lengthMm), 130);
  const maxDim = view === "top"
    ? Math.max(...visible.map(({ mouse }) => mouse.specs.widthMm), 75)
    : Math.max(...visible.map(({ mouse }) => mouse.specs.heightMm), 48);
  const guideReserve = showDimensions && visible.length ? 42 + visible.length * 17 : 44;
  const usableHeight = Math.max(250, H - pad * 2 - guideReserve);
  const scale = Math.min((W - pad * 2) / (normalize ? 132 : maxLength), usableHeight / (normalize ? 82 : maxDim));
  const originX = W / 2;
  const originY = view === "top" ? pad + usableHeight / 2 : pad + usableHeight;

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

  return <div className="shape-canvas">
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${view} view mouse shape comparison`}>
      <g className="shape-grid">
        {Array.from({ length: 13 }, (_, i) => <line key={`v-${i}`} x1={40 + i * 73.3} y1="24" x2={40 + i * 73.3} y2={H - 20}/>)}
        {Array.from({ length: 8 }, (_, i) => <line key={`h-${i}`} x1="40" y1={38 + i * 65} x2={W - 40} y2={38 + i * 65}/>)}
        <line className="axis" x1={originX} y1="24" x2={originX} y2={H - 20}/>
        <line className="axis" x1="40" y1={originY} x2={W - 40} y2={originY}/>
      </g>
      {paths.map(({ layer, mouse, coords }) => <polygon
        key={mouse.id}
        points={coords}
        fill={layer.color}
        fillOpacity={showFills ? Math.max(.025, layer.opacity * .055) : 0}
        stroke={layer.color}
        strokeOpacity={Math.max(.4, layer.opacity)}
        strokeWidth="1.8"
        strokeDasharray={dashFor(layer.lineStyle)}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />)}
      {showLabels && paths.map(({ layer, mouse, box }) => <text
        key={`label-${mouse.id}`}
        className="shape-outline-label"
        x={box.minX + 4}
        y={Math.max(18, box.minY - 8)}
        fill={layer.color}
        fillOpacity={layer.opacity}
      >{mouse.brand} {mouse.model}</text>)}
      {showDimensions && paths.map(({ layer, mouse, box }, index) => {
        const lengthY = H - 20 - index * 17;
        const dimensionX = Math.min(W - 24 - index * 10, box.maxX + 20 + index * 8);
        const secondary = view === "top"
          ? `${fmt(mouse.specs.widthMm)} mm width${mouse.specs.gripWidthMm != null ? ` · ${fmt(mouse.specs.gripWidthMm)} mm grip` : ""}`
          : `${fmt(mouse.specs.heightMm)} mm height`;
        return <g className="shape-dimensions" key={`dimension-${mouse.id}`} opacity={Math.max(.5, layer.opacity)}>
          <line stroke={layer.color} x1={box.minX} y1={lengthY} x2={box.maxX} y2={lengthY}/>
          <line stroke={layer.color} x1={box.minX} y1={lengthY - 5} x2={box.minX} y2={lengthY + 5}/>
          <line stroke={layer.color} x1={box.maxX} y1={lengthY - 5} x2={box.maxX} y2={lengthY + 5}/>
          <text fill={layer.color} x={(box.minX + box.maxX) / 2} y={lengthY - 4} textAnchor="middle">{mouse.model} · {fmt(mouse.specs.lengthMm)} mm</text>
          <line stroke={layer.color} x1={dimensionX} y1={box.minY} x2={dimensionX} y2={box.maxY}/>
          <line stroke={layer.color} x1={dimensionX - 5} y1={box.minY} x2={dimensionX + 5} y2={box.minY}/>
          <line stroke={layer.color} x1={dimensionX - 5} y1={box.maxY} x2={dimensionX + 5} y2={box.maxY}/>
          <text fill={layer.color} transform={`translate(${dimensionX + 9} ${(box.minY + box.maxY) / 2}) rotate(-90)`} textAnchor="middle">{secondary}</text>
        </g>;
      })}
    </svg>
    {!visible.length && <div className="shape-empty">Turn on a mouse layer to compare its shell.</div>}
  </div>;
}

function LayerRow({
  layer,
  index,
  total,
  duplicateColor,
  onChange,
  onRemove,
  onMove,
  onSolo,
}: {
  layer: ShapeLayer;
  index: number;
  total: number;
  duplicateColor: boolean;
  onChange: (next: ShapeLayer) => void;
  onRemove: () => void;
  onMove: (direction: -1 | 1) => void;
  onSolo: () => void;
}) {
  const mouse = layerMouse(layer);
  if (!mouse) return null;
  return <article className={`shape-layer ${layer.visible ? "" : "muted"}`}>
    <button className="shape-eye" onClick={() => onChange({ ...layer, visible: !layer.visible })} aria-label={layer.visible ? "Hide mouse" : "Show mouse"}>{layer.visible ? "●" : "○"}</button>
    <div className="shape-layer-thumb"><ProductMedia productId={mouse.id} fallback={fallbackMouse(mouse)}/></div>
    <div className="shape-layer-main">
      <span>{String(index + 1).padStart(2, "0")} · {mouse.brand}</span>
      <b className="shape-layer-name">{mouse.model}</b>
      <small>{fmt(mouse.specs.lengthMm)} × {fmt(mouse.specs.widthMm)} × {fmt(mouse.specs.heightMm)} mm · {mouse.specs.gripWidthMm != null ? `${fmt(mouse.specs.gripWidthMm)} mm grip` : "grip —"} · {mouse.specs.weightG} g</small>
    </div>
    <div className="shape-row-actions">
      <button onClick={onSolo} title={`Solo ${mouse.model}`} aria-label={`Solo ${mouse.model}`}>S</button>
      <button className="shape-remove" onClick={onRemove} aria-label={`Remove ${mouse.brand} ${mouse.model}`}>×</button>
    </div>
    <div className="shape-layer-controls">
      <div className="shape-swatches" aria-label="Preset outline colors">
        {COLORS.map(color => <button
          type="button"
          key={color}
          className={layer.color.toLowerCase() === color.toLowerCase() ? "active" : ""}
          style={{ "--swatch": color } as React.CSSProperties}
          onClick={() => onChange({ ...layer, color })}
          aria-label={`Use ${color} outline color`}
        />)}
        <label className="shape-color" title="Custom outline color"><input type="color" value={layer.color} onChange={event => onChange({ ...layer, color: event.target.value })}/><span style={{ background: layer.color }}>+</span></label>
      </div>
      <select className="shape-line-style" value={layer.lineStyle} onChange={event => onChange({ ...layer, lineStyle: event.target.value as LineStyle })} aria-label="Line style"><option value="solid">Solid</option><option value="dash">Dash</option><option value="dot">Dot</option></select>
      <label className="shape-opacity"><span>{Math.round(layer.opacity * 100)}%</span><input type="range" min="35" max="100" value={Math.round(layer.opacity * 100)} onChange={event => onChange({ ...layer, opacity: +event.target.value / 100 })}/></label>
      <div className="shape-order">
        <button type="button" onClick={() => onMove(-1)} disabled={index === 0} title="Send backward">Back</button>
        <button type="button" onClick={() => onMove(1)} disabled={index === total - 1} title="Bring forward">Front</button>
      </div>
      {duplicateColor && <span className="shape-color-warning">duplicate color</span>}
    </div>
  </article>;
}

export default function ShapeLabV2({
  similarityMode,
  setSimilarityMode,
  selectedMouseIds,
  onSelectedMouseIdsChange,
}: {
  similarityMode: SimilarityMode;
  setSimilarityMode: (mode: SimilarityMode) => void;
  selectedMouseIds?: string[];
  onSelectedMouseIdsChange?: (ids: string[]) => void;
}) {
  const [sharedInitial] = useState<ShapeShareState | null>(() => readShapeShareState());
  const initialIds = (selectedMouseIds?.length ? selectedMouseIds : mice.slice(0, 3).map(mouse => mouse.id)).slice(0, 5);
  const initial = initialIds.map((id, index): ShapeLayer => ({ id, color: COLORS[index % COLORS.length], visible: true, opacity: .92, lineStyle: index % 3 === 1 ? "dash" : index % 3 === 2 ? "dot" : "solid" }));
  const [layers, setLayers] = useState<ShapeLayer[]>(() => sharedInitial?.layers ?? initial);
  const [view, setView] = useState<ShapeView>(() => sharedInitial?.view ?? "top");
  const [align, setAlign] = useState<AlignMode>(() => sharedInitial?.align ?? "center");
  const [normalize, setNormalize] = useState(() => sharedInitial?.normalize ?? false);
  const [showDimensions, setShowDimensions] = useState(() => sharedInitial?.showDimensions ?? true);
  const [showImages, setShowImages] = useState(() => sharedInitial?.showImages ?? true);
  const [showFills, setShowFills] = useState(() => sharedInitial?.showFills ?? false);
  const [showLabels, setShowLabels] = useState(() => sharedInitial?.showLabels ?? true);
  const [addQuery, setAddQuery] = useState("");
  const [referenceId, setReferenceId] = useState(() => sharedInitial?.referenceId ?? initial[0]?.id ?? mice[0]?.id ?? "");
  const [shareStatus, setShareStatus] = useState("");

  useEffect(() => {
    onSelectedMouseIdsChange?.(layers.map(layer => layer.id));
  }, [layers, onSelectedMouseIdsChange]);

  const reference = mice.find(mouse => mouse.id === referenceId) ?? mice[0];
  const similar = useMemo(() => reference ? findSimilarShapes(reference, mice, similarityMode) : [], [reference, similarityMode]);
  const selectedIds = useMemo(() => new Set(layers.map(layer => layer.id)), [layers]);
  const addCandidates = useMemo(() => {
    const query = addQuery.trim().toLowerCase();
    return mice
      .filter(mouse => !selectedIds.has(mouse.id))
      .filter(mouse => !query || `${mouse.brand} ${mouse.model}`.toLowerCase().includes(query))
      .slice(0, 8);
  }, [addQuery, selectedIds]);

  const updateLayer = (index: number, next: ShapeLayer) => setLayers(current => current.map((layer, i) => i === index ? next : layer));
  const addMouse = (id: string) => setLayers(current => {
    if (current.length >= 5 || current.some(layer => layer.id === id)) return current;
    const used = new Set(current.map(layer => layer.color.toLowerCase()));
    const color = COLORS.find(candidate => !used.has(candidate.toLowerCase())) ?? COLORS[current.length % COLORS.length];
    const index = current.length;
    return [...current, { id, color, visible: true, opacity: .92, lineStyle: index % 3 === 1 ? "dash" : index % 3 === 2 ? "dot" : "solid" }];
  });
  const moveLayer = (index: number, direction: -1 | 1) => setLayers(current => {
    const target = index + direction;
    if (target < 0 || target >= current.length) return current;
    const next = [...current];
    [next[index], next[target]] = [next[target], next[index]];
    return next;
  });
  const soloLayer = (id: string) => setLayers(current => current.map(layer => ({ ...layer, visible: layer.id === id })));
  const resetView = () => {
    setView("top");
    setAlign("center");
    setNormalize(false);
    setShowDimensions(true);
    setShowImages(true);
    setShowFills(false);
    setShowLabels(true);
    setShareStatus("");
  };
  const copyShareLink = async () => {
    const url = new URL(window.location.href);
    const state: ShapeShareState = { layers, view, align, normalize, showDimensions, showImages, showFills, showLabels, similarityMode, referenceId };
    url.searchParams.set("shape", JSON.stringify(state));
    const value = url.toString();
    try {
      await navigator.clipboard.writeText(value);
      setShareStatus("Link copied");
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = value;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
      setShareStatus("Link copied");
    }
  };

  return <main className="v5-main v5-page shape-lab-v2">
    <section className="v5-page-head"><div><div className="v5-kicker">GEOMETRY WORKBENCH</div><h1>Shape Lab</h1><p>Layer mice at real scale, control each outline independently, and keep sourced dimensions visible while comparing shell geometry.</p></div><div className="v5-head-stat"><b>{mice.length}</b><span>catalog shapes</span></div></section>

    <section className="shape-toolbar v5-panel">
      <div className="shape-segments" aria-label="Shape view">{(["top", "side"] as ShapeView[]).map(item => <button key={item} className={view === item ? "active" : ""} onClick={() => setView(item)}>{item === "top" ? "Top view" : "Side view"}</button>)}</div>
      <div className="shape-segments" aria-label="Scale mode"><button className={!normalize ? "active" : ""} onClick={() => setNormalize(false)}>Real scale</button><button className={normalize ? "active" : ""} onClick={() => setNormalize(true)}>Normalize length</button></div>
      <label>Alignment<select value={align} onChange={event => setAlign(event.target.value as AlignMode)}><option value="center">Center</option><option value="sensor">Sensor</option><option value="front">Front</option><option value="rear">Rear</option></select></label>
      <label className="shape-toggle"><input type="checkbox" checked={showDimensions} onChange={event => setShowDimensions(event.target.checked)}/><span>Dimensions</span></label>
      <label className="shape-toggle"><input type="checkbox" checked={showFills} onChange={event => setShowFills(event.target.checked)}/><span>Fills</span></label>
      <label className="shape-toggle"><input type="checkbox" checked={showLabels} onChange={event => setShowLabels(event.target.checked)}/><span>Labels</span></label>
      <label className="shape-toggle"><input type="checkbox" checked={showImages} onChange={event => setShowImages(event.target.checked)}/><span>Images</span></label>
      <button className="shape-share" type="button" onClick={copyShareLink}>{shareStatus || "Copy share link"}</button>
      <button className="shape-reset" type="button" onClick={resetView}>Reset view</button>
    </section>

    <section className="shape-workbench">
      <aside className="shape-layers v5-panel">
        <div className="shape-panel-head"><div><span>COMPARE SET</span><h2>Mouse layers</h2></div><b>{layers.length}/5</b></div>
        <div className="shape-layer-list">{layers.map((layer, index) => <LayerRow
          key={layer.id}
          layer={layer}
          index={index}
          total={layers.length}
          duplicateColor={layers.filter(item => item.color.toLowerCase() === layer.color.toLowerCase()).length > 1}
          onChange={next => updateLayer(index, next)}
          onRemove={() => setLayers(current => current.filter((_, i) => i !== index))}
          onMove={direction => moveLayer(index, direction)}
          onSolo={() => soloLayer(layer.id)}
        />)}</div>
        <div className="shape-add-picker">
          <label htmlFor="shape-add-search">Add mouse</label>
          <input id="shape-add-search" type="search" value={addQuery} onChange={event => setAddQuery(event.target.value)} placeholder="Search brand or model…" disabled={layers.length >= 5}/>
          {layers.length < 5 ? <div className="shape-add-results">
            {addCandidates.map(mouse => <button key={mouse.id} type="button" onClick={() => { addMouse(mouse.id); setAddQuery(""); }}>
              <span><ProductMedia productId={mouse.id} fallback={fallbackMouse(mouse)}/></span>
              <div><small>{mouse.brand}</small><b>{mouse.model}</b><em>{fmt(mouse.specs.lengthMm)} × {fmt(mouse.specs.widthMm)} × {fmt(mouse.specs.heightMm)} mm</em></div>
              <strong>+</strong>
            </button>)}
            {!addCandidates.length && <p>No unselected mice match that search.</p>}
          </div> : <p className="shape-limit">Five layers selected. Remove one to add another.</p>}
        </div>
        <p className="shape-method"><b>Outline quality is explicit.</b> Atlas uses an explicit measured or scanned outline when the record carries one. Otherwise the curve is generated from sourced dimensions and Atlas geometry fields, and is labeled as a parametric estimate rather than a measurement.</p>
      </aside>

      <div className="shape-stage v5-panel">
        <div className="shape-stage-head"><div><span>LIVE OVERLAY</span><h2>{view === "top" ? "Top-shell comparison" : "Side-profile comparison"}</h2></div><div><span>{normalize ? "NORMALIZED LENGTH" : "REAL SCALE"}</span><span>{align.toUpperCase()} ALIGNED</span></div></div>
        <ShapeCanvas layers={layers} view={view} align={align} normalize={normalize} showDimensions={showDimensions} showFills={showFills} showLabels={showLabels}/>
        <div className="shape-spec-strip">{layers.filter(layer => layer.visible).map(layer => {
          const mouse = layerMouse(layer); if (!mouse) return null;
          return <article key={mouse.id} style={{ "--shape-color": layer.color } as React.CSSProperties}>
            {showImages && <div className="shape-spec-image"><ProductMedia productId={mouse.id} fallback={fallbackMouse(mouse)}/></div>}
            <div><span>{mouse.brand}</span><b>{mouse.model}</b><small>{fmt(mouse.specs.lengthMm)} L · {fmt(mouse.specs.widthMm)} W · {fmt(mouse.specs.heightMm)} H · {mouse.specs.gripWidthMm != null ? `${fmt(mouse.specs.gripWidthMm)} grip` : "grip —"} · {mouse.specs.weightG} g</small><em title={mouse.outline?.sourceIds?.join(", ")}>{qualityLabel(mouse, view)}</em></div>
            {showImages && <ProductImageCredit productId={mouse.id}/>}
          </article>;
        })}</div>
      </div>
    </section>

    <section className="shape-similar v5-panel">
      <div className="shape-similar-head"><div><span>SHAPE SEARCH</span><h2>Find close geometry</h2><p>Adding a result keeps the rest of your comparison stack intact.</p></div><label>Reference<select value={referenceId} onChange={event => setReferenceId(event.target.value)}>{mice.map(mouse => <option key={mouse.id} value={mouse.id}>{mouse.brand} {mouse.model}</option>)}</select></label></div>
      <div className="shape-mode-row">{(Object.keys(similarityLabels) as SimilarityMode[]).map(mode => <button key={mode} className={mode === similarityMode ? "active" : ""} onClick={() => setSimilarityMode(mode)}>{similarityLabels[mode]}</button>)}</div>
      <div className="shape-similar-grid">{similar.slice(0, 8).map((result, index) => {
        const alreadyAdded = selectedIds.has(result.mouse.id);
        return <button key={result.mouse.id} disabled={alreadyAdded || layers.length >= 5} onClick={() => addMouse(result.mouse.id)}>
          <span className="shape-rank">{String(index + 1).padStart(2, "0")}</span>
          <div className="shape-match-image"><ProductMedia productId={result.mouse.id} fallback={fallbackMouse(result.mouse)}/></div>
          <div><small>{result.mouse.brand}</small><b>{result.mouse.model}</b><p>{result.reasons.slice(0, 2).join(" · ") || "Close modeled geometry"}</p><em>{result.mouse.specs.lengthMm} × {result.mouse.specs.widthMm} × {result.mouse.specs.heightMm} mm</em></div>
          <strong>{alreadyAdded ? "✓" : "+"}</strong>
        </button>;
      })}</div>
    </section>
  </main>;
}
