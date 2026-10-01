import { Suspense, lazy } from "react";
import switchExpansion from "../../data/catalog.2026q3-expansion8.json";
import type { KeyboardSwitchProduct } from "../shared/types";
import AtlasConsumer from "./AtlasConsumer";

const SwitchReviewIndex = lazy(() => import("./SwitchReviewIndex"));
const additionalSwitches = switchExpansion.switches as unknown as KeyboardSwitchProduct[];

export default function SwitchesPage() {
  return <AtlasConsumer
    key="switches"
    focusCategory="switch"
    additionalProducts={additionalSwitches}
    afterCatalog={
      <Suspense fallback={<div className="switch-index-inline-loading" role="status">Loading attributed switch review index…</div>}>
        <SwitchReviewIndex />
      </Suspense>
    }
  />;
}
