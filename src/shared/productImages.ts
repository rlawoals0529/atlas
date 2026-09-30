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
  "mouse-viper-v4-pro": {
    url: "https://dl.razerzone.com/src2/20779/20779-02-en-v1.png",
    sourceUrl: "https://mysupport.razer.com/app/answers/detail/a_id/20775/",
    alt: "Razer Viper V4 Pro gaming mouse in black and white",
    credit: "Razer official support image",
  },
  "mouse-wlmouse-beast-x-max": {
    url: "https://www.wlmouse.com/cdn/shop/files/max_6aaf780e-f0d8-4857-ae3e-e189612e6b28.jpg?v=1755482399&width=2000",
    sourceUrl: "https://www.wlmouse.com/products/beast-max",
    alt: "WLMOUSE Beast X Max magnesium gaming mouse",
    credit: "WLMOUSE official product image",
  },
  "mouse-lamzu-inca": {
    url: "https://lamzu.com/cdn/shop/files/INCA_800X800_1.jpg?v=1740597300",
    sourceUrl: "https://lamzu.com/collections/inca/products/lamzu-inca",
    alt: "LAMZU INCA wireless gaming mouse",
    credit: "LAMZU official product image",
  },
  "pad-logitech-pro-x-control": {
    url: "https://resource.logitechg.com/w_544%2Ch_466%2Car_7%3A6%2Cc_pad%2Cq_auto%2Cf_auto%2Cdpr_1.0/d_transparent.gif/content/dam/gaming/en/products/pro-x-control-pdp/gallery/pro-x-control-mouse-pad-top-angle-gallery-1.png",
    sourceUrl: "https://www.logitechg.com/en-us/shop/p/pro-x-control-gaming-mousepad.943-001617",
    alt: "Logitech G PRO X CONTROL gaming mousepad",
    credit: "Logitech G official product image",
  },
  "pad-esptiger-sr-tang-dao": {
    url: "https://esptiger.com/cdn/shop/files/ET-MP-TANGDAO-SR-ORANGE_1_49241cdf-a24f-46e3-86ad-4ea9c21bd28e.webp?v=1709007355&width=1946",
    sourceUrl: "https://esptiger.com/products/sr-tang-dao-balance-gaming-mousepad",
    alt: "ESPTIGER SR Tang Dao orange gaming mousepad",
    credit: "ESPTIGER official product image",
  },
  "pad-esptiger-lei-ling": {
    url: "https://esptiger.com/cdn/shop/products/2_7edfb364-50de-45c3-8fc0-549e9753dadb.webp?v=1705364922&width=1946",
    sourceUrl: "https://esptiger.com/products/lei-ling-balance-gaming-mousepad",
    alt: "ESPTIGER Lei Ling gaming mousepad",
    credit: "ESPTIGER official product image",
  },
  "keyboard-wooting-60he-v2": {
    url: "https://wooting.io/_next/image?q=90&url=https%3A%2F%2Fwooting-website.ams3.cdn.digitaloceanspaces.com%2Fproducts%2Fkeyboards%2F60HEv2%2F60he-v2_og-and-split.webp&w=3840",
    sourceUrl: "https://wooting.io/wooting-60he-v2",
    alt: "Wooting 60HE v2 regular and split-spacebar keyboards",
    credit: "Wooting official product image",
  },
  "keyboard-logitech-g512-x-75": {
    url: "https://resource.logitechg.com/w_544%2Ch_466%2Car_7%3A6%2Cc_pad%2Cq_auto%2Cf_auto%2Cdpr_1.0/d_transparent.gif/content/dam/gaming/en/products/g512-x-75-98-pdp/g512-x-75/gallery/g512-x-75-black-top-angle-gallery-1.png",
    sourceUrl: "https://www.logitechg.com/en-us/shop/p/g512-x-75-gaming-keyboard",
    alt: "Logitech G G512 X 75 TMR analog mechanical gaming keyboard",
    credit: "Logitech G official product image",
  },
  "keyboard-rog-falchion-ace-75-he": {
    url: "https://dlcdnwebimgs.asus.com/files/media/202511/4cfcf855-ca9a-45ec-a2bc-c533d8865305/v1/img/kv.jpg",
    sourceUrl: "https://rog.asus.com/us/keyboards/keyboards/compact/rog-falchion-ace-75-he/",
    alt: "Black and white ASUS ROG Falchion Ace 75 HE gaming keyboards",
    credit: "ASUS ROG official product image",
  },
  "keyboard-nuphy-field75-he-v2": {
    url: "https://pay.nuphy.com/cdn/shop/files/Field75_V2_HE_v3_f5f5f5_800x.webp?v=1775816795",
    sourceUrl: "https://pay.nuphy.com/products/nuphy-field75-he-v2-1",
    alt: "NuPhy Field75 HE V2 magnetic gaming keyboard",
    credit: "NuPhy official product image",
  },
  "keyboard-melgeek-made68-pro-plus": {
    url: "https://cdn.shopify.com/s/files/1/0078/2863/5712/files/MelGeek_MADE68_Pro_gaming_keyboard_1.jpg?v=1782373870",
    sourceUrl: "https://www.melgeek.com/products/made68-pro",
    alt: "MelGeek MADE68 Pro Plus Hall-effect gaming keyboard",
    credit: "MelGeek official product image",
  },
  "switch-gateron-magnetic-jade-pro": {
    url: "https://ueeshop.ly200-cdn.com/u_file/UPAW/UPAW819/2512/30/products/gateron-magnetic-jade-pro-switch-magnetic-hallsensor-switch-mechanical-keyboard-wooting.webp?x-oss-process=image%2Fresize%2Cm_lfit%2Ch_1000%2Cw_1000%2Fquality%2Cq_100",
    sourceUrl: "https://www.gateron.com/products/gateron-magnetic-jade-pro-switch-set",
    alt: "Gateron Magnetic Jade Pro Hall-effect switch",
    credit: "Gateron official product image",
  },
  "switch-gateron-magnetic-jade-silent": {
    url: "https://ueeshop.ly200-cdn.com/u_file/UPAW/UPAW819/2605/15/products/gateron-magnetic-jade-silent-switch1.webp?x-oss-process=image%2Fresize%2Cm_lfit%2Ch_1000%2Cw_1000%2Fquality%2Cq_100",
    sourceUrl: "https://www.gateron.com/products/gateron-magnetic-jade-silent-switch-set",
    alt: "Gateron Magnetic Jade Silent Hall-effect switch",
    credit: "Gateron official product image",
  },
  "switch-gateron-jade-attraction": {
    url: "https://ueeshop.ly200-cdn.com/u_file/UPAW/UPAW819/2604/10/products/gateron-magnetic-jade-attraction-he-switch9-143504c316.webp?x-oss-process=image%2Fresize%2Cm_lfit%2Ch_1000%2Cw_1000%2Fquality%2Cq_100",
    sourceUrl: "https://www.gateron.com/products/gateron-magnetic-jade-attraction-he-switch-set",
    alt: "Gateron Magnetic Jade Attraction Hall-effect switch",
    credit: "Gateron official product image",
  },
  "switch-gateron-magnetic-black-lotus": {
    url: "https://ueeshop.ly200-cdn.com/u_file/UPAW/UPAW819/2609/10/photo/gateron-magnetic-black-lotus-switch-set71.webp",
    sourceUrl: "https://www.gateron.com/products/gateron-magnetic-black-lotus-he-switch-set",
    alt: "Gateron Magnetic Black Lotus Hall-effect switch set",
    credit: "Gateron official product image",
  },
  "switch-gateron-low-profile-magnetic-jade-pro": {
    url: "https://ueeshop.ly200-cdn.com/u_file/UPAW/UPAW819/2411/14/products/bbfdabdb8f.webp?x-oss-process=image%2Fresize%2Cm_lfit%2Ch_1000%2Cw_1000%2Fquality%2Cq_100",
    sourceUrl: "https://www.gateron.com/products/gateron-full-pom-low-profile-magnetic-jade-pro-switch-set",
    alt: "Gateron Full POM Low Profile Magnetic Jade Pro Hall-effect switch",
    credit: "Gateron official product image",
  },
  "switch-geon-raw-he-40gf": {
    url: "https://geon.works/cdn/shop/files/115588790244153042_403743789.jpg?v=1714532073&width=1445",
    sourceUrl: "https://geon.works/products/geon-raw-he-switch",
    alt: "GEONWORKS Raw Hall-effect switch",
    credit: "GEONWORKS official product image",
  },
  "switch-geon-strike-he": {
    url: "https://geon.works/cdn/shop/files/GMI01671.jpg?v=1784099603&width=416",
    sourceUrl: "https://geon.works/products/strike-he-switch",
    alt: "GEONWORKS Strike HE clicky Hall-effect switch",
    credit: "GEONWORKS official product image",
  },
};

export const imageForProduct = (productId: string) => productImages[productId];
