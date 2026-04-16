"use client";

import {
  ProductCategory,
  resolveCategoryLabel,
} from "@/lib/types/productTypes";
import "./categoryFilter.scss";

interface CategoryFilterProps {
  activeCategory: ProductCategory | "all";
  onCategoryChange: (cat: ProductCategory | "all") => void;
  categoriesList: string[];
  currentLang: "ge" | "en";
}

export default function CategoryFilter({
  activeCategory,
  onCategoryChange,
  categoriesList,
  currentLang,
}: CategoryFilterProps) {
  return (
    <div className="category-filter">
      <select
        value={activeCategory}
        onChange={(e) => onCategoryChange(e.target.value as ProductCategory | "all")}
        aria-label="Filter by category"
        className="category-filter__select"
      >
        {categoriesList.map((category) => {
          const isAll = category === "all";
          const label = isAll
            ? currentLang === "ge"
              ? "ყველა კატეგორია"
              : "All Categories"
            : resolveCategoryLabel(category, currentLang);
          return (
            <option key={category} value={category}>
              {label}
            </option>
          );
        })}
      </select>
    </div>
  );
}
