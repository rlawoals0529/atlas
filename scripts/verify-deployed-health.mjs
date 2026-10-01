import fs from "node:fs";
import { loadCatalog } from "./load-catalog.mjs";

const baseUrl = process.argv[2]?.replace(/\/$/, "");
if (!baseUrl || !/^https:\/\//.test(baseUrl)) {
  console.error("Usage: node scripts/verify-deployed-health.mjs https://<worker>.workers.dev");
  process.exit(2);
}

const releaseSource = fs.readFileSync(new URL("../src/shared/release.ts", import.meta.url), "utf8");
const readReleaseField = (field) => {
  const match = releaseSource.match(new RegExp(`${field}:\\s*"([^"]+)"`));
  if (!match) throw new Error(`Could not read RELEASE.${field} from src/shared/release.ts`);
  return match[1];
};

const catalog = loadCatalog();
const expected = {
  build: readReleaseField("label"),
  productUi: readReleaseField("productUi"),
  dataLayer: readReleaseField("dataLayer"),
  researchCutoff: readReleaseField("researchCutoff"),
  products: catalog.mice.length + catalog.mousepads.length + catalog.skates.length + catalog.keyboards.length + catalog.switches.length,
  mice: catalog.mice.length,
  pads: catalog.mousepads.length,
  skates: catalog.skates.length,
  keyboards: catalog.keyboards.length,
  switches: catalog.switches.length,
};

const expectedHeaders = {
  "content-security-policy": "default-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'",
  "cross-origin-resource-policy": "same-origin",
  "permissions-policy": "camera=(), microphone=(), geolocation=(), payment=()",
  "referrer-policy": "no-referrer",
  "strict-transport-security": "max-age=31536000; includeSubDomains",
  "x-content-type-options": "nosniff",
  "x-frame-options": "DENY",
  "cache-control": "no-store",
};

const attempts = 12;
const delayMs = 2_000;
let lastError = "No response received";

for (let attempt = 1; attempt <= attempts; attempt += 1) {
  try {
    const url = `${baseUrl}/api/health?verify=${Date.now()}-${attempt}`;
    const response = await fetch(url, {
      headers: {
        "cache-control": "no-cache",
        pragma: "no-cache",
      },
    });
    const text = await response.text();
    if (!response.ok) {
      lastError = `HTTP ${response.status}: ${text.slice(0, 500)}`;
    } else {
      let health;
      try {
        health = JSON.parse(text);
      } catch {
        lastError = `Health endpoint did not return JSON: ${text.slice(0, 500)}`;
        health = null;
      }

      if (health) {
        const mismatches = Object.entries(expected)
          .filter(([key, value]) => health[key] !== value)
          .map(([key, value]) => `${key}: expected ${JSON.stringify(value)}, received ${JSON.stringify(health[key])}`);

        const headerMismatches = Object.entries(expectedHeaders)
          .filter(([name, value]) => response.headers.get(name) !== value)
          .map(([name, value]) => `header ${name}: expected ${JSON.stringify(value)}, received ${JSON.stringify(response.headers.get(name))}`);

        const contentType = response.headers.get("content-type") ?? "";
        if (!contentType.toLowerCase().startsWith("application/json")) {
          headerMismatches.push(`header content-type: expected application/json, received ${JSON.stringify(contentType)}`);
        }

        if (health.ok === true && mismatches.length === 0 && headerMismatches.length === 0) {
          console.log(JSON.stringify(health));
          console.log(`Verified deployed Atlas release ${expected.build}, catalog counts and API security headers on attempt ${attempt}.`);
          process.exit(0);
        }

        lastError = [
          health.ok === true ? null : `ok: expected true, received ${JSON.stringify(health.ok)}`,
          ...mismatches,
          ...headerMismatches,
        ].filter(Boolean).join("; ");
      }
    }
  } catch (error) {
    lastError = error instanceof Error ? error.message : String(error);
  }

  console.error(`Deployment health verification attempt ${attempt}/${attempts} not ready: ${lastError}`);
  if (attempt < attempts) await new Promise(resolve => setTimeout(resolve, delayMs));
}

console.error(`Deployed Atlas health never matched repository release metadata: ${lastError}`);
process.exit(1);
