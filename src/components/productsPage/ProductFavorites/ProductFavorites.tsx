"use client";

import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import "./productFavorites.scss";

interface ProductFavoritesProps {
  count: number;
}

export default function ProductFavorites({ count }: ProductFavoritesProps) {
  const { t } = useClientTranslation("pages");

  return (
    <button className="product-favorites" aria-label="Favorites">
      <svg
        width="16"
        height="15"
        viewBox="0 0 16 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="product-favorites__icon"
      >
        <path
          d="M11.6667 1.33334C10.22 1.33334 8.97334 2.14668 8 3.32668C7.02667 2.14668 5.78 1.33334 4.33334 1.33334C1.94 1.33334 0 3.27334 0 5.66668C0 9.18668 8 14 8 14C8 14 16 9.18668 16 5.66668C16 3.27334 14.06 1.33334 11.6667 1.33334Z"
          fill="#F87171"
        />
      </svg>
      <span className="product-favorites__text">
        {count} {t("product_listing.favourites") || "Favourites"}
      </span>
    </button>
  );
}
