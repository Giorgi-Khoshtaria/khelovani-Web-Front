import { ProductCategory } from "./itemsCategory.enum";
import { ProductCondition, PRODUCT_CONDITIONS, CONDITION_LABELS } from "./productCondition.enum";
export { ProductCategory, ProductCondition, PRODUCT_CONDITIONS, CONDITION_LABELS };

export interface IPopulatedOwner {
  _id: string;
  companyNameGe: string;
  companyNameEn?: string;
}

export interface IProduct {
  _id: string;
  owner: string | IPopulatedOwner;
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
  condition: ProductCondition;
  materialsGe: string[];
  materialsEn?: string[];
  dimensions?: string;
  weight?: number;
  isOnSale?: boolean;
  discountPercent?: number | null;
  isShown: boolean;
  pinSection?: ProductCondition | null;
  createdAt: string;
  updatedAt: string;
}

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

