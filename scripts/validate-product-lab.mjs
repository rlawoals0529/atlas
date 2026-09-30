import fs from "node:fs";

const read = path => fs.readFileSync(path, "utf8");
const assert = (condition, message) => {
  if (!condition) {
    console.error(`Product Lab integrity check failed: ${message}`);
    process.exitCode = 1;
  }
};

const app = read("src/react-app/AppV05.tsx");
const lab = read("src/react-app/ProductLab.tsx");
const validation = read("src/shared/validation.ts");
const analytics = read("src/shared/analytics.ts");
const transport = read("src/react-app/AnalyticsTransport.tsx");
const workerAnalytics = read("src/worker/analytics.ts");
const wrangler = read("wrangler.jsonc");

assert(!app.includes("INPUT ATLAS"), "consumer UI must use Atlas branding only");
assert(app.includes('const VERSION = "0.8"'), "consumer version must match v0.8");
assert(app.includes('href="#product-lab"'), "Product Lab must remain reachable from consumer navigation");

assert(validation.includes('status: "not-run"'), "generated validation cases must initialize NOT RUN");
assert(!/status:\s*["']pass["']/.test(validation), "validation generator must not fabricate PASS results");
assert(lab.includes("PLANNED / NOT RUN"), "Validation Lab must visibly label generated cases as not run");
assert(lab.includes("actualResult"), "manual execution must retain an actual-result field");
assert(lab.includes("reproductionSteps"), "defect workflow must retain reproduction steps");
assert(lab.includes("suspectedLayer"), "defect workflow must preserve suspected-layer uncertainty field");
assert(lab.includes("regressionTestId"), "defect workflow must support regression linkage");

assert(analytics.includes('DEMO_ANALYTICS_EVENTS'), "dashboard demo fixtures must remain explicit");
assert(analytics.includes('eventId: `demo-'), "synthetic events must keep a recognizable demo prefix");
assert(transport.includes('eventId.startsWith("demo-")'), "production transport must reject demo fixture events");
assert(workerAnalytics.includes("Invalid analytics event batch"), "production collector must validate event batches server-side");
assert(workerAnalytics.includes("MAX_BODY_BYTES"), "production collector must retain request-size bounds");
assert(workerAnalytics.includes("Too many analytics requests"), "production collector must retain rate limiting");

assert(lab.includes("DEMO / SYNTHETIC"), "analytics dashboard must visibly label synthetic data");
assert(lab.includes("REAL / THIS BROWSER"), "browser-local analytics must remain explicitly scoped");
assert(lab.includes("ProductIntelligenceExtras"), "direct competitor and brand-positioning analysis must stay in Product Intelligence");
assert(lab.includes("Sparse in Atlas ≠ market opportunity"), "sparse catalog segments must retain opportunity caveat");

assert(!/"ANALYTICS_DB"\s*:/.test(wrangler), "optional analytics must not gain a fake/unconfigured D1 binding");

if (!process.exitCode) console.log("Product Lab integrity checks passed.");
