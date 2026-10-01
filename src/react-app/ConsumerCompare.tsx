import { useId, useMemo, useState } from "react";
import type { CatalogProduct, ProductType } from "../shared/types";
import { ProductImageCredit, ProductMedia } from "./ProductMedia";
import { useModalDialog } from "./useModalDialog";
import "./consumer-compare-dialog.css";
import "./consumer-compare-visuals.css";

type CompareRow = {
  section: string;
  label: string;
  value: string;
  bar?: number;
};

const typeLabel: Record<ProductType, string> = {
  mouse: "mouse",
  mousepad: "mousepad",
  skate: "skate",
  keyboard: "keyboard",
  switch: "switch",
};

const titleCase = (value: string) => value.replaceAll("-", " ").replace(/\b\w/g, char => char.toUpperCase());
const money = (value?: number) => value == null ? "—" : `$${value.toFixed(value % 1 ? 2 : 0)}`;
const polling = (hz: number) => hz >= 1000 ? `${hz / 1000}K Hz` : `${hz} Hz`;
const yesNo = (value?: boolean) => value == null ? "—" : value ? "Yes" : "No";
const clamp = (value: number) => Math.max(0, Math.min(100, value));
const scale = (value: number, min: number, max: number) => clamp(((value - min) / Math.max(1, max - min)) * 100);
const seriesColors = ["var(--blue-11)", "var(--orange-11)", "var(--plum-11)", "var(--jade-11)"];

type MousepadProduct = Extract<CatalogProduct, { type: "mousepad" }>;

function MousepadVisualSummary({ products }: { products: MousepadProduct[] }) {
  const maxWidth = Math.max(...products.map(product => product.specs.widthMm), 1);
  const profileMetrics = [
    ["Initial", (product: MousepadProduct) => product.feel.staticSpeed],
    ["Glide", (product: MousepadProduct) => product.feel.dynamicSpeed],
    ["Stopping", (product: MousepadProduct) => product.feel.stoppingPower],
    ["Texture", (product: MousepadProduct) => product.feel.texture],
    ["Humidity", (product: MousepadProduct) => product.feel.humidityResistance],
    ["X/Y", (product: MousepadProduct) => product.feel.xyConsistency],
  ] as const;

  return <section className="mousepad-compare-visual" aria-labelledby="mousepad-visual-heading">
    <header>
      <div><span>VISUAL READ</span><h3 id="mousepad-visual-heading">Feel profile before the spec table</h3></div>
      <p>Every position below uses Atlas's existing normalized fields. It is a comparison aid, not a quality score.</p>
    </header>

    <div className="mousepad-compare-map-wrap">
      <div className="mousepad-compare-map-card">
        <div className="mousepad-compare-card-head"><b>Glide × stopping map</b><span>normalized /100</span></div>
        <div className="mousepad-compare-map" aria-label="Mousepad dynamic glide versus stopping power">
          <span className="map-axis map-axis-y top">more stopping</span>
          <span className="map-axis map-axis-y bottom">less stopping</span>
          <span className="map-axis map-axis-x left">slower glide</span>
          <span className="map-axis map-axis-x right">faster glide</span>
          <i className="map-midline vertical" aria-hidden="true"/><i className="map-midline horizontal" aria-hidden="true"/>
          {products.map((product, index) => <span
            className="mousepad-map-dot"
            key={product.id}
            style={{ left: `${clamp(product.feel.dynamicSpeed)}%`, bottom: `${clamp(product.feel.stoppingPower)}%`, "--series-color": seriesColors[index] } as React.CSSProperties}
            title={`${product.brand} ${product.model}: ${product.feel.dynamicSpeed}/100 glide, ${product.feel.stoppingPower}/100 stopping`}
          >{String(index + 1).padStart(2, "0")}</span>)}
        </div>
        <div className="mousepad-map-legend">{products.map((product, index) => <span key={product.id} style={{ "--series-color": seriesColors[index] } as React.CSSProperties}><i/>{String(index + 1).padStart(2, "0")} {product.model}</span>)}</div>
      </div>

      <div className="mousepad-footprint-card">
        <div className="mousepad-compare-card-head"><b>Footprint + build</b><span>published dimensions</span></div>
        <div className="mousepad-footprints">{products.map((product, index) => <article key={product.id} style={{ "--series-color": seriesColors[index] } as React.CSSProperties}>
          <div className="mousepad-footprint-stage"><i style={{ width: `${Math.max(48, (product.specs.widthMm / maxWidth) * 100)}%`, aspectRatio: `${product.specs.widthMm} / ${product.specs.heightMm}` }}/></div>
          <div><b>{String(index + 1).padStart(2, "0")} · {product.specs.widthMm} × {product.specs.heightMm}</b><span>{titleCase(product.specs.surfaceClass)} · {titleCase(product.specs.firmness)} · {product.specs.thicknessMm} mm</span></div>
        </article>)}</div>
      </div>
    </div>

    <div className="mousepad-profile-grid" style={{ "--compare-count": products.length } as React.CSSProperties}>
      {products.map((product, index) => <article key={product.id} style={{ "--series-color": seriesColors[index] } as React.CSSProperties}>
        <header><span>{String(index + 1).padStart(2, "0")} · {product.brand}</span><b>{product.model}</b></header>
        <div className="mousepad-profile-chips"><span>{titleCase(product.specs.surfaceClass)}</span><span>{product.specs.stitchedEdges ? "Stitched" : "Unstitched"}</span></div>
        {profileMetrics.map(([label, getter]) => {
          const value = getter(product);
          return <div className="mousepad-profile-metric" key={label}><span>{label}</span><div aria-hidden="true"><i style={{ width: `${clamp(value)}%` }}/></div><b>{value}</b></div>;
        })}
      </article>)}
    </div>
  </section>;
}

function coverage(product: CatalogProduct) {
  const notes = Object.values(product.evidence ?? {});
  const high = notes.filter(note => note.confidence === "high").length;
  const medium = notes.filter(note => note.confidence === "medium").length;
  const manufacturer = product.sources.filter(source => source.kind === "manufacturer").length;
  const independent = product.sources.filter(source => source.kind === "independent").length;
  return Math.min(100, Math.round(
    (product.sources.length ? 28 : 0) +
    Math.min(24, product.sources.length * 8) +
    Math.min(28, high * 9 + medium * 4) +
    Math.min(20, manufacturer * 7 + independent * 8),
  ));
}

function forceText(product: Extract<CatalogProduct, { type: "switch" }>) {
  const force = product.specs.bottomOutForce ?? product.specs.actuationForce ?? product.specs.initialForce;
  return force ? `${force.value} ${force.unit}` : "—";
}

function rowsFor(product: CatalogProduct): CompareRow[] {
  const common: CompareRow[] = [
    { section: "Overview", label: "Price", value: money(product.msrpUsd) },
    { section: "Evidence", label: "Evidence coverage", value: `${coverage(product)}/100`, bar: coverage(product) },
    { section: "Evidence", label: "Sources", value: String(product.sources.length), bar: scale(product.sources.length, 0, 6) },
    { section: "Evidence", label: "High-confidence groups", value: String(Object.values(product.evidence ?? {}).filter(note => note.confidence === "high").length) },
    { section: "Evidence", label: "Independent sources", value: String(product.sources.filter(source => source.kind === "independent").length) },
  ];

  if (product.type === "mouse") return [
    ...common,
    { section: "Core specs", label: "Weight", value: `${product.specs.weightG} g`, bar: scale(product.specs.weightG, 30, 120) },
    { section: "Core specs", label: "Length", value: `${product.specs.lengthMm} mm`, bar: scale(product.specs.lengthMm, 105, 140) },
    { section: "Core specs", label: "Width", value: `${product.specs.widthMm} mm`, bar: scale(product.specs.widthMm, 50, 80) },
    { section: "Core specs", label: "Grip width", value: `${product.specs.gripWidthMm ?? product.specs.widthMm} mm`, bar: scale(product.specs.gripWidthMm ?? product.specs.widthMm, 48, 72) },
    { section: "Core specs", label: "Height", value: `${product.specs.heightMm} mm`, bar: scale(product.specs.heightMm, 30, 50) },
    { section: "Shape", label: "Shape", value: titleCase(product.specs.shape) },
    { section: "Shape", label: "Hump", value: titleCase(product.specs.hump) },
    { section: "Shape", label: "Side curvature", value: titleCase(product.specs.sideCurvature) },
    { section: "Shape", label: "Front flare", value: titleCase(product.specs.frontFlare) },
    { section: "Performance", label: "Polling ceiling", value: polling(product.specs.maxPollingHz), bar: scale(product.specs.maxPollingHz, 125, 8000) },
    { section: "Performance", label: "Sensor", value: product.specs.sensor },
    { section: "Performance", label: "Main switches", value: product.specs.mainSwitch ?? titleCase(product.specs.switchType) },
    { section: "Platform", label: "Connectivity", value: product.specs.connectivity.join(" · ") },
    { section: "Platform", label: "Buttons", value: product.specs.programmableButtons != null ? String(product.specs.programmableButtons) : "—" },
    { section: "Platform", label: "Web configurator", value: yesNo(product.specs.webDriver) },
    { section: "Platform", label: "Battery @ 1K", value: product.specs.battery1kHours ? `${product.specs.battery1kHours} h` : "—" },
  ];

  if (product.type === "mousepad") return [
    ...common,
    { section: "Surface", label: "Surface class", value: titleCase(product.specs.surfaceClass) },
    { section: "Surface", label: "Surface material", value: product.specs.surfaceMaterial },
    { section: "Surface", label: "Base material", value: product.specs.baseMaterial },
    { section: "Surface", label: "Firmness", value: titleCase(product.specs.firmness) },
    { section: "Physical", label: "Size", value: `${product.specs.widthMm} × ${product.specs.heightMm} mm` },
    { section: "Physical", label: "Thickness", value: `${product.specs.thicknessMm} mm`, bar: scale(product.specs.thicknessMm, 1, 6) },
    { section: "Physical", label: "Stitched edges", value: yesNo(product.specs.stitchedEdges) },
    { section: "Feel", label: "Initial speed", value: `${product.feel.staticSpeed}/100`, bar: product.feel.staticSpeed },
    { section: "Feel", label: "Dynamic speed", value: `${product.feel.dynamicSpeed}/100`, bar: product.feel.dynamicSpeed },
    { section: "Feel", label: "Stopping power", value: `${product.feel.stoppingPower}/100`, bar: product.feel.stoppingPower },
    { section: "Feel", label: "Texture", value: `${product.feel.texture}/100`, bar: product.feel.texture },
    { section: "Environment", label: "Humidity resistance", value: `${product.feel.humidityResistance}/100`, bar: product.feel.humidityResistance },
    { section: "Environment", label: "X/Y consistency", value: `${product.feel.xyConsistency}/100`, bar: product.feel.xyConsistency },
    { section: "Environment", label: "Sleeve compatibility", value: `${product.feel.sleeveCompatibility}/100`, bar: product.feel.sleeveCompatibility },
    { section: "Durability", label: "Worn-zone stability", value: product.feel.wornZoneStability != null ? `${product.feel.wornZoneStability}/100` : "—", bar: product.feel.wornZoneStability },
    { section: "Durability", label: "Cleaning recovery", value: product.feel.cleaningRecovery != null ? `${product.feel.cleaningRecovery}/100` : "—", bar: product.feel.cleaningRecovery },
  ];

  if (product.type === "skate") return [
    ...common,
    { section: "Construction", label: "Material", value: titleCase(product.specs.material) },
    { section: "Construction", label: "Format", value: titleCase(product.specs.format) },
    { section: "Construction", label: "Thickness", value: product.specs.thicknessMm ? `${product.specs.thicknessMm} mm` : "—" },
    { section: "Construction", label: "Cushion layer", value: yesNo(product.specs.cushionLayer) },
    { section: "Construction", label: "Anti-collapse", value: yesNo(product.specs.antiCollapse) },
    { section: "Glide", label: "Fresh speed", value: `${product.feel.freshSpeed ?? product.feel.speed}/100`, bar: product.feel.freshSpeed ?? product.feel.speed },
    { section: "Glide", label: "Broken-in speed", value: `${product.feel.brokenInSpeed ?? product.feel.speed}/100`, bar: product.feel.brokenInSpeed ?? product.feel.speed },
    { section: "Glide", label: "Control", value: `${product.feel.control}/100`, bar: product.feel.control },
    { section: "Wear", label: "Durability", value: `${product.feel.durability}/100`, bar: product.feel.durability },
    { section: "Wear", label: "Wear resistance", value: product.feel.wearRate != null ? `${100 - product.feel.wearRate}/100` : "—", bar: product.feel.wearRate != null ? 100 - product.feel.wearRate : undefined },
    { section: "Wear", label: "Dust tolerance", value: product.feel.dustSensitivity != null ? `${100 - product.feel.dustSensitivity}/100` : "—", bar: product.feel.dustSensitivity != null ? 100 - product.feel.dustSensitivity : undefined },
    { section: "Compatibility", label: "Cloth", value: product.compatibility.cloth ? "Compatible" : "Avoid" },
    { section: "Compatibility", label: "Hybrid", value: product.compatibility.hybrid ? "Compatible" : "Avoid" },
    { section: "Compatibility", label: "Glass", value: product.compatibility.glass ? "Compatible" : "Avoid" },
    { section: "Compatibility", label: "Soft base", value: titleCase(product.compatibility.softBase) },
  ];

  if (product.type === "keyboard") return [
    ...common,
    { section: "Layout", label: "Form factor", value: product.specs.formFactor.toUpperCase() },
    { section: "Layout", label: "Layout", value: product.specs.layout },
    { section: "Switching", label: "Switch technology", value: titleCase(product.specs.switchTechnology) },
    { section: "Switching", label: "Stock switch", value: product.specs.stockSwitch },
    { section: "Input", label: "Polling ceiling", value: polling(product.specs.maxPollingHz), bar: scale(product.specs.maxPollingHz, 125, 8000) },
    { section: "Input", label: "Minimum actuation", value: product.specs.minActuationMm != null ? `${product.specs.minActuationMm} mm` : "—", bar: product.specs.minActuationMm != null ? scale(product.specs.minActuationMm, 0.05, 4) : undefined },
    { section: "Input", label: "Maximum actuation", value: product.specs.maxActuationMm != null ? `${product.specs.maxActuationMm} mm` : "—", bar: product.specs.maxActuationMm != null ? scale(product.specs.maxActuationMm, 0.05, 4) : undefined },
    { section: "Input", label: "Actuation step", value: product.specs.actuationStepMm != null ? `${product.specs.actuationStepMm} mm` : "—" },
    { section: "Input", label: "Rapid Trigger", value: yesNo(product.specs.rapidTrigger) },
    { section: "Input", label: "SOCD", value: yesNo(product.specs.socd) },
    { section: "Input", label: "Analog input", value: yesNo(product.specs.analogInput) },
    { section: "Build", label: "Hot-swappable", value: yesNo(product.specs.hotSwappable) },
    { section: "Build", label: "Case", value: product.specs.caseMaterial },
    { section: "Build", label: "Plate", value: product.specs.plateMaterial ?? "—" },
    { section: "Build", label: "Keycaps", value: product.specs.keycapMaterial ?? "—" },
    { section: "Build", label: "Mount", value: product.specs.mount ?? "—" },
    { section: "Platform", label: "Connectivity", value: product.specs.connectivity.join(" · ") },
    { section: "Platform", label: "Web configurator", value: yesNo(product.specs.webConfigurator) },
    { section: "Platform", label: "Software", value: product.specs.software ?? "—" },
  ];

  return [
    ...common,
    { section: "Switch", label: "Technology", value: titleCase(product.specs.technology) },
    { section: "Switch", label: "Feel", value: titleCase(product.specs.feel) },
    { section: "Force", label: "Initial force", value: product.specs.initialForce ? `${product.specs.initialForce.value} ${product.specs.initialForce.unit}` : "—" },
    { section: "Force", label: "Actuation force", value: product.specs.actuationForce ? `${product.specs.actuationForce.value} ${product.specs.actuationForce.unit}` : "—" },
    { section: "Force", label: "Bottom-out force", value: product.specs.bottomOutForce ? `${product.specs.bottomOutForce.value} ${product.specs.bottomOutForce.unit}` : forceText(product) },
    { section: "Travel", label: "Pre-travel", value: product.specs.preTravelMm != null ? `${product.specs.preTravelMm} mm` : "—", bar: product.specs.preTravelMm != null ? scale(product.specs.preTravelMm, 0, 4) : undefined },
    { section: "Travel", label: "Total travel", value: `${product.specs.totalTravelMm} mm`, bar: scale(product.specs.totalTravelMm, 2.5, 4.2) },
    { section: "Build", label: "Factory lubed", value: yesNo(product.specs.factoryLubed) },
    { section: "Build", label: "Rated life", value: product.specs.ratedKeystrokesM ? `${product.specs.ratedKeystrokesM}M keystrokes` : "—" },
    { section: "Magnetic", label: "Initial flux", value: product.specs.magneticFluxGs ? `${product.specs.magneticFluxGs.initial} Gs` : "—" },
    { section: "Magnetic", label: "Bottom-out flux", value: product.specs.magneticFluxGs ? `${product.specs.magneticFluxGs.bottomOut} Gs` : "—" },
    { section: "Compatibility", label: "Compatibility notes", value: product.specs.compatibility?.join(" · ") ?? "Verify against the target board" },
  ];
}

export default function ConsumerCompare({ products, onClose, onRemove }: { products: CatalogProduct[]; onClose: () => void; onRemove: (id: string) => void }) {
  const [differencesOnly, setDifferencesOnly] = useState(false);
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useModalDialog<HTMLElement>(onClose);
  const type = products[0]?.type;
  const rowSets = useMemo(() => products.map(rowsFor), [products]);
  const rows = useMemo(() => {
    if (!rowSets.length) return [] as CompareRow[];
    return rowSets[0].filter((row, index) => {
      if (!differencesOnly) return true;
      const values = rowSets.map(set => set[index]?.value ?? "—");
      return new Set(values).size > 1;
    });
  }, [rowSets, differencesOnly]);
  const allRows = rowSets[0] ?? [];
  const rowDiffers = (row: CompareRow) => {
    const originalIndex = allRows.findIndex(candidate => candidate.section === row.section && candidate.label === row.label);
    const values = rowSets.map(set => set[originalIndex]?.value ?? "—");
    return new Set(values).size > 1;
  };
  const differenceCount = allRows.filter(rowDiffers).length;
  const sections = [...new Set(rows.map(row => row.section))];
  const specialistHref = type === "mouse" || type === "mousepad" ? "#pointing" : type === "keyboard" || type === "switch" ? "#keyboard-lab" : "#product-lab";
  const specialistLabel = type === "mouse" ? "Open Shape Lab" : type === "mousepad" ? "Pair in Setup Finder" : type === "keyboard" || type === "switch" ? "Open Keyboard Lab" : "Open research tools";
  const mousepadProducts = type === "mousepad" ? products.filter((product): product is MousepadProduct => product.type === "mousepad") : [];

  if (!type || products.length < 2) return null;

  return <div className="consumer-compare-shell" data-product-type={type}>
    <button type="button" className="consumer-compare-backdrop" tabIndex={-1} aria-hidden="true" onClick={onClose}/>
    <section ref={dialogRef} className="consumer-compare-panel" role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={descriptionId} tabIndex={-1}>
      <header className="consumer-compare-header">
        <div><span>RICH COMPARISON / {typeLabel[type].toUpperCase()}</span><h2 id={titleId}>{type === "mousepad" ? "See how the surfaces separate." : "Compare the parts that actually differ."}</h2><p id={descriptionId}>{type === "mousepad" ? "Start with glide, stopping, footprint and build, then use the full table for the sourced details. Normalized feel fields stay separate from published specifications." : "Atlas keeps raw specifications, modeled feel fields and evidence strength visible side-by-side. Bars show position on a fixed scale, not an overall quality score."}</p></div>
        <button type="button" className="consumer-compare-close" data-dialog-initial-focus onClick={onClose} aria-label="Close comparison">×</button>
      </header>

      <div className="consumer-compare-controls">
        <div className="consumer-compare-filter-group">
          <label><input type="checkbox" checked={differencesOnly} onChange={event => setDifferencesOnly(event.target.checked)}/><span>Show differences only</span></label>
          <span className="consumer-compare-diff-count">{differenceCount} differing {differenceCount === 1 ? "field" : "fields"}</span>
        </div>
        <a href={specialistHref}>{specialistLabel} →</a>
      </div>

      <div className="consumer-compare-products" style={{ "--compare-count": products.length } as React.CSSProperties}>
        <div className="consumer-compare-axis"><span>PRODUCT</span></div>
        {products.map((product, index) => <article key={product.id}>
          <button onClick={() => onRemove(product.id)} aria-label={`Remove ${product.brand} ${product.model}`}>×</button>
          <div className="consumer-compare-media"><ProductMedia productId={product.id}/></div>
          <div className="consumer-compare-product-meta"><span>{String(index + 1).padStart(2, "0")} · {product.brand}</span><small>{money(product.msrpUsd)} · {coverage(product)}/100 evidence</small></div>
          <h3>{product.model}</h3>
          <ProductImageCredit productId={product.id}/>
        </article>)}
      </div>

      {type === "mousepad" && mousepadProducts.length >= 2 && <MousepadVisualSummary products={mousepadProducts}/>}
      <div className="consumer-compare-table" style={{ "--compare-count": products.length } as React.CSSProperties}>
        {sections.map(section => {
          const sectionRows = rows.filter(row => row.section === section);
          return <div className="consumer-compare-section" key={section}>
          <div className="consumer-compare-section-title"><span>{section}</span><small>{sectionRows.length}</small></div>
          {sectionRows.map(row => {
            const different = rowDiffers(row);
            return <div className={`consumer-compare-row ${different ? "is-different" : ""}`} key={`${section}-${row.label}`}>
            <div className="consumer-compare-axis"><span>{row.label}</span>{different && <i aria-label="Values differ">Δ</i>}</div>
            {rowSets.map((set, productIndex) => {
              const originalIndex = rowSets[0].findIndex(candidate => candidate.section === row.section && candidate.label === row.label);
              const cell = set[originalIndex] ?? row;
              return <div className="consumer-compare-cell" key={products[productIndex].id}>
                <b>{cell.value}</b>
                {cell.bar != null && <div className="consumer-compare-bar" aria-hidden="true"><i style={{ width: `${clamp(cell.bar)}%` }}/></div>}
              </div>;
            })}
          </div>;
          })}
        </div>;
        })}
      </div>

      <footer className="consumer-compare-note"><b>No automatic winner.</b><span>The meaning of a difference depends on your hand, game, surface, board compatibility and preferences. Atlas exposes the delta instead of turning it into a universal verdict.</span></footer>
    </section>
  </div>;
}
