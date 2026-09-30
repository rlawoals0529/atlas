import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./AppV05";
import { installAtlasAnalytics } from "./analytics";
import "./styles.css";
import "./v04.css";
import "./v05.css";

const uninstallAnalytics = installAtlasAnalytics();
window.addEventListener("pagehide", uninstallAnalytics, { once: true });

createRoot(document.getElementById("root")!).render(
  <StrictMode><App /></StrictMode>,
);
