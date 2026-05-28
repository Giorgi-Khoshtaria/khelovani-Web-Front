"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { IProduct } from "@/lib/types/productTypes";
import { Partner } from "@/lib/types/partnerTypes";
import { useLanguage } from "@/contexts/LanguageContext";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import { useProductDisplay } from "@/lib/hooks/useProductDisplay";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
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
  const prefix = String(product.category || "PRD")
    .slice(0, 3)
    .toUpperCase();
  const tail = product._id.slice(-4).toUpperCase();
  return `${prefix}-${tail}`;
};

export default function ProductInfo({ product, partner }: ProductInfoProps) {
  const { lang } = useLanguage();
  const { t: tPages } = useClientTranslation("pages");
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { isFavorite, toggle } = useFavorites();
  const { addItem: addToCart, loading: cartLoading } = useCart();

  const favorited = isFavorite(product._id);

  const { title, description, categoryLabel, formattedPrice, isInStock } =
    useProductDisplay(product);

  const isEn = lang.toLowerCase() === "en";
  const ownerName = partner
    ? isEn && partner.companyNameEn
      ? partner.companyNameEn
      : partner.companyNameGe
    : null;
  const ownerHref = partner?._id ? `/partners/${partner._id}` : "#";

  const sku = useMemo(() => buildSku(product), [product]);

  const hasDiscount =
    !!product.isOnSale &&
    !!product.discountPercent &&
    product.discountPercent > 0;
  const originalPrice = hasDiscount ? product.price : null;

  // Quantity is bounded by remaining stock — cannot exceed stockQuantity.
  const stockLimit = Math.max(1, Math.min(product.stockQuantity || 0, 99));
  const [qty, setQty] = useState(1);
  const dec = () => setQty((q) => Math.max(1, q - 1));
  const inc = () => setQty((q) => Math.min(stockLimit, q + 1));
  const atMax = qty >= stockLimit;

  const handleAddToCart = async () => {
    if (!isInStock) return;
    await addToCart(product, qty);
    toast.success(tPages("cart.added") || "კალათაში დაემატა");
  };

  return (
    <div className="product-info">
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

      {/* ── Save / Share row ── */}
      <div className="product-info__secondary">
        <button
          type="button"
          className={`product-info__ghost${
            favorited ? " product-info__ghost--active" : ""
          }`}
          aria-label={tPages("products.add_to_favourites")}
          aria-pressed={favorited}
          onClick={() => {
            if (!isAuthenticated) {
              router.push("/login");
              return;
            }
            toggle(product._id);
          }}
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

      {/* ── Action row at bottom: qty + add to cart (outlined, full width) ── */}
      <div className="product-info__actions product-info__actions--bottom">
        <div className="product-info__qty" aria-label="quantity selector">
          <button
            type="button"
            className="product-info__qty-btn"
            onClick={dec}
            disabled={!isInStock || qty <= 1}
            aria-label="decrease"
          >
            <MinusIcon />
          </button>
          <span className="product-info__qty-value">{qty}</span>
          <button
            type="button"
            className="product-info__qty-btn"
            onClick={inc}
            disabled={!isInStock || atMax}
            aria-label="increase"
          >
            <PlusIcon />
          </button>
        </div>

        <button
          type="button"
          className="product-info__cta product-info__cta--cart product-info__cta--outlined"
          disabled={!isInStock || cartLoading}
          onClick={handleAddToCart}
        >
          <CartIcon />
          <span>
            {tPages("products.add_to_cart")} · ₾{product.price * qty}
          </span>
        </button>
      </div>
    </div>
  );
}
