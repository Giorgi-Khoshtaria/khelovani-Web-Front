"use client";

import { useRef } from "react";
import Image from "next/image";
import "./categoryFilter.scss";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCategories } from "@/contexts/CategoriesContext";
import { getCategoryPlaceholder } from "@/lib/types/productTypes";

interface CategoryFilterProps {
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
}

export default function CategoryFilter({
  activeCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { lang } = useLanguage();
  const { categories, getLabel } = useCategories();
  const currentLang = lang.toLowerCase() as "ge" | "en";

  const allLabel = currentLang === "ge" ? "ყველა კატეგორია" : "All categories";

  const scroll = (dir: "prev" | "next") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "next" ? 280 : -280, behavior: "smooth" });
  };

  return (
    <div className="cat-chips">
      <button
        className="cat-chips__nav cat-chips__nav--prev"
        onClick={() => scroll("prev")}
        aria-label="Previous"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <div className="cat-chips__scroll" ref={scrollRef}>
        {/* All */}
        <button
          className={`cat-chip ${activeCategory === "all" ? "cat-chip--active" : ""}`}
          onClick={() => onCategoryChange("all")}
        >
          <span className="cat-chip__label">{allLabel}</span>
        </button>

        {/* Per-category chips */}
        {categories.map((cat) => (
          <button
            key={cat.slug}
            className={`cat-chip ${activeCategory === cat.slug ? "cat-chip--active" : ""}`}
            onClick={() => onCategoryChange(cat.slug)}
          >
            <span className="cat-chip__avatar">
              <Image
                src={getCategoryPlaceholder(cat.slug)}
                alt=""
                fill
                sizes="36px"
                style={{ objectFit: "cover" }}
              />
            </span>
            <span className="cat-chip__label">{getLabel(cat.slug, currentLang)}</span>
          </button>
        ))}
      </div>

      <button
        className="cat-chips__nav cat-chips__nav--next"
        onClick={() => scroll("next")}
        aria-label="Next"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  );
}
