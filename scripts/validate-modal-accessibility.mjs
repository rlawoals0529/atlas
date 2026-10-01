import fs from "node:fs";

const files = {
  consumer: fs.readFileSync(new URL("../src/react-app/AtlasConsumer.tsx", import.meta.url), "utf8"),
  compare: fs.readFileSync(new URL("../src/react-app/ConsumerCompare.tsx", import.meta.url), "utf8"),
  pointing: fs.readFileSync(new URL("../src/react-app/AppV05.tsx", import.meta.url), "utf8"),
  keyboard: fs.readFileSync(new URL("../src/react-app/KeyboardLab.tsx", import.meta.url), "utf8"),
  hook: fs.readFileSync(new URL("../src/react-app/useModalDialog.ts", import.meta.url), "utf8"),
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
]) {
  if (!files.hook.includes(requirement)) errors.push(`useModalDialog: missing required behavior ${requirement}`);
}

if (!files.consumer.includes("function CompareLoadingFallback") || !files.consumer.includes("useModalDialog<HTMLDivElement>")) {
  errors.push("comparison loading fallback must use modal focus management");
}

if (errors.length) {
  console.error("Modal accessibility validation FAILED:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Modal accessibility PASS: all inspector/comparison dialogs use shared focus trapping, Escape handling, focus restoration and non-focusable backdrops.");
