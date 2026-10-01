import expansion8 from "../../data/catalog.2026q3-expansion8.json";
import expansion9 from "../../data/catalog.2026q3-expansion9.json";
import expansion10 from "../../data/catalog.2026q3-expansion10.json";
import expansion11 from "../../data/catalog.2026q3-expansion11.json";
import expansion12 from "../../data/catalog.2026q3-expansion12.json";
import expansion13 from "../../data/catalog.2026q3-expansion13.json";
import expansion14 from "../../data/catalog.2026q3-expansion14.json";
import expansion15 from "../../data/catalog.2026q3-expansion15.json";
import expansion16 from "../../data/catalog.2026q3-expansion16.json";
import type { KeyboardSwitchProduct } from "./types";

export const extraSwitches = [
  ...(expansion8.switches as unknown as KeyboardSwitchProduct[]),
  ...(expansion9.switches as unknown as KeyboardSwitchProduct[]),
  ...(expansion10.switches as unknown as KeyboardSwitchProduct[]),
  ...(expansion11.switches as unknown as KeyboardSwitchProduct[]),
  ...(expansion12.switches as unknown as KeyboardSwitchProduct[]),
  ...(expansion13.switches as unknown as KeyboardSwitchProduct[]),
  ...(expansion14.switches as unknown as KeyboardSwitchProduct[]),
  ...(expansion15.switches as unknown as KeyboardSwitchProduct[]),
  ...(expansion16.switches as unknown as KeyboardSwitchProduct[]),
];
