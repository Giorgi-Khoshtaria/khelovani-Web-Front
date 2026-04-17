import { useLanguage } from "@/contexts/LanguageContext";
import { ProductCategory } from "./itemsCategory.enum";
export { ProductCategory };

export interface IProduct {
  _id: string;
  owner: string;
  images: string[];
  titleGe: string;
  titleEn?: string;
  descriptionGe: string;
  descriptionEn?: string;
  category: ProductCategory;
  tagsGe: string[];
  tagsEn?: string[];
  price: number;
  currency: string;
  stockQuantity: number;
  isOneOfAKind: boolean;
  shippingAvailable: boolean;
  shippingPrice?: number;
  locationGe: string;
  locationEn?: string;
  condition: "new" | "handmade" | "vintage";
  materialsGe: string[];
  materialsEn?: string[];
  dimensions?: string;
  weight?: number;
  isShown: boolean;
  createdAt: string;
  updatedAt: string;
}

export const PRODUCT_CATEGORY_LABELS: Record<
  ProductCategory,
  { ge: string; en: string }
> = {
  [ProductCategory.JEWELRY]: { ge: "სამკაული", en: "Jewelry" },
  [ProductCategory.CERAMICS]: { ge: "კერამიკა", en: "Ceramics" },
  [ProductCategory.TEXTILE]: { ge: "ტექსტილი", en: "Textile" },
  [ProductCategory.WOODWORK]: { ge: "ხის ნაკეთობები", en: "Woodwork" },
  [ProductCategory.PAINTING]: { ge: "ფერწერა", en: "Painting" },
  [ProductCategory.SCULPTURE]: { ge: "ქანდაკება", en: "Sculpture" },
  [ProductCategory.LEATHERWORK]: { ge: "ტყავის ნაკეთობები", en: "Leatherwork" },
  [ProductCategory.GLASSWORK]: { ge: "მინის ნაკეთობები", en: "Glasswork" },
  [ProductCategory.EMBROIDERY]: { ge: "ნაქარგობა", en: "Embroidery" },
  [ProductCategory.METALWORK]: { ge: "ლითონის ნაკეთობები", en: "Metalwork" },
  [ProductCategory.FELTWORK]: { ge: "თექა", en: "Feltwork" },
  [ProductCategory.KNITTING]: { ge: "ნაქსოვი", en: "Knitting" },
  [ProductCategory.CANDLES]: { ge: "სანთლები", en: "Candles" },
  [ProductCategory.PHOTOGRAPHY]: { ge: "ფოტოგრაფია", en: "Photography" },
  [ProductCategory.PRINTMAKING]: {
    ge: "გრაფიკა / გრავიურა",
    en: "Printmaking",
  },
  [ProductCategory.PAPER_ART]: { ge: "ქაღალდის ხელოვნება", en: "Paper Art" },
  [ProductCategory.HOME_DECOR]: { ge: "სახლის დეკორი", en: "Home Decor" },
  [ProductCategory.ACCESSORIES]: { ge: "აქსესუარები", en: "Accessories" },
  [ProductCategory.TOYS]: { ge: "სათამაშოები", en: "Toys" },
  [ProductCategory.OTHER]: { ge: "სხვა", en: "Other" },
};

// ─── Placeholder images (one per category) ────────────────────────────────────
const DEFAULT_PLACEHOLDER = "/assets/placeholder/default.png";

export const CATEGORY_PLACEHOLDER_MAP: Record<ProductCategory, string> = {
  [ProductCategory.JEWELRY]: "/assets/placeholder/jewelry.png",
  [ProductCategory.CERAMICS]: "/assets/placeholder/ceramics.png",
  [ProductCategory.TEXTILE]: "/assets/placeholder/textile.png",
  [ProductCategory.WOODWORK]: "/assets/placeholder/woodwork.png",
  [ProductCategory.PAINTING]: "/assets/placeholder/painting.png",
  [ProductCategory.SCULPTURE]: "/assets/placeholder/sculpture.png",
  [ProductCategory.LEATHERWORK]: "/assets/placeholder/leatherwork.png",
  [ProductCategory.GLASSWORK]: "/assets/placeholder/glasswork.png",
  [ProductCategory.EMBROIDERY]: "/assets/placeholder/embroidery.png",
  [ProductCategory.METALWORK]: "/assets/placeholder/metalwork.png",
  [ProductCategory.FELTWORK]: "/assets/placeholder/feltwork.png",
  [ProductCategory.KNITTING]: "/assets/placeholder/knitting.png",
  [ProductCategory.CANDLES]: "/assets/placeholder/candles.png",
  // Not yet generated — using default until images are ready
  [ProductCategory.PHOTOGRAPHY]: DEFAULT_PLACEHOLDER,
  [ProductCategory.PRINTMAKING]: DEFAULT_PLACEHOLDER,
  [ProductCategory.PAPER_ART]: DEFAULT_PLACEHOLDER,
  [ProductCategory.HOME_DECOR]: DEFAULT_PLACEHOLDER,
  [ProductCategory.ACCESSORIES]: DEFAULT_PLACEHOLDER,
  [ProductCategory.TOYS]: DEFAULT_PLACEHOLDER,
  [ProductCategory.OTHER]: DEFAULT_PLACEHOLDER,
};

export function getCategoryPlaceholder(category: string): string {
  // 1. Exact match (e.g. "jewelry", "ceramics")
  if (CATEGORY_PLACEHOLDER_MAP[category as ProductCategory]) {
    return CATEGORY_PLACEHOLDER_MAP[category as ProductCategory];
  }

  // 2. Legacy / compound values (e.g. "jewelry_accessories" → try "jewelry" first)
  const firstSegment = category.split("_")[0];
  if (
    firstSegment &&
    CATEGORY_PLACEHOLDER_MAP[firstSegment as ProductCategory]
  ) {
    return CATEGORY_PLACEHOLDER_MAP[firstSegment as ProductCategory];
  }

  // 3. Nuclear fallback
  return DEFAULT_PLACEHOLDER;
}

/**
 * Resolves a human-readable label for a category string.
 * Handles exact matches, compound strings (e.g., "Jewelry_accessories"),
 * and case-sensitivity.
 */
export function resolveCategoryLabel(category: string, lang: "ge" | "en"): string {
  if (!category) return "";

  // 1. Try exact match
  if (PRODUCT_CATEGORY_LABELS[category as ProductCategory]) {
    return PRODUCT_CATEGORY_LABELS[category as ProductCategory][lang];
  }

  // 2. Try normalized match (lowercase and split)
  const normalized = category.split("_")[0].toLowerCase() as ProductCategory;
  if (PRODUCT_CATEGORY_LABELS[normalized]) {
    return PRODUCT_CATEGORY_LABELS[normalized][lang];
  }

  // 3. Fallback to raw string
  return category;
}
