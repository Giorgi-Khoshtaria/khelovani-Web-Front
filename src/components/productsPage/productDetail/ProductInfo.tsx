"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { IProduct } from "@/lib/types/productTypes";
import { Partner } from "@/lib/types/partnerTypes";
import { useLanguage } from "@/contexts/LanguageContext";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import { useProductDisplay } from "@/lib/hooks/useProductDisplay";
import {
  CartIcon,
  HeartIcon,
  MinusIcon,
  PlusIcon,
  ShareIcon,
} from "./constants";
import "./productInfo.scss";

interface ProductInfoProps {
  product: IProduct;
  partner: Partner | null;
}

const buildSku = (product: IProduct): string => {
  const prefix = String(product.category || "PRD").slice(0, 3).toUpperCase();
  const tail = product._id.slice(-4).toUpperCase();
  return `${prefix}-${tail}`;
};

export default function ProductInfo({ product, partner }: ProductInfoProps) {
  const { lang } = useLanguage();
  const { t: tPages } = useClientTranslation("pages");

  const { title, description, categoryLabel, formattedPrice, isInStock } =
    useProductDisplay(product);

  const isEn = lang.toLowerCase() === "en";
  const ownerName = partner
    ? isEn && partner.companyNameEn
      ? partner.companyNameEn
      : partner.companyNameGe
    : null;
  const ownerHref = partner?._id ? `/partners/${partner._id}` : "#";

  const [qty, setQty] = useState(1);

  const sku = useMemo(() => buildSku(product), [product]);

  const hasDiscount =
    !!product.isOnSale &&
    !!product.discountPercent &&
    product.discountPercent > 0;
  const originalPrice = hasDiscount
    ? Math.round(product.price / (1 - product.discountPercent! / 100))
    : null;

  const max = Math.max(1, product.stockQuantity || 1);
  const dec = () => setQty((q) => Math.max(1, q - 1));
  const inc = () => setQty((q) => Math.min(max, q + 1));

  return (
    <div className="product-info">
      {/* ── Header row: category + SKU ── */}
      <div className="product-info__meta">
        <span className="product-info__category">{categoryLabel}</span>
        <span className="product-info__sku">
          {tPages("products.sku")} · {sku}
        </span>
      </div>

      {/* ── Title ── */}
      <h1 className="product-info__title">{title}</h1>

      {/* ── Owner pill ── */}
      {ownerName && (
        <Link href={ownerHref} className="product-info__owner">
          <span className="product-info__owner-avatar" aria-hidden>
            {ownerName.charAt(0).toUpperCase()}
          </span>
          <span className="product-info__owner-text">
            <span className="product-info__owner-by">
              {tPages("products.by")} {ownerName}
            </span>
          </span>
        </Link>
      )}

      {/* ── Price block ── */}
      <div className="product-info__price-row">
        <span className="product-info__price">{formattedPrice}</span>
        {hasDiscount && originalPrice && (
          <>
            <span className="product-info__price-old">₾{originalPrice}</span>
            <span className="product-info__save-badge">
              {tPages("products.save")} {product.discountPercent}%
            </span>
          </>
        )}
      </div>

      {/* ── Stock row ── */}
      <div
        className={`product-info__stock product-info__stock--${
          isInStock ? "in" : "out"
        }`}
      >
        <span className="product-info__stock-dot" />
        {isInStock ? (
          <>
            <strong>{tPages("products.in_stock")}</strong>
            {product.stockQuantity <= 5 && (
              <span className="product-info__stock-low">
                · {tPages("products.only")} {product.stockQuantity}{" "}
                {tPages("products.left")}
              </span>
            )}
          </>
        ) : (
          <strong>{tPages("products.out_of_stock")}</strong>
        )}
      </div>

      {/* ── Short description ── */}
      <p className="product-info__short-desc">{description}</p>

      {/* ── Action row: qty + add to cart ── */}
      <div className="product-info__actions">
        <div className="product-info__qty" aria-label="quantity selector">
          <button
            type="button"
            className="product-info__qty-btn"
            onClick={dec}
            disabled={qty <= 1}
            aria-label="decrease"
          >
            <MinusIcon />
          </button>
          <span className="product-info__qty-value">{qty}</span>
          <button
            type="button"
            className="product-info__qty-btn"
            onClick={inc}
            disabled={qty >= max}
            aria-label="increase"
          >
            <PlusIcon />
          </button>
        </div>

        <button
          type="button"
          className="product-info__cta product-info__cta--cart"
          disabled={!isInStock}
        >
          <CartIcon />
          <span>
            {tPages("products.add_to_cart")} · ₾{product.price * qty}
          </span>
        </button>
      </div>

      {/* ── Save / Share row ── */}
      <div className="product-info__secondary">
        <button
          type="button"
          className="product-info__ghost"
          aria-label={tPages("products.add_to_favourites")}
        >
          <HeartIcon size={18} />
          <span>{tPages("products.save")}</span>
        </button>

        <button
          type="button"
          className="product-info__ghost"
          aria-label={tPages("products.share")}
        >
          <ShareIcon size={18} />
          <span>{tPages("products.share")}</span>
        </button>
      </div>

      {/* ── Buy now (full width, outlined) ── */}
      <button
        type="button"
        className="product-info__buy-now"
        disabled={!isInStock}
        id={`buy-now-${product._id}`}
      >
        {tPages("products.buy_now")}
      </button>
    </div>
  );
}
