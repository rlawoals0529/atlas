import { Suspense, lazy } from "react";
import { extraSwitches } from "../shared/switchCatalogExtras";
import AtlasConsumer from "./AtlasConsumer";
import SwitchCatalogStatus from "./SwitchCatalogStatus";
import SwitchRecentAdditions from "./SwitchRecentAdditions";
const SwitchScoreWorkbench = lazy(() => import("./SwitchScoreWorkbench"));

const SwitchReviewIndex = lazy(() => import("./SwitchReviewIndex"));

export default function SwitchesPage() {
  return <AtlasConsumer
    key="switches"
    focusCategory="switch"
    additionalProducts={extraSwitches}
    beforeCatalog={<div className="score-workbench-jump"><a href="#switch-score-workbench" onClick={event => { event.preventDefault(); document.getElementById("switch-score-workbench")?.scrollIntoView({ behavior: "instant" }); }}>Explore ThereminGoat’s three score sheets</a><span>Overall / Hard / Soft · attributed reviewer scores</span></div>}
    afterCatalog={<>
      <div id="switch-score-workbench" style={{ scrollMarginTop: 100 }}><Suspense fallback={<p role="status">Loading ThereminGoat’s score sheets.</p>}><SwitchScoreWorkbench /></Suspense></div>
      <SwitchRecentAdditions />
      <SwitchCatalogStatus />
      <Suspense fallback={<div className="switch-index-inline-loading" role="status">Loading attributed switch review index…</div>}>
        <SwitchReviewIndex />
      </Suspense>
    </>}
  />;
}
