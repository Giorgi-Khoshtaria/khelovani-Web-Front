"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import type { CartItem } from "@/lib/types/cartTypes";
import FreeShippingBar from "./FreeShippingBar";
import PromoCodeInput from "./PromoCodeInput";
import PaymentMethods from "./PaymentMethods";
import "./orderSummary.scss";

interface Props {
  items: CartItem[];
}

const FREE_SHIPPING_THRESHOLD = 200;
const FLAT_SHIPPING = 10;

const PROMO_CODES: Record<string, number> = {
  KHELO10: 0.1,
  KHELO20: 0.2,
};

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <rect
      x="4"
      y="10"
      width="16"
      height="11"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path
      d="M8 10V7a4 4 0 0 1 8 0v3"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M5 12h14m-6-6 6 6-6 6"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path
      d="M19 12H5m6 6-6-6 6-6"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface Totals {
  itemsCount: number;
  subtotal: number;
  saleSavings: number;
  promoDiscount: number;
  totalSavings: number;
  shipping: number;
  total: number;
}

const computeTotals = (
  items: CartItem[],
  promoRate: number,
): Totals => {
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
  const afterDiscount = Math.max(0, subtotal - promoDiscount);
  const shipping =
    afterDiscount >= FREE_SHIPPING_THRESHOLD || itemsCount === 0
      ? 0
      : FLAT_SHIPPING;
  const total = afterDiscount + shipping;

  return {
    itemsCount,
    subtotal,
    saleSavings,
    promoDiscount,
    totalSavings: saleSavings + promoDiscount,
    shipping,
    total,
  };
};

export default function OrderSummary({ items }: Props) {
  const { t: tPages } = useClientTranslation("pages");
  const { t: tNav } = useClientTranslation("navigation");
  const [promoRate, setPromoRate] = useState(0);

  const totals = useMemo(() => computeTotals(items, promoRate), [
    items,
    promoRate,
  ]);

  const handleApplyPromo = (code: string): boolean => {
    const rate = PROMO_CODES[code.trim().toUpperCase()];
    if (rate) {
      setPromoRate(rate);
      return true;
    }
    setPromoRate(0);
    return false;
  };

  const router = useRouter();
  const handleCheckout = () => {
    router.push("/cart/shipping");
  };

  return (
    <div className="order-summary">
      <h2 className="order-summary__title">
        {tPages("cart.summary.title") || "შეკვეთის ჯამი"}
      </h2>

      <FreeShippingBar
        subtotal={Math.max(0, totals.subtotal - totals.promoDiscount)}
        threshold={FREE_SHIPPING_THRESHOLD}
      />

      <PromoCodeInput onApply={handleApplyPromo} applied={promoRate > 0} />

      <dl className="order-summary__totals">
        <div className="order-summary__row">
          <dt>
            {tPages("cart.summary.subtotal") || "ჯამი"} ({totals.itemsCount}{" "}
            {tPages("cart.summary.items") || "ნივთი"})
          </dt>
          <dd>₾{totals.subtotal}</dd>
        </div>

        {totals.totalSavings > 0 && (
          <div className="order-summary__row order-summary__row--save">
            <dt>{tPages("cart.summary.you_save") || "დაზოგავ"}</dt>
            <dd>-₾{totals.totalSavings}</dd>
          </div>
        )}

        <div className="order-summary__row">
          <dt>{tPages("cart.summary.shipping") || "მიწოდება"}</dt>
          <dd>
            {totals.shipping === 0
              ? tPages("cart.summary.free") || "უფასო"
              : `₾${totals.shipping}`}
          </dd>
        </div>
      </dl>

      <div className="order-summary__total">
        <span>{tPages("cart.summary.total") || "ჯამური"}</span>
        <span className="order-summary__total-amount">₾{totals.total}</span>
      </div>

      <button
        type="button"
        className="order-summary__checkout"
        onClick={handleCheckout}
      >
        <LockIcon />
        <span>{tPages("cart.checkout") || "უსაფრთხო გადახდა"}</span>
        <ArrowIcon />
      </button>

      <a href="/products" className="order-summary__continue">
        <ArrowLeftIcon />
        {tNav("continue_shopping") || "შოპინგის გაგრძელება"}
      </a>

      <PaymentMethods />
    </div>
  );
}
