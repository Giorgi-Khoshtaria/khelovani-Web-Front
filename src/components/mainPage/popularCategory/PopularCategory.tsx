"use client";

import { useRef } from "react";
import Link from "next/link";
import "./popularCategory.scss";
import PopularCategoryCard from "./popularCategoryCard/PopularCategoryCard";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import type { PublicCategory } from "@/apiCalls/categoryRequests/category.req";
import { useRevealOnScroll } from "@/lib/hooks/useRevealOnScroll";

function PopularCategory({
  pinnedCategories,
}: {
  pinnedCategories: PublicCategory[];
}) {
  const { t } = useClientTranslation("pages");
  const { t: tNav } = useClientTranslation("navigation");
  const { lang } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);

  useRevealOnScroll({ ref: sectionRef });

  const [featured, ...rest] = pinnedCategories;

  return (
    <section className="pop-cat" ref={sectionRef}>
      <div className="pop-cat__container">
        <div className="pop-cat__header">
          <div className="pop-cat__heading">
            <h2 className="pop-cat__title">
              {t("home.popularCategory._title")}
            </h2>
            <p className="pop-cat__subtitle">
              {t("home.popularCategory._subtitle")}
            </p>
          </div>

          <Link href="/products" className="pop-cat__view-all">
            {tNav("view_all")}
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="pop-cat__grid">
          {featured && (
            <Link
              href={`/products?category=${featured.slug}`}
              className="pop-cat__item pop-cat__item--featured"
            >
              <PopularCategoryCard
                slug={featured.slug}
                categoryName={lang === "ge" ? featured.nameGe : featured.nameEn}
                productCount={featured.productCount}
                isFeatured
              />
            </Link>
          )}

          <div className="pop-cat__grid-right">
            {rest.slice(0, 4).map((category) => (
              <Link
                key={category.slug}
                href={`/products?category=${category.slug}`}
                className="pop-cat__item"
              >
                <PopularCategoryCard
                  slug={category.slug}
                  categoryName={
                    lang === "ge" ? category.nameGe : category.nameEn
                  }
                  productCount={category.productCount}
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default PopularCategory;
