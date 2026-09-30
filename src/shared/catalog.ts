import baseCatalog from "../../data/catalog.json";
import catalog2026Q3 from "../../data/catalog.2026q3.json";
import catalogKeyboards2026Q3 from "../../data/catalog.2026q3-keyboards.json";
import catalogExpansion2026Q3 from "../../data/catalog.2026q3-expansion.json";
import catalogExpansion22026Q3 from "../../data/catalog.2026q3-expansion2.json";
import type { KeyboardProduct, KeyboardSwitchProduct, MouseProduct, MousepadProduct, SkateProduct } from "./types";

type CatalogShard = {
  mice?: unknown[];
  mousepads?: unknown[];
  skates?: unknown[];
  keyboards?: unknown[];
  switches?: unknown[];
};

const shards = [baseCatalog, catalog2026Q3, catalogKeyboards2026Q3, catalogExpansion2026Q3, catalogExpansion22026Q3] as unknown as CatalogShard[];

export const mice = shards.flatMap(shard => shard.mice ?? []) as MouseProduct[];
export const mousepads = shards.flatMap(shard => shard.mousepads ?? []) as MousepadProduct[];
export const skates = shards.flatMap(shard => shard.skates ?? []) as SkateProduct[];
export const keyboards = shards.flatMap(shard => shard.keyboards ?? []) as KeyboardProduct[];
export const switches = shards.flatMap(shard => shard.switches ?? []) as KeyboardSwitchProduct[];

// Backward-compatible pointing-device catalog used by the existing consumer recommender.
export const catalog = [...mice, ...mousepads, ...skates];
export const pointingCatalog = catalog;

// Full Atlas catalog for generic search, provenance and category utilities.
export const allCatalog = [...catalog, ...keyboards, ...switches];