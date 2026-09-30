import { useEffect, useState, type ReactNode } from "react";
import { imageForProduct } from "../shared/productImages";

export function ProductMedia({ productId, fallback, className = "" }: { productId: string; fallback?: ReactNode; className?: string }) {
  const media = imageForProduct(productId);
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [productId]);

  if (!media || failed) return fallback ? <>{fallback}</> : null;
  return <img className={`atlas-product-image ${className}`.trim()} src={media.url} alt={media.alt} loading="lazy" decoding="async" onError={() => setFailed(true)}/>;
}

export function ProductImageCredit({ productId }: { productId: string }) {
  const media = imageForProduct(productId);
  if (!media) return null;
  return <a className="atlas-product-image-credit" href={media.sourceUrl} target="_blank" rel="noreferrer">{media.credit}<span>↗</span></a>;
}
