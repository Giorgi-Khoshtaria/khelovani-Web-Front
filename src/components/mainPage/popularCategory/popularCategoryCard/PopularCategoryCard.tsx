import React from "react";
import Image from "next/image";
import "./popularCategoryCard.scss";
import { getCategoryPlaceholder } from "@/lib/types/productTypes";

function PopularCategoryCard({ categoryName, slug }: { categoryName: string; slug: string }) {
  const imageSrc = getCategoryPlaceholder(slug);

  return (
    <div className="popular-category-card">
      <Image
        src={imageSrc}
        alt={categoryName}
        fill
        className="popular-category-card__image"
        sizes="(max-width: 768px) 50vw, 25vw"
      />
      <span className="popular-category-card__name">{categoryName}</span>
    </div>
  );
}

export default PopularCategoryCard;
