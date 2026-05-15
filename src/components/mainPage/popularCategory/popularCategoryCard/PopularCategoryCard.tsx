"use client";

import Image from "next/image";
import "./popularCategoryCard.scss";
import { getCategoryPlaceholder } from "@/lib/types/productTypes";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";

interface PopularCategoryCardProps {
  categoryName: string;
  slug: string;
  isFeatured?: boolean;
  productCount?: number;
}

function PopularCategoryCard({
  categoryName,
  slug,
  isFeatured,
  productCount,
}: PopularCategoryCardProps) {
  const { t } = useClientTranslation("pages");
  const imageSrc = getCategoryPlaceholder(slug);
  const count = productCount ?? 0;
  const piecesLabel = `${count} ${t("home.stats.pieces").toLowerCase()}`;

  if (isFeatured) {
    return (
      <article className="cat-card cat-card--featured">
        <Image
          src={imageSrc}
          alt={categoryName}
          fill
          className="cat-card__img"
          sizes="(max-width:960px) 90vw, 55vw"
        />
        <div className="cat-card__overlay" />

        <div className="cat-card__featured-body">
          <span className="cat-card__pieces-pill">{piecesLabel}</span>
          <h3 className="cat-card__featured-name">{categoryName}</h3>
          <span className="cat-card__cta">
            {t("home.popularCategory.explore")}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path
                d="M3.5 10.5 10.5 3.5M5 3.5h5.5V9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </article>
    );
  }

  return (
    <article className="cat-card">
      <div className="cat-card__media">
        <Image
          src={imageSrc}
          alt={categoryName}
          fill
          className="cat-card__img"
          sizes="(max-width:960px) 45vw, 22vw"
        />
      </div>
      <div className="cat-card__info">
        <h3 className="cat-card__name">{categoryName}</h3>
        <span className="cat-card__meta-count">{piecesLabel}</span>
        <span className="cat-card__meta-link">
          {t("home.popularCategory.explore")}
          <span aria-hidden="true">→</span>
        </span>
      </div>
    </article>
  );
}

export default PopularCategoryCard;
