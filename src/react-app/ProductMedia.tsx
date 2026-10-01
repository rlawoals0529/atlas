import { useEffect, useMemo, useState, type ReactNode } from "react";
import { allCatalog } from "../shared/catalog";
import { imageForProduct, type ProductImage } from "../shared/productImages";

const productById = new Map(allCatalog.map(product => [product.id, product]));
let keyboardImagesPromise: Promise<Record<string, ProductImage>> | null = null;
let switchImagesPromise: Promise<Record<string, ProductImage>> | null = null;
const loadKeyboardImages = () => keyboardImagesPromise ??= import("../shared/keyboardProductImages").then(module => module.keyboardProductImages);
const loadSwitchImages = () => switchImagesPromise ??= import("../shared/switchProductImages").then(module => module.switchProductImages);

function useProductImage(productId: string) {
  const base = imageForProduct(productId);
  const [media, setMedia] = useState<ProductImage | undefined>(base);

  useEffect(() => {
    let active = true;
    setMedia(base);
    if (!base && productId.startsWith("keyboard-")) {
      void loadKeyboardImages().then(images => {
        if (active) setMedia(images[productId]);
      });
    } else if (!base && productId.startsWith("switch-")) {
      void loadSwitchImages().then(images => {
        if (active) setMedia(images[productId]);
      });
    }
    return () => { active = false; };
  }, [base, productId]);

  return media;
}
const sourceScore = (url: string) => {
  const value = url.toLowerCase();
  return (/\/products?\/|gaming-mice|gaming-keyboards|keyboard|switch/.test(value) ? 8 : 0)
    + (/\/shop\/p\//.test(value) ? 4 : 0)
    - (/support|manual|faq|help\.|youtube\.com|youtu\.be/.test(value) ? 6 : 0)
    - (/blog|news|feature\.php/.test(value) ? 2 : 0);
};
const bestManufacturerSource = (productId: string) => {
  const product = productById.get(productId);
  if (!product) return undefined;
  return product.sources.filter(source => source.kind === "manufacturer").sort((a, b) => sourceScore(b.url) - sourceScore(a.url))[0];
};

export function ProductMedia({ productId, fallback, className = "" }: { productId: string; fallback?: ReactNode; className?: string }) {
  const media = useProductImage(productId);
  const product = productById.get(productId);
  const official = useMemo(() => bestManufacturerSource(productId), [productId]);
  const src = media || official ? `/api/media/${encodeURIComponent(productId)}` : undefined;
  const alt = media?.alt ?? (product ? `${product.brand} ${product.model} product image` : "Product image");
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [productId, src]);
  if (!src || failed) return fallback ? <>{fallback}</> : null;
  return <img className={`atlas-product-image ${className}`.trim()} src={src} alt={alt} loading="lazy" decoding="async" onError={() => setFailed(true)}/>;
}

export function ProductImageCredit({ productId }: { productId: string }) {
  const media = useProductImage(productId);
  const product = productById.get(productId);
  const official = bestManufacturerSource(productId);
  const href = media?.sourceUrl ?? official?.url;
  const credit = media?.credit ?? (product && official ? `${product.brand} official product image` : undefined);
  if (!href || !credit) return null;
  return <a className="atlas-product-image-credit" href={href} target="_blank" rel="noreferrer">{credit}<span>↗</span></a>;
}
