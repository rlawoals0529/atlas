import { catalogGroups, loadCatalog } from "./load-catalog.mjs";

const data = loadCatalog();
const products = catalogGroups.flatMap((key) => data[key] ?? []);
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
const typeGroup = { mouse: "mice", mousepad: "mousepads", skate: "skates", keyboard: "keyboards", switch: "switches" };

for (const p of products) {
  if (ids.has(p.id)) errors.push(`duplicate id: ${p.id}`); ids.add(p.id);
  if (slugs.has(p.slug)) errors.push(`duplicate slug: ${p.slug}`); slugs.add(p.slug);
  if (!p.brand || !p.model || !p.type) errors.push(`missing identity field: ${p.id}`);
  if (!typeGroup[p.type] || !catalogGroups.includes(typeGroup[p.type])) errors.push(`invalid type: ${p.id}`);

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

  if (p.type === "keyboard") {
    if (!Number.isFinite(p.specs?.maxPollingHz) || p.specs.maxPollingHz <= 0) errors.push(`${p.id}: invalid polling ceiling`);
    if (p.specs?.minActuationMm != null && (!Number.isFinite(p.specs.minActuationMm) || p.specs.minActuationMm < 0)) errors.push(`${p.id}: invalid minimum actuation`);
    if (p.specs?.maxActuationMm != null && (!Number.isFinite(p.specs.maxActuationMm) || p.specs.maxActuationMm <= 0)) errors.push(`${p.id}: invalid maximum actuation`);
    if (p.specs?.minActuationMm != null && p.specs?.maxActuationMm != null && p.specs.minActuationMm > p.specs.maxActuationMm) errors.push(`${p.id}: actuation range is reversed`);
    if (p.specs?.dimensionsMm && (p.specs.dimensionsMm.width <= 0 || p.specs.dimensionsMm.depth <= 0 || (p.specs.dimensionsMm.height != null && p.specs.dimensionsMm.height <= 0))) errors.push(`${p.id}: invalid keyboard dimensions`);
    if (p.specs?.weightG != null && p.specs.weightG <= 0) errors.push(`${p.id}: invalid keyboard weight`);
  }

  if (p.type === "switch") {
    if (!Number.isFinite(p.specs?.totalTravelMm) || p.specs.totalTravelMm <= 0 || p.specs.totalTravelMm > 10) errors.push(`${p.id}: invalid switch total travel`);
    for (const key of ["initialForce", "actuationForce", "bottomOutForce"]) {
      const point = p.specs?.[key];
      if (point && (!Number.isFinite(point.value) || point.value <= 0 || !["gf", "cN"].includes(point.unit))) errors.push(`${p.id}.${key}: invalid force point`);
    }
    if (p.specs?.preTravelMm != null && (p.specs.preTravelMm < 0 || p.specs.preTravelMm > p.specs.totalTravelMm)) errors.push(`${p.id}: invalid switch pre-travel`);
    if (p.specs?.ratedKeystrokesM != null && p.specs.ratedKeystrokesM <= 0) errors.push(`${p.id}: invalid switch lifetime`);

    if (p.status === "current") {
      if (!(p.sources ?? []).some(source => source.kind === "manufacturer")) errors.push(`${p.id}: current switch requires a manufacturer source`);
      if (!p.specs?.initialForce && !p.specs?.actuationForce && !p.specs?.bottomOutForce) errors.push(`${p.id}: current switch requires at least one published force point`);
      if (["hall-effect", "tmr"].includes(p.specs?.technology) && !(p.specs?.compatibility?.length)) errors.push(`${p.id}: magnetic switch requires a board-compatibility note`);
    }
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
const counts = catalogGroups.map(group => `${data[group].length} ${group}`).join(", ");
console.log(`Validated ${products.length} products (${counts}) across ${data.shards.length} catalog shards and ${sourceDefs.size} source definitions.`);
