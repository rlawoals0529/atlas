import { loadCatalog } from "./load-catalog.mjs";

const data = loadCatalog();
const products = [...data.mice, ...data.mousepads, ...data.skates, ...data.keyboards, ...data.switches];

const sourceMap = new Map();
for (const product of products) {
  for (const source of product.sources ?? []) {
    if (!source?.url) continue;
    const row = sourceMap.get(source.url) ?? { url: source.url, labels: new Set(), products: new Set(), kind: source.kind };
    row.labels.add(source.label);
    row.products.add(product.id);
    sourceMap.set(source.url, row);
  }
}

const rows = [...sourceMap.values()];
const concurrency = 8;
const timeoutMs = 9000;

async function probe(row) {
  const started = Date.now();
  try {
    const response = await fetch(row.url, {
      method: "GET",
      redirect: "follow",
      headers: {
        "user-agent": "AtlasSourceHealth/0.9 (+https://github.com/rlawoals0529/atlas)",
        "accept": "text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8",
      },
      signal: AbortSignal.timeout(timeoutMs),
    });
    try { await response.body?.cancel(); } catch {}

    let state = "ok";
    if ([401, 403, 405, 429].includes(response.status)) state = "blocked";
    else if ([404, 410].includes(response.status)) state = "broken";
    else if (response.status >= 500) state = "server-error";
    else if (response.status >= 400) state = "warning";

    return {
      ...row,
      state,
      status: response.status,
      finalUrl: response.url,
      durationMs: Date.now() - started,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      ...row,
      state: "unavailable",
      status: null,
      finalUrl: row.url,
      durationMs: Date.now() - started,
      error: message,
    };
  }
}

const results = [];
for (let index = 0; index < rows.length; index += concurrency) {
  const batch = rows.slice(index, index + concurrency);
  results.push(...await Promise.all(batch.map(probe)));
}

const counts = results.reduce((acc, row) => {
  acc[row.state] = (acc[row.state] ?? 0) + 1;
  return acc;
}, {});

const hardBroken = results.filter(row => row.state === "broken");
const noteworthy = results.filter(row => row.state !== "ok");

console.log(`Checked ${results.length} unique source URLs across ${products.length} catalog products.`);
for (const key of ["ok", "blocked", "broken", "server-error", "warning", "unavailable"]) {
  console.log(`${key}: ${counts[key] ?? 0}`);
}

for (const row of noteworthy) {
  const productsText = [...row.products].slice(0, 6).join(", ");
  console.log(`[${row.state}] ${row.status ?? "-"} ${row.url} :: ${productsText}`);
}

if (process.env.GITHUB_STEP_SUMMARY) {
  const fs = await import("node:fs");
  const lines = [
    "## Atlas source health",
    "",
    `Checked **${results.length}** unique cited source URLs across **${products.length}** catalog products.`,
    "",
    "| State | Count |",
    "| --- | ---: |",
    ...["ok", "blocked", "broken", "server-error", "warning", "unavailable"].map(key => `| ${key} | ${counts[key] ?? 0} |`),
    "",
    "Only HTTP 404/410 responses are treated as confirmed broken sources. Authentication blocks, rate limits, server errors and network failures are reported separately.",
  ];
  if (noteworthy.length) {
    lines.push("", "### Needs review", "");
    for (const row of noteworthy.slice(0, 80)) {
      const productsText = [...row.products].slice(0, 4).join(", ");
      lines.push(`- **${row.state}** ${row.status ?? ""} — ${row.url} — ${productsText}`);
    }
  }
  fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, lines.join("\n") + "\n");
}

if (hardBroken.length) {
  console.error(`Confirmed broken source URLs: ${hardBroken.length}`);
  process.exitCode = 1;
}
