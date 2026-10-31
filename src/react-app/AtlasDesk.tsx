import { useState } from "react";
import type { CatalogProduct } from "../shared/types";
import { ProductMedia, ProductImageCredit } from "./ProductMedia";
import "./workbench.css";

export default function AtlasDesk({ products, onOpen }: { products: CatalogProduct[]; onOpen: (product: CatalogProduct) => void }) {
  const [index, setIndex] = useState(0);
  const product = products[index % Math.max(1, products.length)];
  return <section className="atlas-desk" aria-label="Atlas discovery desk">
    <div className="desk-intro"><span className="desk-eyebrow">ATLAS / FIELD DESK</span><h2>A closer look.<br/><em>A better fit.</em></h2><p>Browse the objects behind the specs. Open a record, follow its sources, make it yours.</p><div className="desk-counter"><b>{products.length.toString().padStart(2, "0")}</b><span>records in this view<br/>yours to explore</span></div></div>
    <div className="desk-specimen">
      <header><span className="desk-eyebrow">IN FOCUS</span><span>{product ? `${(index % products.length + 1).toString().padStart(2, "0")} / ${products.length}` : "No matches"}</span></header>
      {product ? <><button type="button" className="desk-product-stage" aria-label={`Inspect ${product.brand} ${product.model}`} onClick={() => onOpen(product)}><ProductMedia key={product.id} productId={product.id} fallback={<span>Image unavailable · open record</span>}/></button><div className="desk-specimen-info" aria-live="polite"><div><small>{product.brand} / {product.type}</small><h3>{product.model}</h3></div><button type="button" onClick={() => onOpen(product)}>Inspect record</button></div><ProductImageCredit productId={product.id}/></> : <p>Broaden the catalog filters to bring a product into focus.</p>}
      <footer><span>Source images / original proportions</span><button type="button" aria-label="Previous discovery product" disabled={products.length < 2} onClick={() => setIndex(value => (value - 1 + products.length) % products.length)}>Previous</button><button type="button" aria-label="Next discovery product" disabled={products.length < 2} onClick={() => setIndex(value => (value + 1) % products.length)}>Next</button></footer>
    </div>
    <div className="desk-notes"><a href="#pointing"><small>01 / SHAPE & SURFACE</small><h3>Build around <br/>your hand.</h3><span>Open the setup finder</span></a><a href="#switches"><small>02 / FEEL & FEEDBACK</small><h3>Find your <br/>kind of switch.</h3><span>Explore switches & score sheets</span></a><a href="#sensitivity"><small>03 / MAKE IT FAMILIAR</small><h3>Keep your aim.</h3><span>Convert your sensitivity</span></a></div>
  </section>;
}
