import crypto from "node:crypto";
import fs from "node:fs";

const html = fs.readFileSync("index.html", "utf8");
const headers = fs.readFileSync("public/_headers", "utf8");

const inlineScripts = [...html.matchAll(/<script(?![^>]+src=)[^>]*>([\s\S]*?)<\/script>/gi)]
  .map(match => match[1])
  .filter(value => value.trim().length > 0);

if (inlineScripts.length === 0) {
  console.error("Static header validation failed: index.html has no inline script to hash.");
  process.exit(1);
}

const missing = [];
for (const source of inlineScripts) {
  const hash = crypto.createHash("sha256").update(source).digest("base64");
  const token = `'sha256-${hash}'`;
  if (!headers.includes(token)) missing.push(token);
}

const requiredDirectives = [
  "default-src 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "connect-src 'self'",
  "Cross-Origin-Opener-Policy: same-origin",
  "X-Content-Type-Options: nosniff",
  "X-Frame-Options: DENY",
];

for (const directive of requiredDirectives) {
  if (!headers.includes(directive)) missing.push(directive);
}

if (missing.length) {
  console.error("Static header validation failed:");
  for (const item of missing) console.error(`- missing ${item}`);
  process.exit(1);
}

console.log(`Static security headers PASS: ${inlineScripts.length} inline script hash(es) and ${requiredDirectives.length} required directives verified.`);
