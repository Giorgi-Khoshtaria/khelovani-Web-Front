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
  const { t: tPages } = useClientTranslation("pages");
  const imageSrc = getCategoryPlaceholder(slug);

  return (
    <div className={`cat-card${isFeatured ? " cat-card--featured" : ""}`}>
      <Image
        src={imageSrc}
        alt={categoryName}
        fill
        className="cat-card__img"
        sizes={isFeatured ? "(max-width:960px) 90vw, 55vw" : "(max-width:960px) 45vw, 22vw"}
      />
      <div className="cat-card__overlay" />
      <div className="cat-card__body">
        {productCount != null && (
          <span className="cat-card__meta">
            {productCount} {tPages("home.stats.pieces")}
            {isFeatured && (
              <span className="cat-card__featured-badge">
                {" · "}
                {tPages("home.featured")}
              </span>
            )}
          </span>
        )}
        <span className="cat-card__name">{categoryName}</span>
      </div>
    </div>
  );
}

export default PopularCategoryCard;
