import { useCallback, useMemo, useState } from "react";
import { IProduct, getCategoryPlaceholder } from "../types/productTypes";

const DEFAULT_PLACEHOLDER = "/assets/placeholder/default.png";

/**
 * useProductImage
 *
 * Resolves the product image with a 3-step fallback chain. Tracked as a
 * single integer step so transitions can't get into inconsistent states:
 *   step 0 → product image (or category placeholder if there isn't one)
 *   step 1 → category placeholder
 *   step 2 → global default placeholder
 *
 * `handleImageError` advances to the next step. The chain dedupes —
 * if the product has no image, step 0 already shows the category
 * placeholder, so an error there jumps straight to the default.
 */
export function useProductImage(product: IProduct | null) {
  const sources = useMemo(() => {
    const category = product
      ? getCategoryPlaceholder(product.category as string)
      : DEFAULT_PLACEHOLDER;
    const primary = product?.images?.[0];
    return primary
      ? [primary, category, DEFAULT_PLACEHOLDER]
      : [category, DEFAULT_PLACEHOLDER];
    // We don't need product as a dep — the array is rebuilt only when
    // its image / category change.
  }, [product]);

  const [step, setStep] = useState(0);

  const imgSrc = sources[Math.min(step, sources.length - 1)];

  const handleImageError = useCallback(() => {
    setStep((s) => Math.min(s + 1, sources.length - 1));
  }, [sources.length]);

  // Whether we're showing a placeholder vs the user-uploaded image.
  const isPlaceholder = sources.length === 2 || step >= 1;

  return { imgSrc, isPlaceholder, handleImageError };
}
