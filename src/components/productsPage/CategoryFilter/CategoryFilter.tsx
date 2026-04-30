"use client";

import { useState, useRef, useEffect } from "react";
import "./categoryFilter.scss";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCategories } from "@/contexts/CategoriesContext";

interface CategoryFilterProps {
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
}

export default function CategoryFilter({
  activeCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { lang } = useLanguage();
  const { categories, getLabel } = useCategories();
  const currentLang = lang.toLowerCase() as "ge" | "en";

  const allLabel = currentLang === "ge" ? "ყველა კატეგორია" : "All Categories";
  const activeLabel = activeCategory === "all" ? allLabel : getLabel(activeCategory, currentLang);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleSelect = (cat: string) => {
    onCategoryChange(cat);
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
          <li
            className={`category-filter__item ${activeCategory === "all" ? "category-filter__item--active" : ""}`}
            onClick={() => handleSelect("all")}
            role="option"
            aria-selected={activeCategory === "all"}
          >
            {allLabel}
          </li>
          {categories.map((cat) => (
            <li
              key={cat.slug}
              className={`category-filter__item ${activeCategory === cat.slug ? "category-filter__item--active" : ""}`}
              onClick={() => handleSelect(cat.slug)}
              role="option"
              aria-selected={activeCategory === cat.slug}
            >
              {getLabel(cat.slug, currentLang)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
