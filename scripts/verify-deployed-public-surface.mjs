const base = (process.argv[2] ?? "").replace(/\/$/, "");
if (!base.startsWith("https://")) {
  console.error("Usage: node scripts/verify-deployed-public-surface.mjs https://example.workers.dev");
  process.exit(1);
}

const failures = [];

async function fetchText(path, expectedType) {
  const response = await fetch(`${base}${path}`, { redirect: "error" });
  const type = response.headers.get("content-type") ?? "";
  if (!response.ok) failures.push(`${path}: HTTP ${response.status}`);
  if (expectedType && !type.includes(expectedType)) failures.push(`${path}: unexpected content-type ${type || "(missing)"}`);
  return { response, text: await response.text() };
}

const root = await fetchText("/", "text/html");
for (const token of [
  "Atlas — Gaming Peripheral Research & Comparison",
  '<meta name="robots" content="index,follow"',
  '<link rel="canonical" href="https://atlas.rlawoals0529.workers.dev/"',
]) {
  if (!root.text.includes(token)) failures.push(`/: missing deployed metadata token ${token}`);
}

const robots = await fetchText("/robots.txt", "text/plain");
if (!robots.text.includes("Sitemap: https://atlas.rlawoals0529.workers.dev/sitemap.xml")) failures.push("/robots.txt: canonical sitemap missing");

const sitemap = await fetchText("/sitemap.xml", "xml");
if (!sitemap.text.includes("<loc>https://atlas.rlawoals0529.workers.dev/</loc>")) failures.push("/sitemap.xml: canonical root URL missing");

const security = await fetchText("/.well-known/security.txt", "text/plain");
if (!security.text.includes("https://github.com/rlawoals0529/atlas/security/policy")) failures.push("/.well-known/security.txt: security policy URL missing");

const rootHeaders = root.response.headers;
for (const [name, expected] of [
  ["x-content-type-options", "nosniff"],
  ["x-frame-options", "DENY"],
  ["cross-origin-opener-policy", "same-origin"],
]) {
  const value = rootHeaders.get(name);
  if (value !== expected) failures.push(`/: ${name} expected ${expected}, got ${value ?? "(missing)"}`);
}

if (failures.length) {
  console.error("Deployed public surface verification failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Deployed public surface PASS: homepage metadata, robots, sitemap, security.txt and security headers verified.");
