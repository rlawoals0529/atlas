import fs from "node:fs";

const html = fs.readFileSync("index.html", "utf8");
const robots = fs.readFileSync("public/robots.txt", "utf8");
const sitemap = fs.readFileSync("public/sitemap.xml", "utf8");
const manifest = JSON.parse(fs.readFileSync("public/manifest.webmanifest", "utf8"));
const security = fs.readFileSync("public/.well-known/security.txt", "utf8");
const worker = fs.readFileSync("src/worker/index.ts", "utf8");
const wrangler = fs.readFileSync("wrangler.jsonc", "utf8");

const origin = "https://atlas.rlawoals0529.workers.dev/";
const failures = [];

const requiredHtml = [
  '<meta name="description"',
  '<meta name="robots" content="index,follow"',
  '<meta property="og:type" content="website"',
  '<meta property="og:title"',
  '<meta property="og:description"',
  `<meta property="og:url" content="${origin}"`,
  '<meta name="twitter:card"',
  `<link rel="canonical" href="${origin}"`,
  '<link rel="manifest" href="/manifest.webmanifest"',
  'application/ld+json',
];

for (const token of requiredHtml) {
  if (!html.includes(token)) failures.push(`index.html missing public metadata token: ${token}`);
}

if (!robots.includes("User-agent: *") || !robots.includes("Allow: /")) failures.push("robots.txt must allow public crawling");
if (!robots.includes(`Sitemap: ${origin}sitemap.xml`)) failures.push("robots.txt must advertise the canonical sitemap");
if (!sitemap.includes(`<loc>${origin}</loc>`)) failures.push("sitemap.xml must contain the canonical Atlas URL");
if (manifest.start_url !== "/" || manifest.scope !== "/") failures.push("manifest start_url/scope must remain root-relative");
if (!Array.isArray(manifest.icons) || !manifest.icons.some(icon => icon.src === "/atlas-mark.svg")) failures.push("manifest must retain the Atlas icon");
if (!security.includes("Contact: https://github.com/rlawoals0529/atlas/security/policy")) failures.push("security.txt must point to the public security policy");
if (!security.includes(`Canonical: ${origin}.well-known/security.txt`)) failures.push("security.txt canonical URL is incorrect");
for (const route of ["/robots.txt", "/sitemap.xml", "/.well-known/security.txt"]) {
  if (!worker.includes(`app.get("${route}"`)) failures.push(`Worker must serve ${route} ahead of SPA fallback`);
  if (!wrangler.includes(`"${route}"`)) failures.push(`wrangler run_worker_first must include ${route}`);
}

if (failures.length) {
  console.error("Public metadata validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Public metadata PASS: canonical URL, robots, sitemap, manifest and security discovery files are consistent.");
