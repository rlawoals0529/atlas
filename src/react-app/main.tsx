import { StrictMode, Suspense, lazy, useEffect, useState, useTransition } from "react";
import { createRoot } from "react-dom/client";
import AtlasConsumer from "./AtlasConsumer";
import AnalyticsBridge from "./AnalyticsBridge";
import AnalyticsTransport from "./AnalyticsTransport";
import AtlasGlobalNav from "./AtlasGlobalNav";
import { analyticsVisitor, trackAtlasEvent } from "../shared/analytics";
import "./atlas-base.css";
import "./consumer.css";
import "./consumer-compare.css";
import "./product-media.css";
import "./atlas-unified-theme.css";
import "./atlas-interactions.css";
import "./atlas-ux-refresh.css";
import "./atlas-readability.css";
import "./atlas-polish.css";
import "./catalog-pages.css";

const loadPointing = () => import("./AppV05");
const loadProductLab = () => import("./ProductLab");
const loadValidationRunner = () => import("./ValidationRunner");
const loadKeyboardLab = () => import("./KeyboardLab");
const loadSensitivityLab = () => import("./SensitivityLab");
const loadSwitchesPage = () => import("./SwitchesPage");

const PointingApp = lazy(loadPointing);
const ProductLab = lazy(loadProductLab);
const ValidationRunner = lazy(loadValidationRunner);
const KeyboardLab = lazy(loadKeyboardLab);
const SensitivityLab = lazy(loadSensitivityLab);
const SwitchesPage = lazy(loadSwitchesPage);

const routeLabel = (hash: string) => hash === "#keyboards" ? "Keyboards" : hash === "#keyboard-lab" ? "Keyboard Lab" : hash === "#sensitivity" ? "Sensitivity Lab" : hash === "#product-lab" ? "Research" : hash === "#validation-run" ? "Validation" : hash === "#mousepads" ? "Mousepads" : hash === "#switches" ? "Switches" : hash === "#pointing" ? "Setup" : "Browse";

const preloadRoute = (href: string) => {
  if (href === "#pointing") void loadPointing();
  else if (href === "#keyboard-lab") void loadKeyboardLab();
  else if (href === "#sensitivity") void loadSensitivityLab();
  else if (href === "#product-lab") void loadProductLab();
  else if (href === "#validation-run") void loadValidationRunner();
  else if (href === "#switches") void loadSwitchesPage();
};

function ToolFallback({ hash }: { hash: string }) {
  const label = routeLabel(hash);
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
  const [isRoutePending, startRouteTransition] = useTransition();
  const [pendingHash, setPendingHash] = useState<string | null>(null);
  const [showRouteProgress, setShowRouteProgress] = useState(false);
  const [showRouteStatus, setShowRouteStatus] = useState(false);

  useEffect(() => {
    const onHash = () => {
      const nextHash = window.location.hash;
      setPendingHash(nextHash);
      preloadRoute(nextHash);
      startRouteTransition(() => setHash(nextHash));
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    if (!isRoutePending) {
      setShowRouteProgress(false);
      setShowRouteStatus(false);
      setPendingHash(null);
      return;
    }
    const progressTimer = window.setTimeout(() => setShowRouteProgress(true), 180);
    const statusTimer = window.setTimeout(() => setShowRouteStatus(true), 850);
    return () => {
      window.clearTimeout(progressTimer);
      window.clearTimeout(statusTimer);
    };
  }, [isRoutePending]);

  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    const slowConnection = connection?.saveData || connection?.effectiveType === "slow-2g" || connection?.effectiveType === "2g" || connection?.effectiveType === "3g";
    if (slowConnection) return;

    const preloadCommonRoutes = () => {
      void loadPointing();
      void loadKeyboardLab();
      void loadSensitivityLab();
      void loadSwitchesPage();
      void loadProductLab();
    };
    const idleWindow = window as Window & {
      requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
      cancelIdleCallback?: (handle: number) => void;
    };
    if (typeof idleWindow.requestIdleCallback === "function") {
      const id = idleWindow.requestIdleCallback(preloadCommonRoutes, { timeout: 2200 });
      return () => idleWindow.cancelIdleCallback?.(id);
    }
    const id = globalThis.setTimeout(preloadCommonRoutes, 1400);
    return () => globalThis.clearTimeout(id);
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
  const keyboardsPage = hash === "#keyboards";
  const keyboardLab = hash === "#keyboard-lab";
  const sensitivityLab = hash === "#sensitivity";
  const pointingApp = hash === "#pointing";
  const mousepadsPage = hash === "#mousepads";
  const switchesPage = hash === "#switches";

  const route = validationRunner ? <ValidationRunner /> : keyboardLab ? <KeyboardLab /> : sensitivityLab ? <SensitivityLab /> : keyboardsPage ? <AtlasConsumer key="keyboards" focusCategory="keyboard" /> : mousepadsPage ? <AtlasConsumer key="mousepads" focusCategory="mousepad" /> : switchesPage ? <SwitchesPage /> : productLab ? <>
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
    <a className="atlas-skip-link" href="#atlas-route-content" onClick={event => {
      event.preventDefault();
      document.getElementById("atlas-route-content")?.focus({ preventScroll: false });
    }}>Skip to main content</a>
    <AtlasGlobalNav hash={hash} onPreload={preloadRoute}/>
    <div className={`atlas-route-progress ${showRouteProgress ? "visible" : ""}`} aria-hidden="true"><i/></div>
    {showRouteStatus && pendingHash && <div className="atlas-route-status" role="status" aria-live="polite"><i/><div><b>Opening {routeLabel(pendingHash)}</b><span>Keeping this page available while the next view finishes loading.</span></div></div>}
    <div id="atlas-route-content" className="atlas-route-host" tabIndex={-1}>
      <Suspense fallback={<ToolFallback hash={hash} />}>{route}</Suspense>
    </div>
  </>;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode><RootRouter /></StrictMode>,
);
