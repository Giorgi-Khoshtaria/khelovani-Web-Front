"use client";

import React from "react";
import Link from "next/link";
import { useCategories } from "@/contexts/CategoriesContext";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import "./FooterCategories.scss";

export default function FooterCategories() {
  const { lang } = useLanguage();
  const { categories } = useCategories();
  const { t } = useClientTranslation("inputs");

  const currentLang = lang.toLowerCase() as "ge" | "en";
  const title = t("label.category") || "Categories";

  return (
    <div className="khelovani-footer__column">
      <h4 className="khelovani-footer__title">{title}</h4>
      <ul className="khelovani-footer__list">
        {categories.slice(0, 5).map((category) => (
          <li key={category.slug}>
            <Link href={`/products?category=${category.slug}`}>
              {currentLang === "en" ? category.nameEn : category.nameGe}
            </Link>
          </li>
        ))}
        {categories.length === 0 && (
          <>
            <li>
              <Link href="/products?category=paintings">Paintings</Link>
            </li>
            <li>
              <Link href="/products?category=crafts">Crafts</Link>
            </li>
            <li>
              <Link href="/products?category=jewelry">Jewelry</Link>
            </li>
            <li>
              <Link href="/products?category=textiles">Textiles</Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}
