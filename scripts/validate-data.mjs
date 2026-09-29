import fs from "node:fs";

const data = JSON.parse(fs.readFileSync(new URL("../data/catalog.json", import.meta.url), "utf8"));
const groups = ["mice", "mousepads", "skates"];
const products = groups.flatMap((key) => data[key] ?? []);
const errors = [];
const ids = new Set();
const slugs = new Set();
const sourceDefs = new Map();
const scoreKeys = new Set([
  "staticSpeed","dynamicSpeed","stoppingPower","texture","pressureResponse","humidityResistance","sleeveCompatibility","xyConsistency","noise","skinDrag","breakInChange","wornZoneStability","cleaningRecovery",
  "speed","control","durability","freshSpeed","brokenInSpeed","wearRate","dustSensitivity",
  "coatingDry","coatingSweaty","clickLightness","clickCrispness","wheelTactility","liftSecurity","palmSupport",
  "humpFullness","rearFlare","frontFlare","sideTaper","sideWallAngle","buttonHeight","pinkyClearance"
]);
const gameKeys = ["tactical-fps","tracking-fps","arena-fps","battle-royale","moba-rts","mmo","action","mixed"];

for (const p of products) {
  if (ids.has(p.id)) errors.push(`duplicate id: ${p.id}`); ids.add(p.id);
  if (slugs.has(p.slug)) errors.push(`duplicate slug: ${p.slug}`); slugs.add(p.slug);
  if (!p.brand || !p.model || !p.type) errors.push(`missing identity field: ${p.id}`);
  if (!groups.includes(p.type === "mouse" ? "mice" : p.type === "mousepad" ? "mousepads" : "skates")) errors.push(`invalid type: ${p.id}`);

  for (const s of p.sources ?? []) {
    if (!s.id || !s.label || !s.url || !s.kind || !s.checkedAt) errors.push(`${p.id}: incomplete source definition`);
    const signature = JSON.stringify(s);
    const previous = sourceDefs.get(s.id);
    if (previous && previous !== signature) errors.push(`source id conflict: ${s.id}`);
    sourceDefs.set(s.id, signature);
  }

  const sourceIds = new Set((p.sources ?? []).map((s) => s.id));
  for (const [section, evidence] of Object.entries(p.evidence ?? {})) {
    if (!evidence?.confidence) errors.push(`${p.id}.${section}: missing confidence`);
    for (const sid of evidence?.sourceIds ?? []) if (!sourceIds.has(sid)) errors.push(`${p.id}.${section}: missing source ${sid}`);
  }

  const walk = (obj, path = p.id) => {
    if (!obj || typeof obj !== "object") return;
    for (const [k,v] of Object.entries(obj)) {
      if (typeof v === "number" && scoreKeys.has(k) && (v < 0 || v > 100)) errors.push(`${path}.${k}: score ${v} outside 0..100`);
      else if (v && typeof v === "object") walk(v, `${path}.${k}`);
    }
  };
  walk(p);

  if (p.type === "mouse") {
    for (const [k,v] of Object.entries(p.fit?.grip ?? {})) if (typeof v !== "number" || v < 0 || v > 100) errors.push(`${p.id}.fit.grip.${k}: invalid score`);
    for (const [k,v] of Object.entries(p.fit?.aimStyle ?? {})) if (typeof v !== "number" || v < 0 || v > 100) errors.push(`${p.id}.fit.aimStyle.${k}: invalid score`);
    const games = p.fit?.gameStyle ?? {};
    const hasLegacy = typeof games.tactical === "number" || typeof games.tracking === "number" || typeof games.mixed === "number";
    if (!hasLegacy) for (const k of gameKeys) if (typeof games[k] !== "number") errors.push(`${p.id}.fit.gameStyle.${k}: missing score`);
    for (const [k,v] of Object.entries(games)) if (typeof v !== "number" || v < 0 || v > 100) errors.push(`${p.id}.fit.gameStyle.${k}: invalid score`);
    if (p.specs.weightG <= 0 || p.specs.lengthMm <= 0 || p.specs.widthMm <= 0 || p.specs.heightMm <= 0) errors.push(`${p.id}: impossible physical dimensions`);
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`Validated ${products.length} products (${data.mice.length} mice, ${data.mousepads.length} pads, ${data.skates.length} skates) and ${sourceDefs.size} source definitions.`);
