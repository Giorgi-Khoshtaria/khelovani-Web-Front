"use client";

import { useState, useRef, useEffect } from "react";
import {
  ProductCategory,
  resolveCategoryLabel,
} from "@/lib/types/productTypes";
import "./categoryFilter.scss";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const activeLabel =
    activeCategory === "all"
      ? currentLang === "ge"
        ? "ყველა კატეგორია"
        : "All Categories"
      : resolveCategoryLabel(activeCategory, currentLang);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (category: string) => {
    onCategoryChange(category as ProductCategory | "all");
    setIsOpen(false);
  };

  return (
    <div className="category-filter" ref={dropdownRef}>
      <button
        className={`category-filter__button ${isOpen ? "category-filter__button--open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="category-filter__label">{activeLabel}</span>
        <svg
          className="category-filter__chevron"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <ul className="category-filter__menu" role="listbox">
          {categoriesList.map((category) => {
            const isAll = category === "all";
            const isActive = activeCategory === category;
            const label = isAll
              ? currentLang === "ge"
                ? "ყველა კატეგორია"
                : "All Categories"
              : resolveCategoryLabel(category, currentLang);
            console.log(category, currentLang);
            return (
              <li
                key={category}
                className={`category-filter__item ${isActive ? "category-filter__item--active" : ""}`}
                onClick={() => handleSelect(category)}
                role="option"
                aria-selected={isActive}
              >
                {label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
