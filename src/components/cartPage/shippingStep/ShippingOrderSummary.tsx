"use client";

import Image from "next/image";
import { useMemo } from "react";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import type { CartItem } from "@/lib/types/cartTypes";
import {
  CATEGORY_PLACEHOLDER_MAP,
  type IPopulatedOwner,
} from "@/lib/types/productTypes";
import "./shippingOrderSummary.scss";

interface Props {
  items: CartItem[];
  onContinue: () => void;
}

const FREE_SHIPPING_THRESHOLD = 200;
const FLAT_SHIPPING = 10;

interface Totals {
  itemsCount: number;
  subtotal: number;
  saleSavings: number;
  shipping: number;
  total: number;
}

const computeTotals = (items: CartItem[]): Totals => {
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

  const shipping =
    subtotal >= FREE_SHIPPING_THRESHOLD || itemsCount === 0 ? 0 : FLAT_SHIPPING;
  const total = subtotal + shipping;

  return { itemsCount, subtotal, saleSavings, shipping, total };
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

export default function ShippingOrderSummary({ items, onContinue }: Props) {
  const { t: tPages } = useClientTranslation("pages");
  const { lang } = useLanguage();
  const isEn = lang.toLowerCase() === "en";
  const totals = useMemo(() => computeTotals(items), [items]);

  return (
    <div className="shipping-summary">
      <h2 className="shipping-summary__title">
        {tPages("cart.summary.title") || "შეკვეთის ჯამი"}
      </h2>

      <ul className="shipping-summary__items">
        {items.map(({ product, quantity }) => {
          const unit =
            product.isOnSale && product.discountPercent
              ? Math.round(product.price * (1 - product.discountPercent / 100))
              : product.price;
          const hasDiscount = unit < product.price;
          const lineTotal = unit * quantity;
          const title = isEn && product.titleEn ? product.titleEn : product.titleGe;
          const owner = (
            typeof product.owner === "object" ? product.owner : null
          ) as IPopulatedOwner | null;
          const ownerName = owner
            ? isEn && owner.companyNameEn
              ? owner.companyNameEn
              : owner.companyNameGe
            : null;
          const image =
            product.images?.[0] ||
            CATEGORY_PLACEHOLDER_MAP[
              product.category as keyof typeof CATEGORY_PLACEHOLDER_MAP
            ] ||
            "/assets/placeholder/default.png";

          return (
            <li key={product._id} className="shipping-summary__item">
              <div className="shipping-summary__thumb">
                <Image src={image} alt={title} width={56} height={56} />
                <span className="shipping-summary__qty">{quantity}</span>
              </div>
              <div className="shipping-summary__item-body">
                <p className="shipping-summary__item-name">{title}</p>
                {ownerName && (
                  <p className="shipping-summary__item-partner">
                    {tPages("cart.by") || "By"} {ownerName}
                  </p>
                )}
              </div>
              <div className="shipping-summary__item-price">
                {hasDiscount && (
                  <span className="shipping-summary__item-original">
                    ₾{product.price * quantity}
                  </span>
                )}
                <span className="shipping-summary__item-amount">
                  ₾{lineTotal}
                </span>
              </div>
            </li>
          );
        })}
      </ul>

      <dl className="shipping-summary__totals">
        <div className="shipping-summary__row">
          <dt>
            {tPages("cart.summary.subtotal") || "ჯამი"} ({totals.itemsCount}{" "}
            {tPages("cart.summary.items") || "ნივთი"})
          </dt>
          <dd>₾{totals.subtotal}</dd>
        </div>

        {totals.saleSavings > 0 && (
          <div className="shipping-summary__row shipping-summary__row--save">
            <dt>{tPages("cart.summary.you_save") || "დაზოგავ"}</dt>
            <dd>-₾{totals.saleSavings}</dd>
          </div>
        )}

        <div className="shipping-summary__row">
          <dt>{tPages("cart.summary.shipping") || "მიწოდება"}</dt>
          <dd>
            {totals.shipping === 0
              ? tPages("cart.summary.free") || "უფასო"
              : `₾${totals.shipping}`}
          </dd>
        </div>
      </dl>

      <div className="shipping-summary__total">
        <span>{tPages("cart.summary.total") || "ჯამური"}</span>
        <span className="shipping-summary__total-amount">₾{totals.total}</span>
      </div>

      <button
        type="button"
        className="shipping-summary__continue"
        onClick={onContinue}
      >
        <LockIcon />
        <span>
          {tPages("shipping.continue_to_payment") || "გადახდაზე გადასვლა"}
        </span>
      </button>

      <p className="shipping-summary__disclaimer">
        {tPages("shipping.disclaimer") ||
          "თქვენი მონაცემები დაცულია. გადახდა მოხდება მხოლოდ შემდეგ ეტაპზე დადასტურების შემდეგ."}
      </p>
    </div>
  );
}
