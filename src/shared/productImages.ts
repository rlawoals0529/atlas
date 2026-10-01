export type ProductImage = {
  url: string;
  sourceUrl: string;
  alt: string;
  credit: string;
};

// Presentation-only media registry. Canonical product specifications remain in catalog shards.
// Remote manufacturer assets are intentionally allowed to fail gracefully in the UI.
export const productImages: Record<string, ProductImage> = {
  "mouse-superlight-2c": {
    url: "https://resource.logitechg.com/w_544%2Ch_466%2Car_7%3A6%2Cc_pad%2Cq_auto%2Cf_auto%2Cdpr_1.0/d_transparent.gif/content/dam/gaming/en/products/pro-x-superlight-2c-pdp/gallery/pro-x-superlight-2c-mouse-top-angle-offwhite-gallery-1.png",
    sourceUrl: "https://www.logitechg.com/en-us/shop/p/pro-x-superlight-2c",
    alt: "Logitech G PRO X SUPERLIGHT 2c gaming mouse",
    credit: "Logitech G official product image",
  },
  "mouse-gpx2": {
    url: "https://resource.logitechg.com/w_544%2Ch_466%2Car_7%3A6%2Cc_pad%2Cq_auto%2Cf_auto%2Cdpr_1.0/d_transparent.gif/content/dam/gaming/en/products/pro-x-superlight-2/new-gallery-assets-2025/pro-x-superlight-2-mice-top-angle-black-gallery-1.png",
    sourceUrl: "https://www.logitechg.com/en-us/shop/p/pro-x2-superlight-wireless-mouse.910-006628",
    alt: "Logitech G PRO X SUPERLIGHT 2 gaming mouse",
    credit: "Logitech G official product image",
  },
  "mouse-viper-v3-pro": {
    url: "https://assets2.razerzone.com/images/pnx.assets/474a68bae599387eb85e884c484e9ce3/sequence_00000.webp",
    sourceUrl: "https://www.razer.com/gaming-mice/razer-viper-v3-pro",
    alt: "Razer Viper V3 Pro gaming mouse",
    credit: "Razer official product image",
  },
  "mouse-op1w-4k-v2": {
    url: "https://endgamegear.com/cdn/shop/files/EGG-OP1w-4K-Black_top_down.-3000x3000-2567b33.jpg?v=1736862604&width=3000",
    sourceUrl: "https://endgamegear.com/products/op1w-4k-v2-wireless-gaming-mouse",
    alt: "Endgame Gear OP1w 4K v2 wireless gaming mouse viewed from above",
    credit: "Endgame Gear official product image",
  },
  "mouse-zowie-fk2-dw": {
    url: "https://image.benq.com/is/image/benqco/1-fk2-dw-top?%24ResponsivePreset%24=&fmt=png-alpha",
    sourceUrl: "https://zowie.benq.com/en-us/mouse/fk2-dw.html",
    alt: "ZOWIE FK2-DW wireless gaming mouse viewed from above",
    credit: "ZOWIE official product image",
  },
  "mouse-zowie-s2-dw": {
    url: "https://image.benq.com/is/image/benqco/1-s2-dw-top?%24ResponsivePreset%24=&fmt=png-alpha",
    sourceUrl: "https://zowie.benq.com/en-us/mouse/s2-dw.html",
    alt: "ZOWIE S2-DW wireless gaming mouse viewed from above",
    credit: "ZOWIE official product image",
  },
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
  "keyboard-keychron-q1-he-8k": {
    url: "https://www.keychron.com/cdn/shop/files/Keychron-Q1--HE--8K-Full-Size-Keychron-Ultra-fast-Lime-Magnetic-Switch-Keyboard-1.jpg?crop=center&height=1200&v=1761655109&width=1200",
    sourceUrl: "https://www.keychron.com/products/keychron-q1-he-8k-magnetic-switch-keyboard",
    alt: "Keychron Q1 HE 8K magnetic gaming keyboard",
    credit: "Keychron official product image",
  },
  "keyboard-keychron-k2-he-tmr-v1": {
    url: "https://www.keychron.com/cdn/shop/files/Iconic-features-of-K2HE.jpg?crop=center&height=1200&v=1758336687&width=1200",
    sourceUrl: "https://www.keychron.com/products/keychron-k2-he-wireless-magnetic-switch-keyboard",
    alt: "Keychron K2 HE wireless magnetic keyboard",
    credit: "Keychron official product image",
  },
  "keyboard-keychron-q3-he-8k": {
    url: "https://www.keychron.com/cdn/shop/files/Q3-HE-8K-Iconic-Features.jpg?crop=center&height=1200&v=1758351963&width=1200",
    sourceUrl: "https://www.keychron.com/products/keychron-q3-he-8k-magnetic-switch-keyboard",
    alt: "Keychron Q3 HE 8K magnetic gaming keyboard",
    credit: "Keychron official product image",
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
  "mouse-op1-8k-v2": {
    url: "https://endgamegear.com/cdn/shop/files/OP1_Black_top_down.jpg?v=1736944464&width=2499",
    sourceUrl: "https://endgamegear.com/products/op1-8k-v2-wired-gaming-mouse",
    alt: "Endgame Gear OP1 8K v2 wired gaming mouse viewed from above",
    credit: "Endgame Gear official product image",
  },
  "mouse-zowie-za13-dw": {
    url: "https://image.benq.com/is/image/benqco/1-za13-dw-top?%24ResponsivePreset%24=&fmt=png-alpha",
    sourceUrl: "https://zowie.benq.com/en-us/mouse/za13-dw.html",
    alt: "ZOWIE ZA13-DW wireless gaming mouse viewed from above",
    credit: "ZOWIE official product image",
  },
  "keyboard-pulsar-es-he-70": {
    url: "https://us.pulsar.gg/cdn/shop/files/Pulsar-eS-HE-70_ANSI-front1-ANSI_4dd1a65d-86f0-45db-987a-94be9671ff57_large.png?v=1755065886",
    sourceUrl: "https://us.pulsar.gg/products/ansi-es-he-70-gaming-keyboard",
    alt: "Pulsar eS HE 70 Hall-effect gaming keyboard in black",
    credit: "Pulsar official product image",
  },
  "keyboard-logitech-pro-x2-rapid": {
    url: "https://resource.logitechg.com/w_544%2Ch_466%2Car_7%3A6%2Cc_pad%2Cq_auto%2Cf_auto%2Cdpr_1.0/d_transparent.gif/content/dam/gaming/en/products/pro-x2-rapid-pdp/gallery/pro-x2-rapid-black-gallery1.png",
    sourceUrl: "https://www.logitechg.com/en-ca/shop/p/pro-x2-rapid",
    alt: "Logitech G PRO X2 RAPID gaming keyboard",
    credit: "Logitech G official product image",
  },
  "mouse-vaxee-xe-s-wireless-4k": {
    url: "https://www.vaxee.co/EN/data/goods/gallery/202405/1715938000380164487.png",
    sourceUrl: "https://www.vaxee.co/en/product.php?act=view&id=227",
    alt: "VAXEE XE-S Wireless 4K gaming mouse color lineup",
    credit: "VAXEE official product image",
  },
  "mouse-vaxee-xe-v2": {
    url: "https://www.vaxee.co/kr/data/goods/gallery/202507/1751877050033395222.png",
    sourceUrl: "https://www.vaxee.co/en/product.php?act=view&id=271",
    alt: "VAXEE XE v2 Wireless 4K gaming mouse color lineup",
    credit: "VAXEE official product image",
  },
  "mouse-xm2w-4k-v2": {
    url: "https://endgamegear.com/cdn/shop/files/EGG-XM2w-4k_BLK_top_down-3000x3000-2567b33_1.jpg?v=1736945917&width=2019",
    sourceUrl: "https://endgamegear.com/products/xm2w-4k-v2-wireless-gaming-mouse",
    alt: "Endgame Gear XM2w 4k v2 wireless gaming mouse viewed from above",
    credit: "Endgame Gear official product image",
  },
  "mouse-scimitar-se": {
    url: "https://assets.corsair.com/image/upload/c_pad%2Cq_85%2Ch_1100%2Cw_1100%2Cf_auto/products/Gaming-Mice/base-scimitar-elite-se-config/CH-9314014-WW/CH-9314014-WW_01.webp",
    sourceUrl: "https://www.corsair.com/us/en/p/gaming-mouse/ch-9314014-ww/scimitar-elite-wireless-se-mmo-gaming-mouse-gun-metal-ch-9314014-ww",
    alt: "Corsair SCIMITAR ELITE WIRELESS SE gaming mouse",
    credit: "Corsair official product image",
  },
  "mouse-corsair-sabre-v2-pro-mg": {
    url: "https://assets.corsair.com/image/upload/f_auto/q_auto/v1766446161/products/Gaming-Mice/base-sabre-v2-mg-config/content/01_SabreV2MG_hero_temp-static_mobile.png",
    sourceUrl: "https://www.corsair.com/us/en/p/gaming-mouse/ch-931g100-ww/sabre-v2-pro-wireless-magnesium-alloy-gaming-mouse-black-ch-931g100-ww",
    alt: "Corsair SABRE v2 PRO Wireless Magnesium gaming mouse",
    credit: "Corsair official product image",
  },
  "mouse-ulx-competition-medium": {
    url: "https://finalmouse.com/cdn/shop/files/web2.png?v=1737785210&width=450",
    sourceUrl: "https://finalmouse.com/pages/mice",
    alt: "Finalmouse UltralightX Competition gaming mouse",
    credit: "Finalmouse official product image",
  },
  "mouse-akitsu-small": {
    url: "https://arbiterstudio.com/cdn/shop/files/Arbiter_Studio_AKITSU_Carbon_Fiber_8K_Wireless_Gaming_Mouse_2.webp?v=1720178569&width=1780",
    sourceUrl: "https://arbiterstudio.com/collections/test-collection-by-arbiter-copy/products/akitsu-carbon-fiber-8k-wireless-gaming-mouse",
    alt: "Arbiter Studio AKITSU Small carbon-fiber gaming mouse viewed from above",
    credit: "Arbiter Studio official product image",
  },
  "keyboard-razer-huntsman-v3-pro-tkl-8khz": {
    url: "https://assets3.razerzone.com/iajuRCuAMNuncojOMjSjzRZzBNY=/1920x1280/https%3A%2F%2Fmedias-p1.phoenix.razer.com%2Fsys-master-phoenix-images-container%2Fhb9%2Fh24%2F9980311076894%2Fhuntsman-v3-pro-tkl-8khz-b-500x500.png",
    sourceUrl: "https://www.razer.com/gaming-keyboards/razer-huntsman-v3-pro-8khz/RZ03-05520200-R3U1",
    alt: "Razer Huntsman V3 Pro Tenkeyless 8KHz gaming keyboard",
    credit: "Razer official product image",
  },
  "mouse-naga-v2-pro": {
    url: "https://assets3.razerzone.com/0BTnfDndkuUtHnVK3MKm8F39AGw=/1920x1280/https%3A%2F%2Fmedias-p1.phoenix.razer.com%2Fsys-master-phoenix-images-container%2Fhb2%2Fhb9%2F9529652379678%2Fnaga-v2-pro-2-500x500.png",
    sourceUrl: "https://www.razer.com/ca-en/gaming-mice/razer-naga-v2-pro/RZ01-04400100-R3U1",
    alt: "Razer Naga V2 Pro wireless gaming mouse",
    credit: "Razer official product image",
  },
  "mouse-basilisk-v3-pro-35k": {
    url: "https://assets3.razerzone.com/QrFFO4KLgcSlv8V4Zhksri9dTK8=/1920x1280/https%3A%2F%2Fmedias-p1.phoenix.razer.com%2Fsys-master-phoenix-images-container%2Fh5a%2Fh1c%2F9821720576030%2Fbasilisk-v3-pro-35k-500x500.png",
    sourceUrl: "https://www.razer.com/gaming-mice/razer-basilisk-v3-pro-35k/RZ01-05240100-R3U1",
    alt: "Razer Basilisk V3 Pro 35K wireless gaming mouse",
    credit: "Razer official product image",
  },
  "mouse-lamzu-maya-x": {
    url: "https://lamzu.com/cdn/shop/files/Maya_X_8K_800X800_1_fe247b9f-fe79-4da4-b7f1-28e7c768c322-397886.jpg?v=1751524797",
    sourceUrl: "https://lamzu.com/products/lamzu-maya-x",
    alt: "LAMZU MAYA X 8K gaming mouse",
    credit: "LAMZU official product image",
  },



};

export const productMediaSourceOverrides: Record<string, string> = {
  "mouse-vaxee-xe-s-wireless-4k": "https://www.vaxee.co/EN/product.php?act=view&id=227",
  "mouse-vaxee-xe-v2": "https://www.vaxee.co/en/product.php?act=view&id=271",
  "mouse-xm2w-4k-v2": "https://endgamegear.com/products/xm2w-4k-v2-wireless-gaming-mouse",
  "mouse-scimitar-se": "https://www.corsair.com/us/en/p/gaming-mouse/ch-9314014-ww/scimitar-elite-wireless-se-mmo-gaming-mouse-gun-metal-ch-9314014-ww",
  "mouse-corsair-sabre-v2-pro-mg": "https://www.corsair.com/us/en/p/gaming-mouse/ch-931g100-ww/sabre-v2-pro-wireless-magnesium-alloy-gaming-mouse-black-ch-931g100-ww",
  "mouse-ulx-competition-medium": "https://finalmouse.com/pages/mice",
  "mouse-akitsu-small": "https://arbiterstudio.com/products/akitsu-carbon-fiber-8k-wireless-gaming-mouse",
  "mouse-mchose-l7-pro": "https://www.mchose.store/products/mchose-l7-series-ultra-lightweight-wireless-gaming-mouse",
  "mouse-g502-x-plus": "https://www.logitechg.com/en-us/shop/p/g502-x-plus-wireless-lightforce",
  "mouse-gpx2-dex": "https://www.logitechg.com/en-us/shop/p/pro-x-superlight-2-dex.910-007328",
  "keyboard-logitech-pro-x2-rapid": "https://www.logitechg.com/en-us/shop/c/gaming-keyboards",
};

export const imageForProduct = (productId: string) => productImages[productId];
export const mediaSourceForProduct = (productId: string) => productMediaSourceOverrides[productId];

