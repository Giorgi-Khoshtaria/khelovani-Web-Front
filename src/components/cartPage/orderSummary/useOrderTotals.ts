"use client";

import { useMemo, useState } from "react";
import type { CartItem } from "@/lib/types/cartTypes";

export const FREE_SHIPPING_THRESHOLD = 200;
export const FLAT_SHIPPING = 10;

const PROMO_CODES: Record<string, number> = {
  KHELO10: 0.1,
  KHELO20: 0.2,
};

export interface OrderTotals {
  itemsCount: number;
  subtotal: number;
  saleSavings: number;
  promoDiscount: number;
  totalSavings: number;
  afterPromoSubtotal: number;
  shipping: number;
  total: number;
}

const compute = (items: CartItem[], promoRate: number): OrderTotals => {
  let subtotal = 0;
  let saleSavings = 0;
  let itemsCount = 0;

  for (const { product, quantity } of items) {
    itemsCount += quantity;
    const original = product.price * quantity;
    const unit =
      product.isOnSale && product.discountPercent
        ? Math.round(product.price * (1 - product.discountPercent / 100))
        : product.price;
    const effective = unit * quantity;
    subtotal += effective;
    saleSavings += original - effective;
  }

  const promoDiscount = Math.round(subtotal * promoRate);
  const afterPromoSubtotal = Math.max(0, subtotal - promoDiscount);
  const shipping =
    afterPromoSubtotal >= FREE_SHIPPING_THRESHOLD || itemsCount === 0
      ? 0
      : FLAT_SHIPPING;

  return {
    itemsCount,
    subtotal,
    saleSavings,
    promoDiscount,
    totalSavings: saleSavings + promoDiscount,
    afterPromoSubtotal,
    shipping,
    total: afterPromoSubtotal + shipping,
  };
};

/**
 * Encapsulates cart totals + promo-code logic shared by every checkout step.
 * Pass `withPromo` to enable promo codes (cart step only); other steps ignore it.
 */
export const useOrderTotals = (items: CartItem[], withPromo: boolean) => {
  const [promoRate, setPromoRate] = useState(0);

  const totals = useMemo(
    () => compute(items, withPromo ? promoRate : 0),
    [items, withPromo, promoRate],
  );

  const applyPromo = (code: string): boolean => {
    const rate = PROMO_CODES[code.trim().toUpperCase()];
    setPromoRate(rate ?? 0);
    return Boolean(rate);
  };

  return { totals, applyPromo, promoApplied: promoRate > 0 };
};
