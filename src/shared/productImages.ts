export type ProductImage = {
  url: string;
  sourceUrl: string;
  alt: string;
  credit: string;
};

// Presentation-only media registry. Canonical product specifications remain in catalog shards.
// Remote manufacturer assets are intentionally allowed to fail gracefully in the UI.
export const productImages: Record<string, ProductImage> = {
  "mouse-wallhack-m001": {
    url: "https://wallhack.com/cdn/shop/t/68/assets/wh-m001-hero.avif?v=138427762620322925981789136467",
    sourceUrl: "https://wallhack.com/en-fr/pages/campaigns/m-001",
    alt: "WALLHACK M-001 gaming mouse viewed from above",
    credit: "WALLHACK official product image",
  },
  "mouse-pro-x2-superstrike": {
    url: "https://resource.logitechg.com/w_544%2Ch_466%2Car_7%3A6%2Cc_pad%2Cq_auto%2Cf_auto%2Cdpr_1.0/d_transparent.gif/content/dam/gaming/en/products/pro-x2-superstrike-pdp/2026/pro-x2-superstrike-top-angle-lifestyle-gallery-2.png",
    sourceUrl: "https://www.logitechg.com/en-us/shop/p/pro-x2-superstrike-mouse.910-007700",
    alt: "Logitech G PRO X2 SUPERSTRIKE gaming mouse",
    credit: "Logitech G official product image",
  },
  "keyboard-wooting-60he-v2": {
    url: "https://wooting.io/_next/image?q=90&url=https%3A%2F%2Fwooting-website.ams3.cdn.digitaloceanspaces.com%2Fproducts%2Fkeyboards%2F60HEv2%2F60he-v2_og-and-split.webp&w=3840",
    sourceUrl: "https://wooting.io/wooting-60he-v2",
    alt: "Wooting 60HE v2 regular and split-spacebar keyboards",
    credit: "Wooting official product image",
  },
  "switch-gateron-magnetic-jade-pro": {
    url: "https://ueeshop.ly200-cdn.com/u_file/UPAW/UPAW819/2512/30/products/gateron-magnetic-jade-pro-switch-magnetic-hallsensor-switch-mechanical-keyboard-wooting.webp?x-oss-process=image%2Fresize%2Cm_lfit%2Ch_1000%2Cw_1000%2Fquality%2Cq_100",
    sourceUrl: "https://www.gateron.com/products/gateron-magnetic-jade-pro-switch-set",
    alt: "Gateron Magnetic Jade Pro Hall-effect switch",
    credit: "Gateron official product image",
  },
  "switch-geon-raw-he-40gf": {
    url: "https://geon.works/cdn/shop/files/115588790244153042_403743789.jpg?v=1714532073&width=1445",
    sourceUrl: "https://geon.works/products/geon-raw-he-switch",
    alt: "GEONWORKS Raw Hall-effect switch",
    credit: "GEONWORKS official product image",
  },
};

export const imageForProduct = (productId: string) => productImages[productId];
