import { extraSwitches } from "../shared/switchCatalogExtras";
import { ProductImageCredit, ProductMedia } from "./ProductMedia";
import "./switch-recent-additions.css";

const recentSwitches = extraSwitches.slice(-8).reverse();

const titleCase = (value: string) => value.replaceAll("-", " ").replace(/\b\w/g, char => char.toUpperCase());

export default function SwitchRecentAdditions() {
  return <section className="switch-recent-additions" aria-labelledby="switch-recent-title">
    <header>
      <div>
        <span>RECENTLY ADDED TO ATLAS</span>
        <h2 id="switch-recent-title">New canonical switch records</h2>
      </div>
      <p>Ordered by Atlas catalog ingestion, not product release date. Each card links back to the manufacturer source used for the record.</p>
    </header>
    <div className="switch-recent-grid">
      {recentSwitches.map(product => {
        const manufacturer = product.sources.find(source => source.kind === "manufacturer") ?? product.sources[0];
        const force = product.specs.actuationForce ?? product.specs.initialForce ?? product.specs.bottomOutForce;
        return <article key={product.id}>
          <div className="switch-recent-media"><ProductMedia productId={product.id}/></div>
          <div className="switch-recent-copy">
            <span>{product.brand} · {titleCase(product.specs.technology)}</span>
            <h3>{product.model}</h3>
            <div><small>{titleCase(product.specs.feel)}</small><small>{force ? `${force.value} ${force.unit}` : "force not published"}</small><small>{product.specs.totalTravelMm} mm travel</small></div>
            {manufacturer && <a href={manufacturer.url} target="_blank" rel="noreferrer">Manufacturer source ↗</a>}
          </div>
          <ProductImageCredit productId={product.id}/>
        </article>;
      })}
    </div>
  </section>;
}
