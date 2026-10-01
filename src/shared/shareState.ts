const SAFE_PRODUCT_ID = /^[a-z0-9-]{1,120}$/i;

export function parseSharedCompareIds(value: string | null | undefined) {
  if (!value) return [] as string[];
  const seen = new Set<string>();
  const ids: string[] = [];
  for (const raw of value.split(",")) {
    const id = raw.trim();
    if (!SAFE_PRODUCT_ID.test(id) || seen.has(id)) continue;
    seen.add(id);
    ids.push(id);
    if (ids.length === 4) break;
  }
  return ids;
}

export function serializeSharedCompareIds(ids: readonly string[]) {
  return parseSharedCompareIds(ids.join(",")).join(",");
}
