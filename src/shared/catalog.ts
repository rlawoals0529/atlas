import rawCatalog from "../../data/catalog.json";
import type { MouseProduct, MousepadProduct, SkateProduct } from "./types";

export const mice = rawCatalog.mice as unknown as MouseProduct[];
export const mousepads = rawCatalog.mousepads as unknown as MousepadProduct[];
export const skates = rawCatalog.skates as unknown as SkateProduct[];
export const catalog = [...mice, ...mousepads, ...skates];
