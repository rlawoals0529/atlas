import { useEffect, useState } from "react";
import App from "./AppV05";
import ProductLab from "./ProductLab";

const routeFromHash = () => window.location.hash === "#lab" ? "lab" : "app";

function RootRouter() {
  const [route, setRoute] = useState<"app" | "lab">(routeFromHash);

  useEffect(() => {
    const onHashChange = () => setRoute(routeFromHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  if (route === "lab") return <ProductLab />;

  return <>
    <App />
    <a className="pv-launch" href="#lab" aria-label="Open product intelligence and system validation research lab">
      <span>RESEARCH LAB</span>
      <b>Product intelligence + validation</b>
    </a>
  </>;
}

export default RootRouter;
