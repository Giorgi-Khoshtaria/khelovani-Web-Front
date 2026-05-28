"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProductDisplay } from "@/lib/hooks/useProductDisplay";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import {
  CATEGORY_PLACEHOLDER_MAP,
  type IPopulatedOwner,
} from "@/lib/types/productTypes";
import type { CartItem as CartItemType } from "@/lib/types/cartTypes";
import "./cartItem.scss";

interface Props {
  item: CartItemType;
}

const MinusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path
      d="M5 12h14"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 5v14M5 12h14"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M6 6l12 12M18 6 6 18"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

export default function CartItem({ item }: Props) {
  const { updateItem, removeItem, loading } = useCart();
  const { lang } = useLanguage();
  const { t: tPages } = useClientTranslation("pages");
  const isEn = lang.toLowerCase() === "en";

  const { product, quantity } = item;
  const { title, categoryLabel } = useProductDisplay(product);

  const owner = (
    typeof product.owner === "object" ? product.owner : null
  ) as IPopulatedOwner | null;
  const ownerName = owner
    ? isEn && owner.companyNameEn
      ? owner.companyNameEn
      : owner.companyNameGe
    : null;
  const ownerHref = owner?._id ? `/partners/${owner._id}` : "#";
  const location = isEn && product.locationEn ? product.locationEn : product.locationGe;

  const image =
    (product.images && product.images[0]) ||
    CATEGORY_PLACEHOLDER_MAP[product.category as keyof typeof CATEGORY_PLACEHOLDER_MAP] ||
    "/assets/placeholder/default.png";

  const hasDiscount = !!product.isOnSale && !!product.discountPercent;
  const unitPrice = hasDiscount
    ? Math.round(product.price * (1 - (product.discountPercent ?? 0) / 100))
    : product.price;
  const lineTotal = unitPrice * quantity;
  const showEach = quantity > 1;
  const stockLow =
    product.stockQuantity > 0 && product.stockQuantity <= 5;
  const atMax = quantity >= Math.min(product.stockQuantity, 99);

  return (
    <div className="cart-item">
      <Link
        href={`/products/${product._id}`}
        className="cart-item__media"
        aria-label={title}
      >
        <Image
          src={image}
          alt={title}
          fill
          sizes="120px"
          className="cart-item__img"
        />
        {product.isOneOfAKind && (
          <span className="cart-item__one-of">
            {tPages("cart.one_of_one") || "1 OF 1"}
          </span>
        )}
      </Link>

      <div className="cart-item__body">
        <div className="cart-item__top-row">
          <div className="cart-item__info">
            <span className="cart-item__category">{categoryLabel}</span>
            <Link
              href={`/products/${product._id}`}
              className="cart-item__title"
            >
              {title}
            </Link>
            {ownerName && (
              <Link href={ownerHref} className="cart-item__owner">
                {tPages("cart.by") || "By"} {ownerName}
                {location ? ` · ${location}` : ""}
              </Link>
            )}
          </div>

          <button
            type="button"
            className="cart-item__remove"
            onClick={() => removeItem(product._id)}
            disabled={loading}
            aria-label={tPages("cart.remove") || "ნივთის წაშლა"}
          >
            <CloseIcon />
          </button>
        </div>

        <div className="cart-item__controls">
          <div className="cart-item__qty" aria-label="quantity">
            <button
              type="button"
              className="cart-item__qty-btn"
              onClick={() => updateItem(product._id, quantity - 1)}
              disabled={loading || quantity <= 1}
              aria-label={tPages("cart.decrease") || "შემცირება"}
            >
              <MinusIcon />
            </button>
            <span className="cart-item__qty-value">{quantity}</span>
            <button
              type="button"
              className="cart-item__qty-btn"
              onClick={() => updateItem(product._id, quantity + 1)}
              disabled={loading || atMax}
              aria-label={tPages("cart.increase") || "გაზრდა"}
            >
              <PlusIcon />
            </button>
          </div>

          <div className="cart-item__price">
            {hasDiscount && (
              <span className="cart-item__price-strike">
                ₾{product.price}
              </span>
            )}
            <span className="cart-item__price-current">₾{lineTotal}</span>
            {showEach && (
              <span className="cart-item__price-each">
                ₾{unitPrice} {tPages("cart.each") || "each"}
              </span>
            )}
          </div>
        </div>

        {stockLow && (
          <span className="cart-item__stock-low">
            <span className="cart-item__stock-dot" />
            {tPages("cart.only") || "მხოლოდ"} {product.stockQuantity}{" "}
            {tPages("cart.left_order_soon") || "დარჩა — სასწრაფოდ"}
          </span>
        )}
      </div>
    </div>
  );
}
