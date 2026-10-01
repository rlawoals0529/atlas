import type { CatalogProduct } from "./types";

export type SourceRecencyWindow = "all" | "30d" | "90d" | "older-90d";

export function latestSourceCheck(product: CatalogProduct): string | null {
  const dates = product.sources
    .map(source => source.checkedAt)
    .filter((value): value is string => /^\d{4}-\d{2}-\d{2}$/.test(value))
    .sort();
  return dates.at(-1) ?? null;
}

export function sourceCheckAgeDays(product: CatalogProduct, now = new Date()): number | null {
  const latest = latestSourceCheck(product);
  if (!latest) return null;
  const checked = Date.parse(`${latest}T00:00:00Z`);
  if (!Number.isFinite(checked)) return null;
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return Math.max(0, Math.floor((today - checked) / 86_400_000));
}

export function matchesSourceRecency(product: CatalogProduct, window: SourceRecencyWindow, now = new Date()): boolean {
  if (window === "all") return true;
  const age = sourceCheckAgeDays(product, now);
  if (age == null) return false;
  if (window === "30d") return age <= 30;
  if (window === "90d") return age <= 90;
  return age > 90;
}

export function compareSourceCheck(productA: CatalogProduct, productB: CatalogProduct, direction: "newest" | "oldest") {
  const a = latestSourceCheck(productA);
  const b = latestSourceCheck(productB);
  if (!a && !b) return 0;
  if (!a) return 1;
  if (!b) return -1;
  return direction === "newest" ? b.localeCompare(a) : a.localeCompare(b);
}
