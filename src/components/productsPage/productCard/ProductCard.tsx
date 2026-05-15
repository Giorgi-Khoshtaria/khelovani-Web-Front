"use client";

import { memo } from "react";
import Image from "next/image";
import "./productCard.scss";
import { IProduct, IPopulatedOwner } from "@/lib/types/productTypes";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import { useProductDisplay } from "@/lib/hooks/useProductDisplay";
import { useProductImage } from "@/lib/hooks/useProductImage";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  product: IProduct;
}

function ProductCardImpl({ product }: ProductCardProps) {
  const { isAuthenticated } = useAuth();
  const { isFavorite, toggle } = useFavorites();
  const router = useRouter();
  const favorited = isFavorite(product._id);
  const { t: tPages } = useClientTranslation("pages");
  const { t: tNav } = useClientTranslation("navigation");
  const { lang } = useLanguage();
  const { title, categoryLabel, isOutOfStock } = useProductDisplay(product);
  const { imgSrc, handleImageError } = useProductImage(product);

  const populatedOwner =
    product.owner && typeof product.owner === "object"
      ? (product.owner as IPopulatedOwner)
      : null;
  const partnerName = populatedOwner
    ? (lang === "ge"
        ? populatedOwner.companyNameGe
        : populatedOwner.companyNameEn) ||
      populatedOwner.companyNameGe ||
      populatedOwner.companyNameEn
    : null;

  const oldPrice =
    product.isOnSale && product.discountPercent
      ? Math.round(product.price / (1 - product.discountPercent / 100))
      : null;

  const tag = isOutOfStock
    ? { label: tPages("products.out_of_stock") || "SOLD", mod: "sold" }
    : product.isOnSale && product.discountPercent
    ? { label: `- ${product.discountPercent}%`, mod: "sale" }
    : product.isOneOfAKind
    ? { label: "1 OF 1", mod: "one" }
    : null;

  return (
    <article className="pcard">
      <div className="pcard__image">
        <Image
          src={imgSrc}
          alt={title}
          fill
          className="pcard__img"
          sizes="(max-width:640px) 90vw, (max-width:1024px) 44vw, 22vw"
          onError={handleImageError}
        />

        {tag && (
          <span className={`pcard__tag pcard__tag--${tag.mod}`}>
            {tag.label}
          </span>
        )}

        <button
          type="button"
          className={`pcard__fav${favorited ? " pcard__fav--active" : ""}`}
          aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={favorited}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!isAuthenticated) {
              router.push("/login");
              return;
            }
            toggle(product._id);
          }}
        >
          <svg width="16" height="15" viewBox="0 0 16 15" fill={favorited ? "currentColor" : "none"}>
            <path
              d="M11.667 1.333c-1.447 0-2.694.814-3.667 1.994C7.027 2.147 5.78 1.333 4.333 1.333 1.94 1.333 0 3.273 0 5.667 0 9.187 8 14 8 14s8-4.813 8-8.333c0-2.394-1.94-4.334-4.333-4.334Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className="pcard__info">
        <span className="pcard__category">{categoryLabel}</span>
        <h3 className="pcard__title">{title}</h3>
        <span className="pcard__partner">
          {partnerName ?? ""}
        </span>
      </div>

      <div className="pcard__cta">
        <div className="pcard__prices">
          <span className="pcard__price">₾{product.price}</span>
          {oldPrice && (
            <span className="pcard__price-old">₾{oldPrice}</span>
          )}
        </div>

        <button
          type="button"
          className="pcard__cart"
          aria-label={tNav("buy_now")}
          disabled={isOutOfStock}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M2.5 3.5h2l1.4 7.4a1.2 1.2 0 0 0 1.18.97h5.27a1.2 1.2 0 0 0 1.18-1L14.5 5.5h-9"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="6.5" cy="13.5" r="1" fill="currentColor" />
            <circle cx="11.5" cy="13.5" r="1" fill="currentColor" />
          </svg>
        </button>
      </div>
    </article>
  );
}

const ProductCard = memo(ProductCardImpl);
export default ProductCard;
