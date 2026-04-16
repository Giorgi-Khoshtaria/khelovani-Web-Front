"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import "./productCard.scss";
import {
  IProduct,
  getCategoryPlaceholder,
  resolveCategoryLabel,
} from "@/lib/types/productTypes";
import { useLanguage } from "@/contexts/LanguageContext";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";

interface ProductCardProps {
  product: IProduct;
}

const DEFAULT_PLACEHOLDER = "/assets/placeholder/default.png";

export default function ProductCard({ product }: ProductCardProps) {
  const { lang } = useLanguage();
  const currentLang = lang.toLowerCase() as "ge" | "en";
  const { t: tCommon } = useClientTranslation("common");
  const { t: tNav } = useClientTranslation("navigation");

  const title =
    currentLang === "en" && product.titleEn ? product.titleEn : product.titleGe;

  const categoryLabel = resolveCategoryLabel(product.category, currentLang);

  const categoryPlaceholder = getCategoryPlaceholder(
    product.category as string,
  );
  const initialSrc = product.images?.[0] || categoryPlaceholder;

  const [imgSrc, setImgSrc] = useState(initialSrc);
  const [isPlaceholder, setIsPlaceholder] = useState(!product.images?.[0]);
  const [usedDefault, setUsedDefault] = useState(false);

  const isOutOfStock = product.stockQuantity <= 0;

  useEffect(() => {
    setUsedDefault(false);
    if (product.images?.[0]) {
      setImgSrc(product.images[0]);
      setIsPlaceholder(false);
    } else {
      setImgSrc(categoryPlaceholder);
      setIsPlaceholder(true);
    }
  }, [product.images, categoryPlaceholder]);

  const handleImageError = () => {
    if (!isPlaceholder) {
      // Real image failed → try category placeholder
      setImgSrc(categoryPlaceholder);
      setIsPlaceholder(true);
    } else if (!usedDefault) {
      // Category placeholder also failed → nuclear fallback
      setImgSrc(DEFAULT_PLACEHOLDER);
      setUsedDefault(true);
    }
  };

  return (
    <div className="product-card">
      <div className="product-card__image-container">
        <Image
          src={imgSrc}
          alt={title}
          fill
          className="product-card__image"
          style={{ objectFit: "cover" }}
          onError={handleImageError}
        />

        {isPlaceholder && (
          <div className="product-card__placeholder-overlay">
            {tCommon("sample_image")}
          </div>
        )}

        {!isOutOfStock && (
          <button
            className="product-card__fav-btn"
            aria-label="Add to favorites"
          >
            <svg
              width="16"
              height="15"
              viewBox="0 0 16 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.6667 1.33334C10.22 1.33334 8.97334 2.14668 8 3.32668C7.02667 2.14668 5.78 1.33334 4.33334 1.33334C1.94 1.33334 0 3.27334 0 5.66668C0 9.18668 8 14 8 14C8 14 16 9.18668 16 5.66668C16 3.27334 14.06 1.33334 11.6667 1.33334Z"
                stroke="#9CA3AF"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>

      <div className="product-card__content">
        <span className="product-card__category">{categoryLabel}</span>
        <h3 className="product-card__title" title={title}>
          {title}
        </h3>

        <div className="product-card__footer">
          <span className="product-card__price">₾{product.price}</span>
          <button className="product-card__buy-btn" disabled={isOutOfStock}>
            <svg
              width="14"
              height="13"
              viewBox="0 0 14 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.16669 1.16667H2.91669L4.47419 9.77583C4.54575 10.1744 4.76632 10.528 5.0931 10.7675C5.41987 11.007 5.82987 11.1147 6.24169 11.0717H11.3167C11.7285 11.1147 12.1385 11.007 12.4653 10.7675C12.792 10.528 13.0126 10.1744 13.0842 9.77583L14 4.66667H3.50002"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {tNav("buy_now")}
          </button>
        </div>
      </div>
    </div>
  );
}
