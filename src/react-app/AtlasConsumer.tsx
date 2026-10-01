import { Suspense, lazy, useEffect, useId, useMemo, useState, type ReactNode } from "react";
import { allCatalog, keyboards, mice, mousepads, skates } from "../shared/catalog";
import type { CatalogProduct, ProductType } from "../shared/types";
import { parseSharedCompareIds, serializeSharedCompareIds } from "../shared/shareState";
import { ProductImageCredit, ProductMedia } from "./ProductMedia";
import { useModalDialog } from "./useModalDialog";

const loadConsumerCompare = () => import("./ConsumerCompare");
const ConsumerCompare = lazy(loadConsumerCompare);

const categoryMeta: Record<ProductType, { label: string; singular: string; description: string; token: string }> = {
  mouse: { label: "Mice", singular: "Mouse", description: "Shape, weight, polling and hand fit", token: "M" },
  mousepad: { label: "Mousepads", singular: "Mousepad", description: "Surface speed, control and consistency", token: "PAD" },
  skate: { label: "Skates", singular: "Skate", description: "Material, glide and surface compatibility", token: "SK" },
  keyboard: { label: "Keyboards", singular: "Keyboard", description: "Rapid trigger, actuation and platform design", token: "KEY" },
  switch: { label: "Switches", singular: "Switch", description: "Force, travel, feel and sensing technology", token: "SW" },
};

const mousepadSurfaces = ["cloth", "hybrid", "glass", "resin", "plastic"] as const;
const switchTechnologies = ["hall-effect", "tmr", "mechanical", "optical-analog"] as const;

const money = (value?: number) => value == null ? "Price not listed" : `$${value.toFixed(value % 1 ? 2 : 0)}`;
const pollingLabel = (hz: number) => hz >= 1000 ? `${hz / 1000}K Hz` : `${hz} Hz`;
const titleCase = (value: string) => value.replaceAll("-", " ").replace(/\b\w/g, char => char.toUpperCase());

function sourceCheckWindow(product: CatalogProduct) {
  const dates = product.sources.map(source => source.checkedAt).filter(Boolean).sort();
  return {
    oldest: dates[0] ?? "Not recorded",
    latest: dates.at(-1) ?? "Not recorded",
  };
}

function evidenceCoverage(product: CatalogProduct) {
  const notes = Object.values(product.evidence ?? {});
  const high = notes.filter(note => note.confidence === "high").length;
  const medium = notes.filter(note => note.confidence === "medium").length;
  const manufacturer = product.sources.filter(source => source.kind === "manufacturer").length;
  const independent = product.sources.filter(source => source.kind === "independent").length;
  const score = Math.min(100, Math.round(
    (product.sources.length ? 28 : 0) +
    Math.min(24, product.sources.length * 8) +
    Math.min(28, high * 9 + medium * 4) +
    Math.min(20, manufacturer * 7 + independent * 8),
  ));
  return { score, label: score >= 82 ? "strong" : score >= 62 ? "good" : score >= 42 ? "developing" : "early" };
}

function compareChipMeta(product: CatalogProduct) {
  switch (product.type) {
    case "mouse": return `${product.specs.weightG} g · ${titleCase(product.specs.shape)}`;
    case "mousepad": return `${titleCase(product.specs.surfaceClass)} · ${product.feel.dynamicSpeed} glide · ${product.feel.stoppingPower} stop`;
    case "skate": return `${titleCase(product.specs.material)} · ${product.feel.brokenInSpeed ?? product.feel.speed} glide`;
    case "keyboard": return `${product.specs.formFactor.toUpperCase()} · ${pollingLabel(product.specs.maxPollingHz)}`;
    case "switch": return `${titleCase(product.specs.feel)} · ${titleCase(product.specs.technology)}`;
  }
}

function productMetrics(product: CatalogProduct): [string, string][] {
  switch (product.type) {
    case "mouse": return [["Weight", `${product.specs.weightG} g`], ["Polling", pollingLabel(product.specs.maxPollingHz)], ["Grip", `${product.specs.gripWidthMm ?? product.specs.widthMm} mm`], ["Shape", titleCase(product.specs.shape)]];
    case "mousepad": return [["Surface", titleCase(product.specs.surfaceClass)], ["Glide", `${product.feel.dynamicSpeed}/100`], ["Stopping", `${product.feel.stoppingPower}/100`], ["Size", `${product.specs.widthMm} × ${product.specs.heightMm}`]];
    case "skate": return [["Material", titleCase(product.specs.material)], ["Format", titleCase(product.specs.format)], ["Glide", `${product.feel.brokenInSpeed ?? product.feel.speed}/100`], ["Control", `${product.feel.control}/100`]];
    case "keyboard": return [["Format", product.specs.formFactor.toUpperCase()], ["Polling", pollingLabel(product.specs.maxPollingHz)], ["Actuation", product.specs.minActuationMm != null ? `${product.specs.minActuationMm} mm min` : product.specs.actuationStepMm != null ? `${product.specs.actuationStepMm} mm precision` : "Adjustable"], ["Rapid trigger", product.specs.rapidTrigger ? "Yes" : "No"]];
    case "switch": {
      const force = product.specs.bottomOutForce ?? product.specs.actuationForce ?? product.specs.initialForce;
      return [["Feel", titleCase(product.specs.feel)], ["Technology", titleCase(product.specs.technology)], ["Travel", `${product.specs.totalTravelMm} mm`], ["Force", force ? `${force.value} ${force.unit}` : "Not listed"]];
    }
  }
}

function detailRows(product: CatalogProduct): [string, ReactNode][] {
  switch (product.type) {
    case "mouse": return [
      ["Dimensions", `${product.specs.lengthMm} × ${product.specs.widthMm} × ${product.specs.heightMm} mm`],
      ["Grip width", `${product.specs.gripWidthMm ?? "—"} mm`],
      ["Weight", `${product.specs.weightG} g`],
      ["Shape", `${titleCase(product.specs.shape)} · ${titleCase(product.specs.hump)} hump`],
      ["Sensor", product.specs.sensor],
      ["Polling ceiling", pollingLabel(product.specs.maxPollingHz)],
      ["Main switches", product.specs.mainSwitch ?? titleCase(product.specs.switchType)],
      ["Connectivity", product.specs.connectivity.join(" · ")],
    ];
    case "mousepad": return [
      ["Surface", `${titleCase(product.specs.surfaceClass)} · ${product.specs.surfaceMaterial}`],
      ["Base", product.specs.baseMaterial],
      ["Firmness", titleCase(product.specs.firmness)],
      ["Size", `${product.specs.widthMm} × ${product.specs.heightMm} mm`],
      ["Thickness", `${product.specs.thicknessMm} mm`],
      ["Dynamic glide", `${product.feel.dynamicSpeed}/100`],
      ["Stopping power", `${product.feel.stoppingPower}/100`],
      ["Humidity resistance", `${product.feel.humidityResistance}/100`],
    ];
    case "skate": return [
      ["Material", titleCase(product.specs.material)],
      ["Format", titleCase(product.specs.format)],
      ["Thickness", product.specs.thicknessMm ? `${product.specs.thicknessMm} mm` : "—"],
      ["Fresh glide", `${product.feel.freshSpeed ?? product.feel.speed}/100`],
      ["Broken-in glide", `${product.feel.brokenInSpeed ?? product.feel.speed}/100`],
      ["Control", `${product.feel.control}/100`],
      ["Glass compatibility", product.compatibility.glass ? "Compatible" : "Avoid"],
      ["Soft-base behavior", titleCase(product.compatibility.softBase)],
    ];
    case "keyboard": return [
      ["Form factor", product.specs.formFactor.toUpperCase()],
      ["Layout", product.specs.layout],
      ["Switch technology", titleCase(product.specs.switchTechnology)],
      ["Stock switch", product.specs.stockSwitch],
      ["Polling ceiling", pollingLabel(product.specs.maxPollingHz)],
      ["Actuation range", product.specs.minActuationMm != null ? `${product.specs.minActuationMm}–${product.specs.maxActuationMm ?? "?"} mm` : product.specs.actuationStepMm != null ? `${product.specs.actuationStepMm} mm published tuning precision` : "Adjustable / not fully specified"],
      ["Rapid Trigger", product.specs.rapidTrigger ? "Yes" : "No"],
      ["Hot-swap", product.specs.hotSwappable ? "Yes" : "No"],
      ["Connectivity", product.specs.connectivity.join(" · ")],
      ["Configuration", product.specs.webConfigurator ? "Web configurator" : product.specs.software ?? "Not listed"],
    ];
    case "switch": {
      const force = product.specs.bottomOutForce ?? product.specs.actuationForce ?? product.specs.initialForce;
      return [
        ["Technology", titleCase(product.specs.technology)],
        ["Feel", titleCase(product.specs.feel)],
        ["Force", force ? `${force.value} ${force.unit}` : "—"],
        ["Pre-travel", product.specs.preTravelMm != null ? `${product.specs.preTravelMm} mm` : "—"],
        ["Total travel", `${product.specs.totalTravelMm} mm`],
        ["Factory lubed", product.specs.factoryLubed == null ? "—" : product.specs.factoryLubed ? "Yes" : "No"],
        ["Rated life", product.specs.ratedKeystrokesM ? `${product.specs.ratedKeystrokesM}M keystrokes` : "—"],
        ["Compatibility", product.specs.compatibility?.join(" · ") ?? "Verify against the target board"],
      ];
    }
  }
}

function ProductGlyph({ type }: { type: ProductType }) {
  return <div className={`consumer-glyph ${type}`} aria-hidden="true"><span>{categoryMeta[type].token}</span><i/><i/></div>;
}

function ProductVisual({ product }: { product: CatalogProduct }) {
  return <ProductMedia productId={product.id} className={`consumer-real-image ${product.type}`} fallback={<ProductGlyph type={product.type}/>}/>;
}

function forceToCN(point?: { value: number; unit: "gf" | "cN" }) {
  if (!point) return Number.POSITIVE_INFINITY;
  return point.unit === "gf" ? point.value * 0.980665 : point.value;
}

function CoveragePill({ product }: { product: CatalogProduct }) {
  const coverage = evidenceCoverage(product);
  return <span className={`consumer-coverage ${coverage.label}`} title="Atlas evidence coverage heuristic"><b>{coverage.score}</b> coverage</span>;
}

function ProductCard({ product, onOpen, compared }: { product: CatalogProduct; onOpen: (product: CatalogProduct) => void; compared: boolean }) {
  return <button type="button" className={`consumer-product ${compared ? "compare-selected" : ""}`} data-product-type={product.type} aria-haspopup="dialog" onClick={() => onOpen(product)}>
    <div className="consumer-product-visual"><ProductVisual product={product}/></div>
    <div className="consumer-product-head"><span>{product.brand}</span><small>{categoryMeta[product.type].singular}</small></div>
    <h3>{product.model}</h3>
    <p>{product.summary}</p>
    <div className="consumer-metrics">{productMetrics(product).map(([label, value]) => <div key={label}><span>{label}</span><b>{value}</b></div>)}</div>
    <footer><span className="consumer-card-price">{money(product.msrpUsd)}</span><CoveragePill product={product}/><em>Details →</em></footer>
  </button>;
}

function ProductDrawer({ product, onClose, onCompare, compared, onSave, saved }: { product: CatalogProduct; onClose: () => void; onCompare: (product: CatalogProduct) => void; compared: boolean; onSave: (product: CatalogProduct) => void; saved: boolean }) {
  const coverage = evidenceCoverage(product);
  const sourceChecks = sourceCheckWindow(product);
  const sourcesById = new Map(product.sources.map(source => [source.id, source]));
  const [linkStatus, setLinkStatus] = useState("");
  const copyProductLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setLinkStatus("Link copied");
    } catch {
      setLinkStatus("Could not copy link");
    }
    window.setTimeout(() => setLinkStatus(""), 1800);
  };
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useModalDialog<HTMLElement>(onClose);
  return <div className="consumer-drawer-shell">
    <button type="button" className="consumer-drawer-backdrop" tabIndex={-1} aria-hidden="true" onClick={onClose}/>
    <aside ref={dialogRef} className="consumer-drawer" role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={descriptionId} tabIndex={-1}>
      <header><div><span>{categoryMeta[product.type].singular} / {product.brand}</span><h2 id={titleId}>{product.model}</h2></div><button type="button" data-dialog-initial-focus onClick={onClose} aria-label={`Close ${product.brand} ${product.model} details`}>×</button></header>
      <div className="consumer-drawer-hero"><div className="consumer-drawer-media"><ProductVisual product={product}/><ProductImageCredit productId={product.id}/></div><div><small>EVIDENCE COVERAGE</small><b>{coverage.score}</b><span>{coverage.label}</span><div className="consumer-drawer-source-checks"><span>Latest source check <strong>{sourceChecks.latest}</strong></span><span>Oldest source check <strong>{sourceChecks.oldest}</strong></span></div></div></div>
      <p className="consumer-drawer-summary" id={descriptionId}>{product.summary}</p>
      <div className="consumer-tag-row"><span>{titleCase(product.status)}</span><span>{money(product.msrpUsd)}</span>{product.tags?.slice(0, 4).map(tag => <span key={tag}>{titleCase(tag)}</span>)}<button type="button" className="consumer-drawer-save" aria-pressed={saved} onClick={() => onSave(product)}>{saved ? "Saved" : "Save"}</button><button type="button" className="consumer-drawer-compare" aria-pressed={compared} onClick={() => onCompare(product)}>{compared ? "Remove from compare" : "Add to compare"}</button><button type="button" className="consumer-drawer-link" onClick={copyProductLink}>Copy link</button><span className="consumer-drawer-link-status" role="status" aria-live="polite">{linkStatus}</span></div>
      <section><div className="consumer-section-title"><span>SPECIFICATIONS</span><h3>Product record</h3></div><div className="consumer-detail-grid">{detailRows(product).map(([label, value]) => <div key={label}><span>{label}</span><b>{value}</b></div>)}</div></section>
      <section><div className="consumer-section-title"><span>EVIDENCE</span><h3>What supports this record</h3></div><div className="consumer-evidence-list">{Object.entries(product.evidence ?? {}).map(([field, note]) => <article key={field}><div><b>{titleCase(field)}</b><span className={note.confidence}>{note.confidence}</span></div>{note.note && <p>{note.note}</p>}<footer>{note.sourceIds.map(sourceId => { const source = sourcesById.get(sourceId); return source ? <a key={source.id} href={source.url} target="_blank" rel="noreferrer"><span>{source.kind}</span>{source.label}<i>↗</i></a> : null; })}</footer></article>)}</div></section>
      <section><div className="consumer-section-title"><span>SOURCES</span><h3>Provenance ledger</h3></div><div className="consumer-source-list">{product.sources.map(source => <a key={source.id} href={source.url} target="_blank" rel="noreferrer"><span>{source.kind}</span><div><b>{source.label}</b><small>checked {source.checkedAt}</small></div><i>↗</i></a>)}</div></section>
    </aside>
  </div>;
}

function CompareLoadingFallback({ onClose }: { onClose: () => void }) {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useModalDialog<HTMLDivElement>(onClose);

  return <div className="consumer-compare-shell consumer-compare-loading">
    <button type="button" className="consumer-compare-backdrop" tabIndex={-1} aria-hidden="true" onClick={onClose}/>
    <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={descriptionId} tabIndex={-1}>
      <button type="button" className="consumer-compare-loading-close" data-dialog-initial-focus onClick={onClose} aria-label="Close comparison">×</button>
      <i aria-hidden="true"/>
      <b id={titleId}>Opening comparison</b>
      <span id={descriptionId} role="status" aria-live="polite">Preparing the richer side-by-side view…</span>
    </div>
  </div>;
}

const SAVED_PRODUCTS_KEY = "atlas.saved-products.v1";

const readSavedProductIds = () => {
  if (typeof window === "undefined") return [] as string[];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(SAVED_PRODUCTS_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === "string") : [];
  } catch {
    return [];
  }
};

const readSharedProductId = () => {
  if (typeof window === "undefined") return "";
  return (new URLSearchParams(window.location.search).get("product") ?? "").trim().slice(0, 128);
};

const readSharedShortlistIds = () => {
  if (typeof window === "undefined") return [] as string[];
  const value = new URLSearchParams(window.location.search).get("shortlist");
  return value ? value.split(",").map(item => item.trim()).filter(Boolean).slice(0, 24) : [];
};

const readSharedCompareIds = () => {
  if (typeof window === "undefined") return [] as string[];
  return parseSharedCompareIds(new URLSearchParams(window.location.search).get("compare"));
};



const readSharedSwitchParam = (key: string) => typeof window === "undefined" ? null : new URLSearchParams(window.location.search).get(key);
const sharedSwitchSort = () => {
  const value = readSharedSwitchParam("sort");
  return value && ["name", "coverage", "price", "actuation", "travel"].includes(value) ? value as "name" | "coverage" | "price" | "actuation" | "travel" : "coverage";
};

type AtlasConsumerProps = {
  focusCategory?: Extract<ProductType, "mousepad" | "switch">;
  afterCatalog?: ReactNode;
  additionalProducts?: CatalogProduct[];
};

export default function AtlasConsumer({ focusCategory, afterCatalog, additionalProducts = [] }: AtlasConsumerProps = {}) {
  const [category, setCategory] = useState<"all" | ProductType>(focusCategory ?? "mouse");
  const [query, setQuery] = useState(() => focusCategory === "switch" ? readSharedSwitchParam("q") ?? "" : "");
  const [brand, setBrand] = useState(() => focusCategory === "switch" ? readSharedSwitchParam("brand") ?? "all" : "all");
  const [currentOnly, setCurrentOnly] = useState(() => focusCategory === "switch" ? readSharedSwitchParam("current") !== "all" : true);
  const [sort, setSort] = useState<"name" | "coverage" | "price" | "glide" | "stopping" | "actuation" | "travel">(() => focusCategory === "switch" ? sharedSwitchSort() : "coverage");
  const [selected, setSelected] = useState<CatalogProduct | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [compareShareStatus, setCompareShareStatus] = useState("");
  const filtersId = useId();
  const compareTrayId = useId();

  const [minPolling, setMinPolling] = useState(0);
  const [maxWeight, setMaxWeight] = useState(140);
  const [shape, setShape] = useState("all");
  const [surface, setSurface] = useState("all");
  const [padFirmness, setPadFirmness] = useState("all");
  const [stitchedOnly, setStitchedOnly] = useState(false);
  const [skateMaterial, setSkateMaterial] = useState("all");
  const [keyboardTech, setKeyboardTech] = useState("all");
  const [formFactor, setFormFactor] = useState("all");
  const [rapidTriggerOnly, setRapidTriggerOnly] = useState(false);
  const [switchTech, setSwitchTech] = useState(() => focusCategory === "switch" ? readSharedSwitchParam("tech") ?? "all" : "all");
  const [switchFeel, setSwitchFeel] = useState(() => focusCategory === "switch" ? readSharedSwitchParam("feel") ?? "all" : "all");
  const [compactSwitchView, setCompactSwitchView] = useState(() => focusCategory === "switch" && readSharedSwitchParam("density") === "compact");
  const [shareStatus, setShareStatus] = useState("");
  const [savedIds, setSavedIds] = useState<string[]>(readSavedProductIds);
  const [sharedShortlistIds] = useState<string[]>(readSharedShortlistIds);
  const [savedOnly, setSavedOnly] = useState(() => readSharedShortlistIds().length > 0);
  const [savedShareStatus, setSavedShareStatus] = useState("");

  const catalogProducts = useMemo(() => additionalProducts.length ? [...allCatalog, ...additionalProducts] : allCatalog, [additionalProducts]);
  useEffect(() => {
    setSavedIds(current => {
      const valid = current.filter(id => catalogProducts.some(product => product.id === id));
      return valid.length === current.length ? current : valid;
    });
  }, [catalogProducts]);

  useEffect(() => {
    const productId = readSharedProductId();
    if (!productId) return;
    const product = catalogProducts.find(item => item.id === productId);
    if (product) setSelected(product);
  }, [catalogProducts]);

  useEffect(() => {
    const requested = readSharedCompareIds();
    if (requested.length < 2) return;
    const products = requested
      .map(id => catalogProducts.find(product => product.id === id))
      .filter((product): product is CatalogProduct => Boolean(product));
    const firstType = products[0]?.type;
    const sameType = firstType ? products.filter(product => product.type === firstType).slice(0, 4) : [];
    if (sameType.length < 2) return;
    setCompareIds(sameType.map(product => product.id));
    void loadConsumerCompare();
    setCompareOpen(true);
  }, [catalogProducts]);



  useEffect(() => {
    try {
      window.localStorage.setItem(SAVED_PRODUCTS_KEY, JSON.stringify(savedIds));
    } catch {
      // Browsing still works if storage is unavailable.
    }
  }, [savedIds]);

  const isSaved = (id: string) => savedIds.includes(id);
  const validSharedShortlistIds = useMemo(() => sharedShortlistIds.filter(id => catalogProducts.some(product => product.id === id)), [catalogProducts, sharedShortlistIds]);
  const shortlistFilterIds = validSharedShortlistIds.length ? validSharedShortlistIds : savedIds;
  const toggleSaved = (product: CatalogProduct) => setSavedIds(current => current.includes(product.id) ? current.filter(id => id !== product.id) : [...current, product.id]);
  const switchProducts = useMemo(() => catalogProducts.filter((product): product is Extract<CatalogProduct, { type: "switch" }> => product.type === "switch"), [catalogProducts]);
  const counts: Record<ProductType, number> = {
    mouse: mice.length,
    mousepad: mousepads.length,
    skate: skates.length,
    keyboard: keyboards.length,
    switch: switchProducts.length,
  };

  const compareProducts = compareIds.map(id => catalogProducts.find(product => product.id === id)).filter((product): product is CatalogProduct => Boolean(product));
  const compared = (id: string) => compareIds.includes(id);
  const toggleCompare = (product: CatalogProduct) => setCompareIds(current => {
    if (current.includes(product.id)) return current.filter(id => id !== product.id);
    const first = current.length ? catalogProducts.find(item => item.id === current[0]) : null;
    if (first && first.type !== product.type) return [product.id];
    if (current.length >= 4) return current;
    const next = [...current, product.id];
    if (next.length >= 2) void loadConsumerCompare();
    return next;
  });
  const removeCompare = (id: string) => {
    setCompareIds(current => {
      const next = current.filter(item => item !== id);
      if (next.length < 2) setCompareOpen(false);
      return next;
    });
  };

  const brands = useMemo(() => [...new Set(catalogProducts.filter(product => category === "all" || product.type === category).map(product => product.brand))].sort(), [catalogProducts, category]);
  const mousepadSurfaceCounts = useMemo(() => new Map(mousepadSurfaces.map(item => [item, mousepads.filter(product => product.specs.surfaceClass === item).length])), []);
  const switchTechnologyCounts = useMemo(() => new Map(switchTechnologies.map(item => [item, switchProducts.filter(product => product.specs.technology === item).length])), [switchProducts]);

  const filtered = useMemo(() => catalogProducts.filter(product => {
    if (category !== "all" && product.type !== category) return false;
    if (currentOnly && product.status !== "current") return false;
    if (brand !== "all" && product.brand !== brand) return false;
    if (savedOnly && !shortlistFilterIds.includes(product.id)) return false;
    if (query) {
      const text = [product.brand, product.model, product.summary, product.type, ...(product.tags ?? []), JSON.stringify(product.specs)].join(" ").toLowerCase();
      if (!text.includes(query.toLowerCase())) return false;
    }
    if (product.type === "mouse") {
      if (shape !== "all" && product.specs.shape !== shape) return false;
      if (product.specs.maxPollingHz < minPolling) return false;
      if (product.specs.weightG > maxWeight) return false;
    }
    if (product.type === "mousepad") {
      if (surface !== "all" && product.specs.surfaceClass !== surface) return false;
      if (padFirmness !== "all" && product.specs.firmness !== padFirmness) return false;
      if (stitchedOnly && !product.specs.stitchedEdges) return false;
    }
    if (product.type === "skate" && skateMaterial !== "all" && product.specs.material !== skateMaterial) return false;
    if (product.type === "keyboard") {
      if (keyboardTech !== "all" && product.specs.switchTechnology !== keyboardTech) return false;
      if (formFactor !== "all" && product.specs.formFactor !== formFactor) return false;
      if (product.specs.maxPollingHz < minPolling) return false;
      if (rapidTriggerOnly && !product.specs.rapidTrigger) return false;
    }
    if (product.type === "switch") {
      if (switchTech !== "all" && product.specs.technology !== switchTech) return false;
      if (switchFeel !== "all" && product.specs.feel !== switchFeel) return false;
    }
    return true;
  }).sort((a, b) => {
    if (sort === "name") return `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`);
    if (sort === "price") return (a.msrpUsd ?? Number.POSITIVE_INFINITY) - (b.msrpUsd ?? Number.POSITIVE_INFINITY);
    if (sort === "glide" && a.type === "mousepad" && b.type === "mousepad") return b.feel.dynamicSpeed - a.feel.dynamicSpeed || `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`);
    if (sort === "stopping" && a.type === "mousepad" && b.type === "mousepad") return b.feel.stoppingPower - a.feel.stoppingPower || `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`);
    if (sort === "actuation" && a.type === "switch" && b.type === "switch") {
      const af = forceToCN(a.specs.actuationForce);
      const bf = forceToCN(b.specs.actuationForce);
      return af - bf || `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`);
    }
    if (sort === "travel" && a.type === "switch" && b.type === "switch") return a.specs.totalTravelMm - b.specs.totalTravelMm || `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`);
    return evidenceCoverage(b).score - evidenceCoverage(a).score || `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`);
  }), [catalogProducts, category, currentOnly, brand, query, savedOnly, shortlistFilterIds, shape, minPolling, maxWeight, surface, padFirmness, stitchedOnly, skateMaterial, keyboardTech, formFactor, rapidTriggerOnly, switchTech, switchFeel, sort]);

  const replaceProductParam = (productId?: string) => {
    const url = new URL(window.location.href);
    if (productId) url.searchParams.set("product", productId);
    else url.searchParams.delete("product");
    window.history.replaceState(window.history.state, "", url);
  };

  const openProduct = (product: CatalogProduct) => {
    setSelected(product);
    replaceProductParam(product.id);
  };

  const closeProduct = () => {
    setSelected(null);
    replaceProductParam();
  };

  const copySwitchView = async () => {
    const url = new URL(window.location.href);
    url.search = "";
    if (query.trim()) url.searchParams.set("q", query.trim());
    if (brand !== "all") url.searchParams.set("brand", brand);
    if (!currentOnly) url.searchParams.set("current", "all");
    if (switchTech !== "all") url.searchParams.set("tech", switchTech);
    if (switchFeel !== "all") url.searchParams.set("feel", switchFeel);
    if (sort !== "coverage") url.searchParams.set("sort", sort);
    if (compactSwitchView) url.searchParams.set("density", "compact");
    url.hash = "#switches";
    try {
      await navigator.clipboard.writeText(url.toString());
      setShareStatus("View link copied");
    } catch {
      setShareStatus("Could not copy link");
    }
    window.setTimeout(() => setShareStatus(""), 1800);
  };

  const copyComparison = async () => {
    if (compareProducts.length < 2) {
      setCompareShareStatus("Add two products first");
      window.setTimeout(() => setCompareShareStatus(""), 1800);
      return;
    }
    const url = new URL(window.location.href);
    url.search = "";
    url.searchParams.set("compare", serializeSharedCompareIds(compareProducts.map(product => product.id)));
    url.hash = compareProducts[0].type === "switch" ? "#switches" : compareProducts[0].type === "mousepad" ? "#mousepads" : "";
    try {
      await navigator.clipboard.writeText(url.toString());
      setCompareShareStatus("Comparison link copied");
    } catch {
      setCompareShareStatus("Could not copy link");
    }
    window.setTimeout(() => setCompareShareStatus(""), 1800);
  };

  const copySavedShortlist = async () => {
    if (!savedIds.length) {
      setSavedShareStatus("Save gear first");
      window.setTimeout(() => setSavedShareStatus(""), 1800);
      return;
    }
    const url = new URL(window.location.href);
    url.search = "";
    url.searchParams.set("shortlist", savedIds.slice(0, 24).join(","));
    try {
      await navigator.clipboard.writeText(url.toString());
      setSavedShareStatus("Shortlist link copied");
    } catch {
      setSavedShareStatus("Could not copy link");
    }
    window.setTimeout(() => setSavedShareStatus(""), 1800);
  };

  const clearCategoryFilters = () => {
    setMinPolling(0); setMaxWeight(140); setShape("all"); setSurface("all"); setPadFirmness("all"); setStitchedOnly(false); setSkateMaterial("all"); setKeyboardTech("all"); setFormFactor("all"); setRapidTriggerOnly(false); setSwitchTech("all"); setSwitchFeel("all");
  };
  const clearAllFilters = () => {
    setQuery("");
    setBrand("all");
    setCurrentOnly(true);
    setSavedOnly(false);
    clearCategoryFilters();
  };
  const selectCategory = (next: "all" | ProductType) => { setCategory(next); setBrand("all"); clearCategoryFilters(); };

  const activeFilters = [
    query.trim() ? { key: "query", label: `Search: ${query.trim()}`, clear: () => setQuery("") } : null,
    brand !== "all" ? { key: "brand", label: `Brand: ${brand}`, clear: () => setBrand("all") } : null,
    savedOnly ? { key: "saved", label: validSharedShortlistIds.length ? `Shared shortlist: ${validSharedShortlistIds.length}` : "Saved gear", clear: () => setSavedOnly(false) } : null,
    shape !== "all" ? { key: "shape", label: `Shape: ${titleCase(shape)}`, clear: () => setShape("all") } : null,
    minPolling > 0 ? { key: "polling", label: `Polling: ${pollingLabel(minPolling)}+`, clear: () => setMinPolling(0) } : null,
    maxWeight < 140 ? { key: "weight", label: `Weight: ≤${maxWeight} g`, clear: () => setMaxWeight(140) } : null,
    surface !== "all" ? { key: "surface", label: `Surface: ${titleCase(surface)}`, clear: () => setSurface("all") } : null,
    padFirmness !== "all" ? { key: "firmness", label: `Firmness: ${titleCase(padFirmness)}`, clear: () => setPadFirmness("all") } : null,
    stitchedOnly ? { key: "stitched", label: "Stitched edges", clear: () => setStitchedOnly(false) } : null,
    skateMaterial !== "all" ? { key: "skate-material", label: `Skates: ${titleCase(skateMaterial)}`, clear: () => setSkateMaterial("all") } : null,
    keyboardTech !== "all" ? { key: "keyboard-tech", label: `Keyboard: ${titleCase(keyboardTech)}`, clear: () => setKeyboardTech("all") } : null,
    formFactor !== "all" ? { key: "form-factor", label: `Format: ${formFactor.toUpperCase()}`, clear: () => setFormFactor("all") } : null,
    rapidTriggerOnly ? { key: "rapid-trigger", label: "Rapid Trigger", clear: () => setRapidTriggerOnly(false) } : null,
    switchTech !== "all" ? { key: "switch-tech", label: `Switch: ${titleCase(switchTech)}`, clear: () => setSwitchTech("all") } : null,
    switchFeel !== "all" ? { key: "switch-feel", label: `Feel: ${titleCase(switchFeel)}`, clear: () => setSwitchFeel("all") } : null,
  ].filter((item): item is { key: string; label: string; clear: () => void } => item !== null);

  const focusedMeta = focusCategory ? categoryMeta[focusCategory] : null;
  const focusedDescription = focusCategory === "mousepad"
    ? "Browse mousepads as a first-class catalog: cloth, hybrid, glass, resin and hard surfaces with material, size and feel fields kept separate from sourced evidence."
    : focusCategory === "switch"
      ? "Browse Atlas switch records, then search the broader attributed ThereminGoat review directory below. External review metadata stays separate from Atlas product specs."
      : "";
  const catalogTitle = focusCategory === "mousepad" ? "Mousepad catalog" : focusCategory === "switch" ? "Atlas switch records" : "Browse the input stack";
  const catalogDescription = focusCategory === "mousepad"
    ? "Filter by the surface class Atlas actually records, then compare normalized glide, stopping, dimensions and source coverage without collapsing them into one score."
    : focusCategory === "switch"
      ? "These are Atlas canonical product records with sourced specifications. The much larger attributed review directory stays below as a separate evidence source."
      : "Start broad, reveal only the filters that matter, and add up to four products from one category to the richer comparison tray. Official product imagery appears where Atlas has a stable sourced asset; otherwise the interface falls back to the category glyph.";
  const searchPlaceholder = focusCategory === "mousepad" ? "Search pad, material, surface, base…" : focusCategory === "switch" ? "Search switch, technology, feel, force…" : "Search product, material, shape, switch, feature…";

  return <div className={`consumer-shell ${focusCategory ? "consumer-category-page" : ""}`} data-focus-category={focusCategory ?? undefined}>
    <header className="consumer-topbar">
      <a className="consumer-brand" href="#"><span className="consumer-logo"><i/><i/><i/></span><b>ATLAS</b><small>input gear intelligence</small></a>
      <nav><a href="#pointing">Setup finder</a><a href="#keyboard-lab">Keyboard lab</a><a href="#sensitivity">Sensitivity</a><a href="#product-lab">Research</a></nav>
      <span className="consumer-live"><i/> v0.9 dataset</span>
    </header>

    <main>
      {focusCategory && focusedMeta && <section className="consumer-category-hero" data-category={focusCategory}>
        <div>
          <span>{focusedMeta.singular} database</span>
          <h1>{focusCategory === "mousepad" ? "Mousepads" : "Switches"}</h1>
          <p>{focusedDescription}</p>
          <div className="consumer-category-hero-actions">
            <a href="#">Browse all gear</a>
            {focusCategory === "mousepad" ? <a href="#pointing">Open setup finder →</a> : <a href="#switch-review-index">Jump to review directory →</a>}
          </div>
        </div>
        <aside><b>{counts[focusCategory]}</b><span>canonical Atlas records</span><small>{focusedMeta.description}</small></aside>
      </section>}
      <section className="consumer-hero">
        <div className="consumer-hero-copy"><span className="consumer-kicker">PERIPHERAL DATABASE + DECISION TOOLS</span><h1>Find gear by <em>what matters,</em><br/>not what is trending.</h1><p>Browse specs, fit signals, surface behavior, switch characteristics and source provenance across the PC input stack. Atlas keeps manufacturer claims, independent findings and modeled guidance visibly separate.</p><div className="consumer-hero-actions"><button onClick={() => document.getElementById("consumer-catalog")?.scrollIntoView({ behavior: "smooth" })}>Browse database</button><a href="#pointing">Build a mouse setup</a></div></div>
        <div className="consumer-hero-panel"><span>CATALOG COVERAGE</span><strong>{catalogProducts.length}</strong><small>canonical product records</small><div>{(Object.keys(categoryMeta) as ProductType[]).map(type => <button key={type} data-category={type} onClick={() => { selectCategory(type); document.getElementById("consumer-catalog")?.scrollIntoView({ behavior: "smooth" }); }}><span>{categoryMeta[type].label}</span><b>{counts[type]}</b></button>)}</div></div>
      </section>

      <section className="consumer-tools" aria-labelledby="consumer-tools-heading">
        <div className="consumer-tools-head">
          <div><span>Tools</span><h2 id="consumer-tools-heading">Explore input hardware</h2></div>
          <p>Pick the tool that matches what you are comparing. The color marks the section; the numbers are only navigation order.</p>
        </div>
        <div className="consumer-tool-row" aria-label="Atlas tools">
          <a className="tool-mouse" href="#pointing"><span>01</span><div><b>Setup finder + Shape Lab</b><small>Mouse fit, pad/skate pairing and outline comparison</small></div><i>→</i></a>
          <a className="tool-keyboard" href="#keyboard-lab"><span>02</span><div><b>Keyboard Lab</b><small>Rapid Trigger, HE/TMR platforms and switch research</small></div><i>→</i></a>
          <a className="tool-sensitivity" href="#sensitivity"><span>03</span><div><b>Sensitivity Lab</b><small>cm/360, DPI, yaw and cross-game conversion</small></div><i>→</i></a>
        </div>
      </section>

      <section className="consumer-catalog" id="consumer-catalog">
        <div className="consumer-section-head"><div><span>{focusCategory ? `${focusedMeta?.singular.toUpperCase()} DATABASE` : "DATABASE"}</span><h2>{catalogTitle}</h2><p>{catalogDescription}</p></div><strong aria-live="polite" aria-atomic="true">{filtered.length}<small> matching</small></strong></div>
        <div className="consumer-category-tabs">{(["mouse", "mousepad", "skate", "keyboard", "switch", "all"] as const).map(type => <button key={type} data-category={type} className={category === type ? "active" : ""} onClick={() => selectCategory(type)}>{type === "all" ? "All gear" : categoryMeta[type].label}<span>{type === "all" ? catalogProducts.length : counts[type]}</span></button>)}</div>
        {focusCategory === "mousepad" && <div className="consumer-focus-quick" data-category="mousepad" aria-label="Filter mousepads by surface class">
          <button type="button" className={surface === "all" ? "active" : ""} onClick={() => setSurface("all")} aria-pressed={surface === "all"}><span>All surfaces</span><b>{mousepads.length}</b></button>
          {mousepadSurfaces.map(item => <button type="button" key={item} className={surface === item ? "active" : ""} onClick={() => setSurface(item)} aria-pressed={surface === item}><span>{titleCase(item)}</span><b>{mousepadSurfaceCounts.get(item) ?? 0}</b></button>)}
        </div>}
        {focusCategory === "switch" && <>
          <div className="consumer-focus-quick" data-category="switch" aria-label="Filter Atlas switches by sensing technology">
            <button type="button" className={switchTech === "all" ? "active" : ""} onClick={() => setSwitchTech("all")} aria-pressed={switchTech === "all"}><span>All technologies</span><b>{switchProducts.length}</b></button>
            {switchTechnologies.map(item => <button type="button" key={item} className={switchTech === item ? "active" : ""} onClick={() => setSwitchTech(item)} aria-pressed={switchTech === item}><span>{titleCase(item)}</span><b>{switchTechnologyCounts.get(item) ?? 0}</b></button>)}
          </div>
          <div className="consumer-switch-feel-quick" role="group" aria-label="Filter Atlas switches by feel">
            {(["all","linear","tactile","clicky"] as const).map(item => <button type="button" key={item} className={switchFeel === item ? "active" : ""} onClick={() => setSwitchFeel(item)} aria-pressed={switchFeel === item}>{item === "all" ? "Any feel" : titleCase(item)}</button>)}
            <span className="consumer-switch-view-toggle"><button type="button" aria-pressed={!compactSwitchView} className={!compactSwitchView ? "active" : ""} onClick={() => setCompactSwitchView(false)}>Comfortable</button><button type="button" aria-pressed={compactSwitchView} className={compactSwitchView ? "active" : ""} onClick={() => setCompactSwitchView(true)}>Compact</button></span>
            <button type="button" className="consumer-switch-share-view" onClick={copySwitchView}>Copy view</button>
            <span className="consumer-switch-share-status" role="status" aria-live="polite">{shareStatus}</span>
          </div>
        </>}
        <div className="consumer-toolbar">
          <div className="consumer-search"><span aria-hidden="true">⌕</span><input aria-label="Search catalog" value={query} onChange={event => setQuery(event.target.value)} placeholder={searchPlaceholder}/></div>
          <label>Brand<select value={brand} onChange={event => setBrand(event.target.value)}><option value="all">All brands</option>{brands.map(item => <option key={item} value={item}>{item}</option>)}</select></label>
          <label>Sort<select value={sort} onChange={event => setSort(event.target.value as typeof sort)}><option value="coverage">Evidence coverage</option><option value="name">Name</option><option value="price">Price</option>{focusCategory === "mousepad" && <><option value="glide">Glide · high to low</option><option value="stopping">Stopping · high to low</option></>}{focusCategory === "switch" && <><option value="actuation">Published actuation · light to heavy</option><option value="travel">Travel · short to long</option></>}</select></label>
          <label className="consumer-toggle"><span>Current only</span><input type="checkbox" checked={currentOnly} onChange={event => setCurrentOnly(event.target.checked)}/><i/></label>
          <button type="button" className={`consumer-saved-filter ${savedOnly ? "active" : ""}`} aria-pressed={savedOnly} onClick={() => setSavedOnly(value => !value)}>{validSharedShortlistIds.length ? "Shared" : "Saved"} <span>{validSharedShortlistIds.length || savedIds.length}</span></button>
          <button type="button" className="consumer-saved-share" disabled={!savedIds.length} onClick={copySavedShortlist}>Share saved</button>
          <span className="consumer-saved-share-status" role="status" aria-live="polite">{savedShareStatus}</span>
          <button type="button" className={`consumer-filter-toggle ${showFilters ? "active" : ""}`} aria-expanded={showFilters} aria-controls={filtersId} onClick={() => setShowFilters(value => !value)}>{focusCategory ? "More filters" : "Filters"} <span>{showFilters ? "−" : "+"}</span></button>
        </div>

        {activeFilters.length > 0 && <div className="consumer-active-filters" role="region" aria-label="Active catalog filters">
          <span>Active filters</span>
          <div>{activeFilters.map(filter => <button type="button" key={filter.key} onClick={filter.clear} aria-label={`Remove ${filter.label} filter`}><b>{filter.label}</b><i aria-hidden="true">×</i></button>)}</div>
          <button type="button" className="consumer-active-filters-clear" onClick={clearAllFilters}>Clear all</button>
        </div>}

        {showFilters && <div className="consumer-progressive-filters" id={filtersId}>
          {(category === "mouse" || category === "all") && <><label>Mouse shape<select value={shape} onChange={event => setShape(event.target.value)}><option value="all">Any shape</option><option value="symmetrical">Symmetrical</option><option value="ergonomic">Ergonomic</option></select></label><label>Minimum polling<select value={minPolling} onChange={event => setMinPolling(+event.target.value)}><option value="0">Any</option><option value="1000">1K+</option><option value="4000">4K+</option><option value="8000">8K</option></select></label><label>Maximum weight<select value={maxWeight} onChange={event => setMaxWeight(+event.target.value)}><option value="45">45 g</option><option value="55">55 g</option><option value="65">65 g</option><option value="80">80 g</option><option value="140">Any</option></select></label></>}
          {(category === "mousepad" || category === "all") && <><label>Surface class<select value={surface} onChange={event => setSurface(event.target.value)}><option value="all">Any surface</option><option value="cloth">Cloth</option><option value="hybrid">Hybrid</option><option value="glass">Glass</option><option value="resin">Resin</option><option value="plastic">Plastic</option></select></label><label>Firmness<select value={padFirmness} onChange={event => setPadFirmness(event.target.value)}><option value="all">Any firmness</option><option value="xsoft">Xsoft</option><option value="soft">Soft</option><option value="mid">Mid</option><option value="firm">Firm</option><option value="hard">Hard</option></select></label><label className="consumer-filter-check">Stitched edges only<input type="checkbox" checked={stitchedOnly} onChange={event => setStitchedOnly(event.target.checked)}/></label></>}
          {(category === "skate" || category === "all") && <label>Skate material<select value={skateMaterial} onChange={event => setSkateMaterial(event.target.value)}><option value="all">Any material</option><option value="pure-ptfe">Pure PTFE</option><option value="hardened-ptfe">Hardened PTFE</option><option value="uhmwpe">UHMWPE</option><option value="glass">Glass</option><option value="pom">POM</option></select></label>}
          {(category === "keyboard" || category === "all") && <><label>Keyboard technology<select value={keyboardTech} onChange={event => setKeyboardTech(event.target.value)}><option value="all">Any technology</option><option value="hall-effect">Hall effect</option><option value="optical-analog">Optical analog</option><option value="tmr">TMR</option><option value="mechanical">Mechanical</option></select></label><label>Form factor<select value={formFactor} onChange={event => setFormFactor(event.target.value)}><option value="all">Any format</option><option value="60%">60%</option><option value="65%">65%</option><option value="75%">75%</option><option value="80%">80%</option><option value="tkl">TKL</option><option value="full-size">Full size</option></select></label><label className="consumer-filter-check">Rapid Trigger only<input type="checkbox" checked={rapidTriggerOnly} onChange={event => setRapidTriggerOnly(event.target.checked)}/></label></>}
          {(category === "switch" || category === "all") && <><label>Switch technology<select value={switchTech} onChange={event => setSwitchTech(event.target.value)}><option value="all">Any technology</option><option value="hall-effect">Hall effect</option><option value="tmr">TMR</option><option value="mechanical">Mechanical</option><option value="optical-analog">Optical analog</option></select></label><label>Switch feel<select value={switchFeel} onChange={event => setSwitchFeel(event.target.value)}><option value="all">Any feel</option><option value="linear">Linear</option><option value="tactile">Tactile</option><option value="clicky">Clicky</option></select></label></>}
          <button onClick={clearCategoryFilters}>Clear category filters</button>
        </div>}

        {filtered.length > 0 ? <div className={`consumer-grid ${focusCategory === "switch" && compactSwitchView ? "consumer-grid-switch-compact" : ""}`}>{filtered.map(product => <div className="consumer-card-wrap" key={product.id}><button type="button" className={`consumer-card-compare ${compared(product.id) ? "selected" : ""}`} aria-pressed={compared(product.id)} aria-controls={compareTrayId} onClick={() => toggleCompare(product)}>{compared(product.id) ? "Compared" : "+ Compare"}</button><button type="button" className={`consumer-card-save ${isSaved(product.id) ? "selected" : ""}`} aria-pressed={isSaved(product.id)} onClick={() => toggleSaved(product)}>{isSaved(product.id) ? "Saved" : "Save"}</button><ProductCard product={product} onOpen={openProduct} compared={compared(product.id)}/></div>)}</div> : <div className="consumer-empty"><b>No records match those filters.</b><span>Clear a category filter or broaden the search.</span><button type="button" onClick={clearAllFilters}>Reset filters</button></div>}
      </section>

      {afterCatalog}
      <section className="consumer-principles"><div><span>HOW ATLAS READS DATA</span><h2>Specs are facts. Fit is context. Reviews are evidence.</h2></div><p>Atlas does not turn every reviewer opinion into a universal score. Manufacturer specifications stay labeled as manufacturer claims, independent observations remain attributed, and derived fit models are treated as guidance rather than measurements.</p><a href="#product-lab">Open research & validation →</a></section>
    </main>

    {compareProducts.length > 0 && <div className="consumer-compare-tray" id={compareTrayId} role="region" aria-label="Comparison tray"><span>{categoryMeta[compareProducts[0].type].singular} compare · {compareProducts.length}/4</span><div className="consumer-compare-tray-list">{compareProducts.map(product => <div className="consumer-compare-chip" key={product.id}><span className="consumer-compare-chip-media" aria-hidden="true"><ProductMedia productId={product.id}/></span><div><small>{product.brand}</small><b>{product.model}</b><em>{compareChipMeta(product)}</em></div><button type="button" onClick={() => removeCompare(product.id)} aria-label={`Remove ${product.brand} ${product.model} from comparison`}>×</button></div>)}</div><div className="consumer-compare-tray-actions"><button type="button" className="consumer-compare-clear" onClick={() => { setCompareIds([]); setCompareOpen(false); }}>Clear</button><button type="button" className="consumer-compare-share" disabled={compareProducts.length < 2} onClick={copyComparison}>Copy comparison</button><span className="consumer-compare-share-status" role="status" aria-live="polite">{compareShareStatus}</span><button type="button" className="consumer-compare-open" aria-haspopup="dialog" disabled={compareProducts.length < 2} onClick={() => setCompareOpen(true)}>Compare {compareProducts.length >= 2 ? compareProducts.length : ""}</button></div></div>}

    {selected && <ProductDrawer product={selected} onClose={closeProduct} onCompare={toggleCompare} compared={compared(selected.id)} onSave={toggleSaved} saved={isSaved(selected.id)}/>} 
    {compareOpen && compareProducts.length >= 2 && <Suspense fallback={<CompareLoadingFallback onClose={() => setCompareOpen(false)}/>} ><ConsumerCompare products={compareProducts} onClose={() => setCompareOpen(false)} onRemove={removeCompare}/></Suspense>} 
  </div>;
}
