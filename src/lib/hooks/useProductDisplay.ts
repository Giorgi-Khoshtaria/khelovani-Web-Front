import { useLanguage } from "@/contexts/LanguageContext";
import { IProduct } from "../types/productTypes";
import { getLocalizedField, formatProductPrice, getStockInfo } from "../utils/productUtils";
import { useCategories } from "@/contexts/CategoriesContext";

/**
 * useProductDisplay
 * 
 * Centralizes the transformation of product data for UI display.
 * Handles:
 * - Language-aware title and description selection
 * - Category label resolution (using translations)
 * - Price formatting (₾ symbol)
 * - Stock status calculation
 */
export function useProductDisplay(product: IProduct) {
  const { lang: currentLang } = useLanguage();
  const lang = currentLang.toLowerCase() as "ge" | "en";
  const { getLabel } = useCategories();

  const title = getLocalizedField(product.titleGe, product.titleEn, lang);
  const description = getLocalizedField(product.descriptionGe, product.descriptionEn, lang);

  const categoryLabel = getLabel(product.category, lang);
  const formattedPrice = formatProductPrice(product.price);
  
  const { isInStock, isOutOfStock } = getStockInfo(product.stockQuantity);

  return {
    lang,
    title,
    description,
    categoryLabel,
    formattedPrice,
    isInStock,
    isOutOfStock,
  };
}
