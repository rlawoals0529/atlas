import baseCatalog from "../../data/catalog.json";
import catalog2026Q3 from "../../data/catalog.2026q3.json";
import catalogKeyboards2026Q3 from "../../data/catalog.2026q3-keyboards.json";
import type { KeyboardProduct, KeyboardSwitchProduct, MouseProduct, MousepadProduct, SkateProduct } from "./types";

type CatalogShard = {
  mice?: unknown[];
  mousepads?: unknown[];
  skates?: unknown[];
  keyboards?: unknown[];
  switches?: unknown[];
};

const shards = [baseCatalog, catalog2026Q3, catalogKeyboards2026Q3] as unknown as CatalogShard[];

export const mice = shards.flatMap(shard => shard.mice ?? []) as MouseProduct[];
export const mousepads = shards.flatMap(shard => shard.mousepads ?? []) as MousepadProduct[];
export const skates = shards.flatMap(shard => shard.skates ?? []) as SkateProduct[];
export const keyboards = shards.flatMap(shard => shard.keyboards ?? []) as KeyboardProduct[];
export const switches = shards.flatMap(shard => shard.switches ?? []) as KeyboardSwitchProduct[];
export const pointingCatalog = [...mice, ...mousepads, ...skates];
export const catalog = [...pointingCatalog, ...keyboards, ...switches];
