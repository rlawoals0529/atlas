import fs from "node:fs";
import { catalogGroups, loadCatalog } from "./load-catalog.mjs";

const catalog = loadCatalog();
const esc = (v) => String(v).replaceAll("'", "''");
const products = catalogGroups.flatMap(group => catalog[group]);
const sourceMap = new Map();
for (const p of products) for (const s of p.sources) sourceMap.set(s.id, s);
let sql = "BEGIN TRANSACTION;\n";
for (const s of sourceMap.values()) sql += `INSERT OR REPLACE INTO sources(id,label,url,kind,checked_at) VALUES('${esc(s.id)}','${esc(s.label)}','${esc(s.url)}','${esc(s.kind)}','${esc(s.checkedAt)}');\n`;
for (const p of products) {
  sql += `INSERT OR REPLACE INTO products(id,slug,type,brand,model,status,msrp_usd,summary,payload_json) VALUES('${esc(p.id)}','${esc(p.slug)}','${esc(p.type)}','${esc(p.brand)}','${esc(p.model)}','${esc(p.status)}',${p.msrpUsd ?? "NULL"},'${esc(p.summary)}','${esc(JSON.stringify(p))}');\n`;
  for (const s of p.sources) sql += `INSERT OR REPLACE INTO product_sources(product_id,source_id) VALUES('${esc(p.id)}','${esc(s.id)}');\n`;
}
sql += "COMMIT;\n";
const output = new URL("../generated/catalog-seed.sql", import.meta.url);
fs.mkdirSync(new URL("../generated/", import.meta.url), { recursive: true });
fs.writeFileSync(output, sql);
console.log(`Wrote ${products.length} products and ${sourceMap.size} unique sources from ${catalog.shards.length} catalog shards to generated/catalog-seed.sql.`);
