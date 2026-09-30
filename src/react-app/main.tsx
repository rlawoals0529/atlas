import { StrictMode, Suspense, lazy, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import AtlasConsumer from "./AtlasConsumer";
import AnalyticsBridge from "./AnalyticsBridge";
import AnalyticsTransport from "./AnalyticsTransport";
import AtlasGlobalNav from "./AtlasGlobalNav";
import { analyticsVisitor, trackAtlasEvent } from "../shared/analytics";
import "./styles.css";
import "./v04.css";
import "./v05.css";
import "./consumer.css";
import "./consumer-compare.css";
import "./product-media.css";
import "./product-lab.css";
import "./product-lab-entry.css";
import "./product-intelligence-extras.css";
import "./analytics-deep-dive.css";
import "./production-analytics.css";
import "./utility-labs.css";
import "./atlas-unified-theme.css";
import "./sensitivity-fixes.css";
import "./atlas-interactions.css";
import "./atlas-ux-refresh.css";
import "./shape-lab-v2.css";

const PointingApp = lazy(() => import("./AppV05"));
const ProductLab = lazy(() => import("./ProductLab"));
const ValidationRunner = lazy(() => import("./ValidationRunner"));
const KeyboardLab = lazy(() => import("./KeyboardLab"));
const SensitivityLab = lazy(() => import("./SensitivityLab"));

function ToolFallback() {
  return <main className="v5-main v5-page">
    <section className="v5-panel" role="status" aria-live="polite">
      <div className="v5-kicker">ATLAS</div>
      <p>Loading tool…</p>
    </section>
  </main>;
}

function RootRouter() {
  const [hash, setHash] = useState(() => window.location.hash);

  useEffect(() => {
    const onHash = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    const key = "atlas.analytics.session-started.v2";
    if (sessionStorage.getItem(key)) return;
    const visitor = analyticsVisitor();
    const recorded = trackAtlasEvent("session_started", { visitNumber: visitor.visitNumber });
    if (recorded) sessionStorage.setItem(key, "1");
  }, []);

  const productLab = hash === "#product-lab";
  const validationRunner = hash === "#validation-run";
  const keyboardLab = hash === "#keyboard-lab";
  const sensitivityLab = hash === "#sensitivity";
  const pointingApp = hash === "#pointing";

  const route = validationRunner ? <ValidationRunner /> : keyboardLab ? <KeyboardLab /> : sensitivityLab ? <SensitivityLab /> : productLab ? <>
    <ProductLab />
    <a className="atlas-validation-run-entry" href="#validation-run" aria-label="Open guided Atlas physical validation runner"><span>RUN</span><b>Physical validation session</b><i>↗</i></a>
  </> : pointingApp ? <>
    <AnalyticsBridge />
    <PointingApp />
  </> : <>
    <AnalyticsBridge />
    <AtlasConsumer />
  </>;

  return <>
    <AnalyticsTransport />
    <AtlasGlobalNav hash={hash}/>
    <Suspense fallback={<ToolFallback />}>{route}</Suspense>
  </>;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode><RootRouter /></StrictMode>,
);
