// PopularCategory.tsx

"use client";

import { useRef } from "react";
import "./popularCategory.scss";
import PopularCategoryCard from "./popularCategoryCard/PopularCategoryCard";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import type { PublicCategory } from "@/apiCalls/categoryRequests/category.req";
import Link from "next/link";
import { useRevealOnScroll } from "@/lib/hooks/useRevealOnScroll";

function PopularCategory({
  pinnedCategories,
}: {
  pinnedCategories: PublicCategory[];
}) {
  const { t: Pages } = useClientTranslation("pages");
  const { lang } = useLanguage();

  const sectionRef = useRef<HTMLElement>(null);

  useRevealOnScroll({
    ref: sectionRef,
  });

  return (
    <section className="popular-category" ref={sectionRef}>
      <h2 className="popular-category__title">
        {Pages("home.popularCategory._title")}
      </h2>

      <div className="popular-category__cards">
        {pinnedCategories.map((category) => (
          <Link
            key={category.slug}
            href={`/products?category=${category.slug}`}
          >
            <PopularCategoryCard
              slug={category.slug}
              categoryName={lang === "ge" ? category.nameGe : category.nameEn}
            />
          </Link>
        ))}
      </div>
    </section>
  );
}

export default PopularCategory;
