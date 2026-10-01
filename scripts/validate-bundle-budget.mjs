import fs from "node:fs";
import path from "node:path";
import { gzipSync } from "node:zlib";

const root = new URL("../dist/client/", import.meta.url);
const indexPath = new URL("index.html", root);
if (!fs.existsSync(indexPath)) {
  console.error("Bundle budget FAILED: dist/client/index.html does not exist. Run the production build first.");
  process.exit(1);
}

const html = fs.readFileSync(indexPath, "utf8");
const scriptMatch = html.match(/<script[^>]+src=["']([^"']+\.js)["']/i);
const styleMatch = html.match(/<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+\.css)["']/i)
  ?? html.match(/<link[^>]+href=["']([^"']+\.css)["'][^>]+rel=["']stylesheet["']/i);

if (!scriptMatch || !styleMatch) {
  console.error("Bundle budget FAILED: could not resolve initial JS/CSS assets from dist/client/index.html.");
  process.exit(1);
}

const assetPath = value => new URL(value.replace(/^\//, ""), root);
const jsPath = assetPath(scriptMatch[1]);
const cssPath = assetPath(styleMatch[1]);

const budgets = {
  js: { raw: 460 * 1024, gzip: 118 * 1024 },
  css: { raw: 115 * 1024, gzip: 22 * 1024 },
};

function measure(url) {
  const buffer = fs.readFileSync(url);
  return { raw: buffer.byteLength, gzip: gzipSync(buffer, { level: 9 }).byteLength };
}

function kb(value) {
  return `${(value / 1024).toFixed(2)} KiB`;
}

const measured = {
  js: measure(jsPath),
  css: measure(cssPath),
};

const mainEntryPath = new URL("../src/react-app/main.tsx", import.meta.url);
const mainEntry = fs.readFileSync(mainEntryPath, "utf8");
const deferredRouteStyles = [
  "v05.css",
  "shape-lab-v2.css",
  "utility-labs.css",
  "sensitivity-fixes.css",
  "product-lab.css",
  "product-lab-entry.css",
  "production-analytics.css",
];
const routeStylePaths = deferredRouteStyles.map(name => new URL(`../src/react-app/${name}`, import.meta.url));

const errors = [];
for (const style of deferredRouteStyles) {
  if (mainEntry.includes(`"./${style}"`)) {
    errors.push(`Initial entry re-imports deferred route stylesheet: ${style}`);
  }
}
for (const stylePath of routeStylePaths) {
  const source = fs.readFileSync(stylePath, "utf8").trimStart();
  if (!source.startsWith("@layer atlas-route-base{")) {
    errors.push(`${path.basename(stylePath.pathname)} must remain in the atlas-route-base cascade layer`);
  }
}

for (const kind of ["js", "css"]) {
  for (const mode of ["raw", "gzip"]) {
    const actual = measured[kind][mode];
    const limit = budgets[kind][mode];
    if (actual > limit) errors.push(`${kind.toUpperCase()} ${mode}: ${kb(actual)} exceeds ${kb(limit)}`);
  }
}

console.log("Initial bundle budget:");
console.log(`- JS  ${kb(measured.js.raw)} raw / ${kb(measured.js.gzip)} gzip (limits ${kb(budgets.js.raw)} / ${kb(budgets.js.gzip)})`);
console.log(`- CSS ${kb(measured.css.raw)} raw / ${kb(measured.css.gzip)} gzip (limits ${kb(budgets.css.raw)} / ${kb(budgets.css.gzip)})`);

if (errors.length) {
  console.error("Bundle budget FAILED:");
  for (const error of errors) console.error(`- ${error}`);
  console.error("If a larger initial bundle is intentional, document the reason and adjust the budget deliberately.");
  process.exit(1);
}

console.log("Bundle budget PASS.");
