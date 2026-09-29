import baseCatalog from "../../data/catalog.json";
import catalog2026Q3 from "../../data/catalog.2026q3.json";
import type { MouseProduct, MousepadProduct, SkateProduct } from "./types";

type CatalogShard = {
  mice: unknown[];
  mousepads: unknown[];
  skates: unknown[];
};

const shards = [baseCatalog, catalog2026Q3] as unknown as CatalogShard[];

export const mice = shards.flatMap(shard => shard.mice) as MouseProduct[];
export const mousepads = shards.flatMap(shard => shard.mousepads) as MousepadProduct[];
export const skates = shards.flatMap(shard => shard.skates) as SkateProduct[];
export const catalog = [...mice, ...mousepads, ...skates];
