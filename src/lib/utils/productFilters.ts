import { ProductCategory } from "@/lib/types/productTypes";

export const PRICE_FLOOR = 0;
export const PRICE_CEIL = 1_000_000;

const VALID_CATEGORIES = new Set<string>(Object.values(ProductCategory));

/** Falls back to "all" for anything outside the known category set. */
export const sanitizeCategory = (raw: string | null | undefined): string => {
  if (!raw || raw === "all") return "all";
  return VALID_CATEGORIES.has(raw) ? raw : "all";
};

export const clampPrice = (
  raw: string | null | undefined,
  fallback: number,
): number => {
  const n = Number(raw);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(PRICE_CEIL, Math.max(PRICE_FLOOR, n));
};
