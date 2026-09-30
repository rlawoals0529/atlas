import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import App from "./AppV05";
import ProductLab from "./ProductLab";
import AnalyticsBridge from "./AnalyticsBridge";
import AnalyticsTransport from "./AnalyticsTransport";
import { analyticsVisitor, trackAtlasEvent } from "../shared/analytics";
import "./styles.css";
import "./v04.css";
import "./v05.css";
import "./product-lab.css";
import "./product-lab-entry.css";
import "./product-intelligence-extras.css";

function RootRouter() {
  const [hash, setHash] = useState(() => window.location.hash);

  useEffect(() => {
    const onHash = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    const key = "atlas.analytics.session-started.v1";
    if (sessionStorage.getItem(key)) return;
    const visitor = analyticsVisitor();
    trackAtlasEvent("session_started", { visitNumber: visitor.visitNumber });
    sessionStorage.setItem(key, "1");
  }, []);

  return <>
    <AnalyticsTransport />
    {hash === "#product-lab" ? <ProductLab /> : <>
      <AnalyticsBridge />
      <App />
      <a className="atlas-product-lab-entry" href="#product-lab" aria-label="Open Atlas Product Lab"><span>LAB</span><b>Product research & validation</b><i>↗</i></a>
    </>}
  </>;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode><RootRouter /></StrictMode>,
);
