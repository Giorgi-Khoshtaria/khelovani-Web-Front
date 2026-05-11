"use client";

import { memo } from "react";
import Image from "next/image";
import "./productCard.scss";
import { IProduct, IPopulatedOwner } from "@/lib/types/productTypes";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import { useProductDisplay } from "@/lib/hooks/useProductDisplay";
import { useProductImage } from "@/lib/hooks/useProductImage";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProductCardProps {
  product: IProduct;
}

function ProductCardImpl({ product }: ProductCardProps) {
  const { t: tNav } = useClientTranslation("navigation");
  const { t: tPages } = useClientTranslation("pages");
  const { lang } = useLanguage();
  const { title, categoryLabel, isOutOfStock } = useProductDisplay(product);
  const { imgSrc, handleImageError } = useProductImage(product);

  const populatedOwner =
    product.owner && typeof product.owner === "object"
      ? (product.owner as IPopulatedOwner)
      : null;
  const partnerName = populatedOwner
    ? (lang === "ge" ? populatedOwner.companyNameGe : populatedOwner.companyNameEn) ||
      populatedOwner.companyNameGe ||
      populatedOwner.companyNameEn
    : null;

  // Compute original price when discounted
  const oldPrice =
    product.isOnSale && product.discountPercent
      ? Math.round(product.price / (1 - product.discountPercent / 100))
      : null;

  // Top-left tag (sale > one-of-one > sold)
  const tag = isOutOfStock
    ? { label: tPages("products.out_of_stock") || "SOLD", mod: "sold" }
    : product.isOnSale && product.discountPercent
    ? { label: `-${product.discountPercent}%`, mod: "sale" }
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
          <span className={`pcard__tag pcard__tag--${tag.mod}`}>{tag.label}</span>
        )}

        <button className="pcard__fav" aria-label="Add to favorites">
          <svg width="16" height="15" viewBox="0 0 16 15" fill="none">
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
        {partnerName && (
          <span className="pcard__partner">By {partnerName}</span>
        )}
      </div>

      <div className="pcard__cta">
        <div className="pcard__prices">
          <span className="pcard__price">₾{product.price}</span>
          {oldPrice && (
            <span className="pcard__price-old">₾{oldPrice}</span>
          )}
        </div>

        {isOutOfStock ? (
          <button className="pcard__btn pcard__btn--sold" disabled>
            {tPages("products.out_of_stock") || "Sold"}
          </button>
        ) : (
          <button className="pcard__btn">
            {tNav("buy_now") || "Buy now"} <span className="pcard__btn-arrow">→</span>
          </button>
        )}
      </div>
    </article>
  );
}

const ProductCard = memo(ProductCardImpl);
export default ProductCard;
