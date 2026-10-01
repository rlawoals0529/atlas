import expansion8 from "../../data/catalog.2026q3-expansion8.json";
import expansion9 from "../../data/catalog.2026q3-expansion9.json";
import type { KeyboardSwitchProduct } from "./types";

export const extraSwitches = [
  ...(expansion8.switches as unknown as KeyboardSwitchProduct[]),
  ...(expansion9.switches as unknown as KeyboardSwitchProduct[]),
];
