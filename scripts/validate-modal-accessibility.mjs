import fs from "node:fs";

const files = {
  consumer: fs.readFileSync(new URL("../src/react-app/AtlasConsumer.tsx", import.meta.url), "utf8"),
  compare: fs.readFileSync(new URL("../src/react-app/ConsumerCompare.tsx", import.meta.url), "utf8"),
  pointing: fs.readFileSync(new URL("../src/react-app/AppV05.tsx", import.meta.url), "utf8"),
  keyboard: fs.readFileSync(new URL("../src/react-app/KeyboardLab.tsx", import.meta.url), "utf8"),
  hook: fs.readFileSync(new URL("../src/react-app/useModalDialog.ts", import.meta.url), "utf8"),
  shape: fs.readFileSync(new URL("../src/react-app/ShapeLabV2.tsx", import.meta.url), "utf8"),
  readability: fs.readFileSync(new URL("../src/react-app/atlas-readability.css", import.meta.url), "utf8"),
};

const errors = [];
const surfaces = [
  ["consumer product drawer", files.consumer, "consumer-drawer", "consumer-drawer-backdrop"],
  ["rich comparison", files.compare, "consumer-compare-panel", "consumer-compare-backdrop"],
  ["pointing product inspector", files.pointing, "v5-inspector", "v5-inspector-backdrop"],
  ["keyboard product inspector", files.keyboard, "kb-inspector", "kb-backdrop"],
];

for (const [label, source, panelClass, backdropClass] of surfaces) {
  if (!source.includes('useModalDialog')) errors.push(`${label}: missing shared modal focus manager`);
  const panelPattern = new RegExp(`className=["'][^"']*\\b${panelClass}\\b[^"']*["'][^>]*role=["']dialog["']`);
  if (!panelPattern.test(source)) errors.push(`${label}: role="dialog" is not on the actual panel`);
  const backdropPattern = new RegExp(`className=["'][^"']*\\b${backdropClass}\\b[^"']*["'][^>]*tabIndex=\\{-1\\}[^>]*aria-hidden=["']true["']`);
  if (!backdropPattern.test(source)) errors.push(`${label}: backdrop must stay out of the keyboard/accessibility tree`);
}

for (const shell of ["consumer-drawer-shell", "consumer-compare-shell", "v5-inspector-shell", "kb-inspector-shell"]) {
  const all = Object.values(files).filter(value => typeof value === "string");
  if (all.some(source => new RegExp(`className=["'][^"']*\\b${shell}\\b[^"']*["'][^>]*role=["']dialog["']`).test(source))) {
    errors.push(`${shell}: dialog semantics regressed onto an outer shell`);
  }
}

for (const requirement of [
  'event.key === "Escape"',
  'event.key !== "Tab"',
  'previousFocus',
  'document.body.style.overflow = "hidden"',
  'modalStack.at(-1)',
  'document.addEventListener("focusin"',
  'savedBodyPaddingRight',
  'event.isComposing',
]) {
  if (!files.hook.includes(requirement)) errors.push(`useModalDialog: missing required behavior ${requirement}`);
}

if (!files.consumer.includes("function CompareLoadingFallback") || !files.consumer.includes("useModalDialog<HTMLDivElement>")) {
  errors.push("comparison loading fallback must use modal focus management");
}

for (const [label, requirement] of [
  ["product cards advertise dialog behavior", 'aria-haspopup="dialog"'],
  ["progressive filters expose expanded state", "aria-expanded={showFilters}"],
  ["progressive filters expose their controlled region", "aria-controls={filtersId}"],
  ["compare selection exposes pressed state", "aria-pressed={compared(product.id)}"],
  ["comparison tray is a labeled region", 'role="region" aria-label="Comparison tray"'],
]) {
  if (!files.consumer.includes(requirement)) errors.push(`consumer catalog: missing ${label}`);
}

for (const [label, source, requirement] of [
  ["pointing product cards advertise dialog behavior", files.pointing, 'aria-haspopup="dialog"'],
  ["pointing catalog product-type controls expose pressed state", files.pointing, 'aria-pressed={dbType === type}'],
  ["pointing catalog search has an accessible name", files.pointing, 'aria-label="Search peripheral catalog"'],
  ["keyboard product cards advertise dialog behavior", files.keyboard, 'aria-haspopup="dialog"'],
  ["keyboard hardware-type controls expose pressed state", files.keyboard, 'aria-pressed={kind === value}'],
  ["keyboard search has an accessible name", files.keyboard, 'aria-label="Search keyboards and switches"'],
  ["keyboard technology filter has an accessible name", files.keyboard, 'aria-label="Filter keyboards and switches by technology"'],
  ["Shape Lab view controls are a named group", files.shape, 'role="group" aria-label="Shape view"'],
  ["Shape Lab view controls expose pressed state", files.shape, 'aria-pressed={view === item}'],
  ["Shape Lab scale controls are a named group", files.shape, 'role="group" aria-label="Scale mode"'],
  ["Shape Lab similarity controls are a named group", files.shape, 'role="group" aria-label="Similarity mode"'],
  ["Shape Lab line styles are a named group", files.shape, 'role="group" aria-label="Line style"'],
  ["Shape Lab color presets expose pressed state", files.shape, 'aria-pressed={layer.color.toLowerCase() === color.toLowerCase()}'],
]) {
  if (!source.includes(requirement)) errors.push(`interactive controls: missing ${label}`);
}

if (!/\.shape-swatches>button,[\s\S]*?width:26px;\s*height:26px;/.test(files.readability)) {
  errors.push("Shape Lab color swatches must retain at least a 26px explicit target");
}

if (errors.length) {
  console.error("Modal accessibility validation FAILED:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Accessibility PASS: dialogs retain focus/scroll behavior; dialog openers, grouped toggle controls, filters and Shape Lab targets expose their state and intent.");
