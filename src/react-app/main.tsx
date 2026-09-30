import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import App from "./AppV05";
import ProductLab from "./ProductLab";
import ValidationRunner from "./ValidationRunner";
import KeyboardLab from "./KeyboardLab";
import SensitivityLab from "./SensitivityLab";
import AnalyticsBridge from "./AnalyticsBridge";
import AnalyticsTransport from "./AnalyticsTransport";
import { analyticsVisitor, trackAtlasEvent } from "../shared/analytics";
import "./styles.css";
import "./v04.css";
import "./v05.css";
import "./product-lab.css";
import "./product-lab-entry.css";
import "./product-intelligence-extras.css";
import "./analytics-deep-dive.css";
import "./production-analytics.css";
import "./utility-labs.css";

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

  return <>
    <AnalyticsTransport />
    {validationRunner ? <ValidationRunner /> : keyboardLab ? <KeyboardLab /> : sensitivityLab ? <SensitivityLab /> : productLab ? <>
      <ProductLab />
      <a className="atlas-validation-run-entry" href="#validation-run" aria-label="Open guided Atlas physical validation runner"><span>RUN</span><b>Physical validation session</b><i>↗</i></a>
    </> : <>
      <AnalyticsBridge />
      <App />
      <div className="atlas-utility-dock" aria-label="Atlas labs">
        <a href="#keyboard-lab"><span>KEY</span><b>Keyboard lab</b><i>↗</i></a>
        <a href="#sensitivity"><span>SENS</span><b>Sensitivity lab</b><i>↗</i></a>
        <a href="#product-lab"><span>LAB</span><b>Product research & validation</b><i>↗</i></a>
      </div>
    </>}
  </>;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode><RootRouter /></StrictMode>,
);
