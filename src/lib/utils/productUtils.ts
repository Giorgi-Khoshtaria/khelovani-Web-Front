import { Lang } from "../types/lang.types";

/**
 * Utility to resolve localized product fields based on the current language.
 * Prefers explicitly provided English fields when language is 'en', otherwise falls back to Georgian.
 */
export function getLocalizedField(
  ge: string,
  en: string | undefined,
  lang: string
): string {
  const isEn = lang.toLowerCase() === "en";
  return isEn && en ? en : ge;
}

/**
 * Formats a numeric price into a currency string with the Lari (₾) symbol.
 */
export function formatProductPrice(price: number): string {
  // Simple formatting as requested, can be upgraded to Intl.NumberFormat later
  return `₾${price}`;
}

/**
 * Common stock status helper
 */
export function getStockInfo(quantity: number) {
  return {
    isInStock: quantity > 0,
    isOutOfStock: quantity <= 0,
  };
}
