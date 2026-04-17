import { useState, useEffect, useCallback } from "react";
import { IProduct, getCategoryPlaceholder } from "../types/productTypes";

const DEFAULT_PLACEHOLDER = "/assets/placeholder/default.png";

/**
 * useProductImage
 * 
 * Handles the 3-tier image fallback logic for products:
 * 1. Primary product image
 * 2. Category-specific placeholder
 * 3. Global default placeholder
 */
export function useProductImage(product: IProduct | null) {
  const categoryPlaceholder = product ? getCategoryPlaceholder(product.category as string) : DEFAULT_PLACEHOLDER;
  const initialSrc = product?.images?.[0] || categoryPlaceholder;

  const [imgSrc, setImgSrc] = useState(initialSrc);
  const [isPlaceholder, setIsPlaceholder] = useState(!product?.images?.[0]);
  const [usedDefault, setUsedDefault] = useState(false);

  // Sync state when product images or category changes
  useEffect(() => {
    setUsedDefault(false);
    if (product?.images?.[0]) {
      setImgSrc(product.images[0]);
      setIsPlaceholder(false);
    } else {
      setImgSrc(categoryPlaceholder);
      setIsPlaceholder(true);
    }
  }, [product?.images, categoryPlaceholder]);

  const handleImageError = useCallback(() => {
    if (!isPlaceholder) {
      // Real image failed -> try category placeholder
      setImgSrc(categoryPlaceholder);
      setIsPlaceholder(true);
    } else if (!usedDefault) {
      // Category placeholder also failed -> nuclear fallback
      setImgSrc(DEFAULT_PLACEHOLDER);
      setUsedDefault(true);
    }
  }, [isPlaceholder, usedDefault, categoryPlaceholder]);

  return {
    imgSrc,
    isPlaceholder,
    handleImageError,
  };
}
