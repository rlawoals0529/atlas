import { Suspense, lazy } from "react";
import { extraSwitches } from "../shared/switchCatalogExtras";
import AtlasConsumer from "./AtlasConsumer";
import SwitchCatalogStatus from "./SwitchCatalogStatus";

const SwitchReviewIndex = lazy(() => import("./SwitchReviewIndex"));

export default function SwitchesPage() {
  return <AtlasConsumer
    key="switches"
    focusCategory="switch"
    additionalProducts={extraSwitches}
    afterCatalog={<>
      <SwitchCatalogStatus />
      <Suspense fallback={<div className="switch-index-inline-loading" role="status">Loading attributed switch review index…</div>}>
        <SwitchReviewIndex />
      </Suspense>
    </>}
  />;
}
