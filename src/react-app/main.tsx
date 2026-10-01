import { StrictMode, Suspense, lazy, startTransition, useEffect, useState } from "react";
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
import "./atlas-readability.css";
import "./atlas-polish.css";
import "./catalog-pages.css";

const loadPointing = () => import("./AppV05");
const loadProductLab = () => import("./ProductLab");
const loadValidationRunner = () => import("./ValidationRunner");
const loadKeyboardLab = () => import("./KeyboardLab");
const loadSensitivityLab = () => import("./SensitivityLab");
const loadSwitchReviewIndex = () => import("./SwitchReviewIndex");

const PointingApp = lazy(loadPointing);
const ProductLab = lazy(loadProductLab);
const ValidationRunner = lazy(loadValidationRunner);
const KeyboardLab = lazy(loadKeyboardLab);
const SensitivityLab = lazy(loadSensitivityLab);
const SwitchReviewIndex = lazy(loadSwitchReviewIndex);

const preloadRoute = (href: string) => {
  if (href === "#pointing") void loadPointing();
  else if (href === "#keyboard-lab") void loadKeyboardLab();
  else if (href === "#sensitivity") void loadSensitivityLab();
  else if (href === "#product-lab") void loadProductLab();
  else if (href === "#validation-run") void loadValidationRunner();
  else if (href === "#switches") void loadSwitchReviewIndex();
};

function ToolFallback({ hash }: { hash: string }) {
  const label = hash === "#keyboard-lab" ? "Keyboard Lab" : hash === "#sensitivity" ? "Sensitivity Lab" : hash === "#product-lab" ? "Research" : hash === "#validation-run" ? "Validation" : "Setup";
  return <main className="atlas-route-loading" role="status" aria-live="polite" aria-label={`Loading ${label}`}>
    <div className="atlas-route-loading-head"><span>Atlas</span><b>{label}</b></div>
    <div className="atlas-route-loading-grid">
      <div className="atlas-loading-block large"><i/><i/><i/></div>
      <div className="atlas-loading-stack"><div className="atlas-loading-block"><i/><i/></div><div className="atlas-loading-block"><i/><i/><i/></div></div>
    </div>
  </main>;
}

function RootRouter() {
  const [hash, setHash] = useState(() => window.location.hash);

  useEffect(() => {
    const onHash = () => startTransition(() => setHash(window.location.hash));
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
  const mousepadsPage = hash === "#mousepads";
  const switchesPage = hash === "#switches";

  const route = validationRunner ? <ValidationRunner /> : keyboardLab ? <KeyboardLab /> : sensitivityLab ? <SensitivityLab /> : mousepadsPage ? <AtlasConsumer key="mousepads" focusCategory="mousepad" /> : switchesPage ? <AtlasConsumer key="switches" focusCategory="switch" afterCatalog={<Suspense fallback={<div className="switch-index-inline-loading" role="status">Loading attributed switch review index…</div>}><SwitchReviewIndex /></Suspense>} /> : productLab ? <>
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
    <AtlasGlobalNav hash={hash} onPreload={preloadRoute}/>
    <Suspense fallback={<ToolFallback hash={hash} />}>{route}</Suspense>
  </>;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode><RootRouter /></StrictMode>,
);
