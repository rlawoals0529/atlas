import type { CatalogProduct, Confidence, SourceKind } from "./types";

export const sourceKindMeta: Record<SourceKind, { short: string; label: string; description: string }> = {
  manufacturer: { short: "M", label: "Manufacturer", description: "Official specifications, manuals, compatibility and product claims." },
  independent: { short: "I", label: "Independent", description: "Third-party measurements, controlled reviews and dimensional cross-checks." },
  community: { short: "C", label: "Community", description: "Long-term owner observations, wear reports and uncommon combinations." },
  editorial: { short: "A", label: "Atlas model", description: "Derived fit, geometry or feel inference. Never presented as a direct measurement." },
};

export const confidenceWeight: Record<Confidence, number> = { high: 1, medium: 0.66, low: 0.33 };

export interface ProductFamily {
  id: string;
  label: string;
  memberIds: string[];
  relationship: string;
}

export const productFamilies: ProductFamily[] = [
  {
    id: "razer-viper-pro",
    label: "Razer Viper Pro line",
    memberIds: ["mouse-viper-v3-pro-se", "mouse-viper-v3-pro", "mouse-viper-v4-pro"],
    relationship: "Razer states the Viper V3 Pro SE, V3 Pro and V4 Pro share the exact mouse shape. Atlas therefore preserves one manufacturer-confirmed shell relationship while keeping weight, sensor, switches, polling hardware and battery implementation separate.",
  },
  {
    id: "logitech-pro-x",
    label: "Logitech G PRO X line",
    memberIds: ["mouse-gpx2", "mouse-superlight-2c", "mouse-gpx2-dex", "mouse-pro-x2-superstrike"],
    relationship: "Related PRO X performance family spanning neutral, compact, right-handed and alternative click implementations.",
  },
  {
    id: "endgame-op1",
    label: "Endgame Gear OP1 line",
    memberIds: ["mouse-op1w-4k-v2", "mouse-op1-8k-v2"],
    relationship: "Shared narrow-shape design language with wireless and wired high-polling variants.",
  },
  {
    id: "zowie-dw",
    label: "ZOWIE DW competitive line",
    memberIds: ["mouse-u2-dw", "mouse-ec2-dw", "mouse-zowie-fk2-dw", "mouse-zowie-s2-dw", "mouse-zowie-za13-dw"],
    relationship: "Driverless competitive wireless family. The shell families are intentionally different; this grouping is for platform/revision context, not shape equivalence.",
  },
  {
    id: "pulsar-current",
    label: "Pulsar current performance line",
    memberIds: ["mouse-x2-crazylight-mini", "mouse-x2h-crazylight-medium", "mouse-pulsar-xlite-v4", "mouse-pulsar-x3"],
    relationship: "Current Pulsar performance mice covering low/rear-hump symmetrical and ergonomic families.",
  },
  {
    id: "artisan-fx",
    label: "ARTISAN NINJA FX surfaces",
    memberIds: ["pad-artisan-zero-xsoft", "pad-artisan-zero-soft", "pad-artisan-type99-soft", "pad-artisan-hien-soft", "pad-artisan-hayate-otsu-v2-soft", "pad-artisan-raiden-mid"],
    relationship: "Surface family spanning control through speed. Firmness and weave are treated as separate behavior inputs.",
  },
  {
    id: "razer-gigantus-v2-pro",
    label: "Razer Gigantus V2 Pro speed system",
    memberIds: ["pad-razer-gigantus-v2-pro-max-control", "pad-razer-gigantus-v2-pro-control", "pad-razer-gigantus-v2-pro-balance", "pad-razer-gigantus-v2-pro-speed", "pad-razer-gigantus-v2-pro-max-speed"],
    relationship: "One manufacturer-defined five-grade surface system: Max Control, Control, Balance, Speed and Max Speed. Atlas preserves Razer's ordering but labels its 0–100 glide/stopping values as normalized interpolation rather than measured friction.",
  },
  {
    id: "xray-skates",
    label: "X-Raypad skate families",
    memberIds: ["skate-jade-air-dots", "skate-obsidian-air-dots", "skate-xray-titanium-u9-dots", "skate-xray-obsidian-ultra-dots", "skate-xray-jade-ultra-dots"],
    relationship: "Material and construction variants intended to change speed, control, wear and surface compatibility.",
  },
];

export function familyFor(productId: string) {
  return productFamilies.find(family => family.memberIds.includes(productId));
}

export function evidenceHealth(product: CatalogProduct) {
  const evidence = Object.values(product.evidence ?? {});
  const sourceKinds = new Set(product.sources.map(source => source.kind));
  const confidence = evidence.length
    ? evidence.reduce((sum, item) => sum + confidenceWeight[item.confidence], 0) / evidence.length
    : 0;
  const sourceDiversity = sourceKinds.size / 4;
  const nonEditorial = product.sources.filter(source => source.kind !== "editorial").length;
  const score = Math.round(Math.min(100, confidence * 72 + Math.min(1, nonEditorial / 2) * 18 + sourceDiversity * 10));
  const label = score >= 82 ? "Strong" : score >= 64 ? "Good" : score >= 45 ? "Developing" : "Sparse";
  return { score, label, sourceKinds: [...sourceKinds], evidenceCount: evidence.length, sourceCount: product.sources.length };
}

export function evidenceRows(product: CatalogProduct) {
  return Object.entries(product.evidence ?? {}).map(([field, note]) => ({
    field,
    confidence: note.confidence,
    note: note.note,
    sources: product.sources.filter(source => note.sourceIds.includes(source.id)),
  }));
}

export function productSearchText(product: CatalogProduct) {
  const family = familyFor(product.id);
  return [
    product.brand,
    product.model,
    product.summary,
    product.status,
    product.type,
    ...(product.tags ?? []),
    family?.label ?? "",
    ...product.sources.map(source => `${source.label} ${source.kind}`),
  ].join(" ").toLowerCase();
}
