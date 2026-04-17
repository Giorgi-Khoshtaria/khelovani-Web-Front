"use client";

import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import "./productSearch.scss";

interface ProductSearchProps {
  value: string;
  onChange: (val: string) => void;
}

export default function ProductSearch({ value, onChange }: ProductSearchProps) {
  const { t } = useClientTranslation("inputs");

  return (
    <div className="product-search">
      <div className="product-search__input-wrapper">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="product-search__icon"
        >
          <path
            d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M21 21L16.65 16.65"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <input
          type="text"
          placeholder={
            t("partner_listing.search_placeholder") ||
            "Search products or artisans..."
          }
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="product-search__input"
          aria-label="Search products"
        />
        {value && (
          <button
            className="product-search__clear"
            onClick={() => onChange("")}
            aria-label="Clear search"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
