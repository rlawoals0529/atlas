import { useMemo, useState, type CSSProperties } from "react";
import { mice } from "../shared/catalog";
import { analyzeMouseCatalog, type CatalogMatrixCell } from "../shared/productInsights";
import "./product-position-map.css";

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const scale = (value: number, min: number, max: number, start: number, end: number) => max === min ? (start + end) / 2 : start + ((value - min) / (max - min)) * (end - start);

function Matrix({ title, rows }: { title: string; rows: CatalogMatrixCell[] }) {
  const xs = [...new Set(rows.map(row => row.x))];
  const ys = [...new Set(rows.map(row => row.y))];
  const max = Math.max(...rows.map(row => row.count), 1);
  return <section className="pl-matrix-block">
    <h4>{title}</h4>
    <div className="pl-matrix" style={{ gridTemplateColumns: `110px repeat(${xs.length}, minmax(58px,1fr))` }}>
      <span/>{xs.map(x => <b key={x}>{x}</b>)}
      {ys.flatMap(y => [<b key={`${y}-label`} className="row-label">{y}</b>, ...xs.map(x => {
        const cell = rows.find(row => row.x === x && row.y === y)!;
        return <span key={`${x}-${y}`} className="cell" title={`${y} / ${x}: ${cell.count} of ${cell.denominator} records`} style={{ "--cell-alpha": String(.07 + .36 * (cell.count / max)) } as CSSProperties}><i>{cell.count}</i><small>{cell.sharePct}%</small></span>;
      })])}
    </div>
  </section>;
}

export default function ProductPositionMap() {
  const insights = useMemo(() => analyzeMouseCatalog(mice), []);
  const [brand, setBrand] = useState("all");
  const [shape, setShape] = useState<"all" | "symmetrical" | "ergonomic">("all");
  const priced = insights.positions.filter(point => point.msrpUsd != null);
  const filtered = priced.filter(point => (brand === "all" || point.brand === brand) && (shape === "all" || point.shape === shape));
  const brands = [...new Set(priced.map(point => point.brand))].sort();
  const weightMin = Math.min(...priced.map(point => point.weightG), 40);
  const weightMax = Math.max(...priced.map(point => point.weightG), 80);
  const priceMax = Math.max(...priced.map(point => point.msrpUsd ?? 0), 200);
  const width = 900;
  const height = 420;
  const left = 62;
  const right = 24;
  const top = 24;
  const bottom = 48;

  return <section className="pl-card pl-position-map-card">
    <div className="pl-card-head"><div><span>FEATURE SPACE</span><h3>Catalog constellation</h3></div><div className="pl-map-controls"><label>Brand<select value={brand} onChange={event => setBrand(event.target.value)}><option value="all">All brands</option>{brands.map(value => <option value={value} key={value}>{value}</option>)}</select></label><label>Shape<select value={shape} onChange={event => setShape(event.target.value as typeof shape)}><option value="all">All shapes</option><option value="symmetrical">Symmetrical</option><option value="ergonomic">Ergonomic</option></select></label></div></div>
    <div className="pl-map-wrap">
      <svg className="pl-position-map" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Scatterplot of current priced Atlas mice by weight and MSRP">
        {[0, 50, 100, 150, 200, 250].filter(value => value <= Math.ceil(priceMax / 50) * 50).map(value => {
          const y = scale(value, 0, Math.ceil(priceMax / 50) * 50, height - bottom, top);
          return <g key={value} className="grid-line"><line x1={left} y1={y} x2={width - right} y2={y}/><text x={left - 10} y={y + 4} textAnchor="end">${value}</text></g>;
        })}
        {[40, 50, 60, 70, 80, 90, 100].filter(value => value >= Math.floor(weightMin / 10) * 10 && value <= Math.ceil(weightMax / 10) * 10).map(value => {
          const x = scale(value, Math.floor(weightMin / 10) * 10, Math.ceil(weightMax / 10) * 10, left, width - right);
          return <g key={value} className="grid-line"><line x1={x} y1={top} x2={x} y2={height - bottom}/><text x={x} y={height - bottom + 24} textAnchor="middle">{value}g</text></g>;
        })}
        {filtered.map(point => {
          const x = scale(point.weightG, Math.floor(weightMin / 10) * 10, Math.ceil(weightMax / 10) * 10, left, width - right);
          const y = scale(point.msrpUsd ?? 0, 0, Math.ceil(priceMax / 50) * 50, height - bottom, top);
          const radius = clamp(5 + Math.log2(Math.max(1, point.pollingHz / 1000)) * 1.6, 5, 11);
          return <g className={`product-dot ${point.shape}`} key={point.productId} tabIndex={0} role="listitem" aria-label={`${point.brand} ${point.model}, ${point.weightG} grams, $${point.msrpUsd} MSRP, ${point.pollingHz} hertz polling`}>
            <circle cx={x} cy={y} r={radius}/><circle className="halo" cx={x} cy={y} r={radius + 5}/><title>{point.brand} {point.model} · {point.weightG} g · ${point.msrpUsd} MSRP · {point.pollingHz / 1000}K Hz · {point.shape}</title>
          </g>;
        })}
        <text className="axis-label" x={(left + width - right) / 2} y={height - 6} textAnchor="middle">WEIGHT (G)</text>
        <text className="axis-label" transform={`translate(14 ${(top + height - bottom) / 2}) rotate(-90)`} textAnchor="middle">MSRP (USD)</text>
      </svg>
    </div>
    <div className="pl-map-legend"><span><i className="symmetrical"/>Symmetrical</span><span><i className="ergonomic"/>Ergonomic</span><span>Dot size reflects advertised polling tier</span><b>{filtered.length} visible / {priced.length} priced current records</b></div>
    <p className="pl-caption">Each dot is a real catalog record. Position is based on sourced weight/MSRP fields; dot size uses the advertised polling ceiling. This is a category map, not a popularity or quality ranking.</p>

    <div className="pl-matrix-grid"><Matrix title="Shape × price" rows={insights.shapePriceMatrix}/><Matrix title="Weight × price" rows={insights.weightPriceMatrix}/></div>

    <div className="pl-intel-strip"><article><span>Weight ↔ MSRP Pearson r</span><b>{insights.weightPriceCorrelation ?? "—"}</b><small>priced current sample</small></article><article><span>Polling ↔ MSRP Pearson r</span><b>{insights.pollingPriceCorrelation ?? "—"}</b><small>association, not causation</small></article><article><span>Brand representation HHI</span><b>{insights.catalogBrandRepresentationHhi}</b><small>Atlas curation only</small></article></div>

    <div className="pl-feature-adoption"><div className="pl-card-head"><div><span>FEATURE ADOPTION</span><h3>Known-field adoption</h3></div></div>{insights.featureAdoption.map(row => <article key={row.feature}><span>{row.feature}</span><b>{row.shareOfKnownPct}%</b><em>{row.enabledCount}/{row.knownCount} known</em><small>{row.unknownCount ? `${row.unknownCount} unspecified` : "complete field coverage"}</small></article>)}</div>
    <p className="pl-caption">Optional fields use a known-value denominator. An unspecified field is treated as unknown, not silently interpreted as “feature absent.”</p>
  </section>;
}
