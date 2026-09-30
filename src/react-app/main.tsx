import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import RootRouter from "./RootRouter";
import "./styles.css";
import "./v04.css";
import "./v05.css";
import "./product-lab.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode><RootRouter /></StrictMode>,
);
