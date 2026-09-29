import baseCatalog from "../../data/catalog.json";
import catalog2026Q3 from "../../data/catalog.2026q3.json";
import type { MouseProduct, MousepadProduct, SkateProduct } from "./types";

const shards = [baseCatalog, catalog2026Q3];

export const mice = shards.flatMap(shard => shard.mice ?? []) as unknown as MouseProduct[];
export const mousepads = shards.flatMap(shard => shard.mousepads ?? []) as unknown as MousepadProduct[];
export const skates = shards.flatMap(shard => shard.skates ?? []) as unknown as SkateProduct[];
export const catalog = [...mice, ...mousepads, ...skates];
