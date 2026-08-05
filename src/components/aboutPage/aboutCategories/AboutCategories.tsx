"use client";

import Link from "next/link";
import Image from "next/image";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import { getCategoryPlaceholder } from "@/lib/types/productTypes";
import type { PublicCategory } from "@/apiCalls/categoryRequests/category.req";
import "./aboutCategories.scss";

interface AboutCategoriesProps {
  categories: PublicCategory[];
}

/** Four pinned categories, image-forward — "what we carry" on the About page. */
export default function AboutCategories({ categories }: AboutCategoriesProps) {
  const { t } = useClientTranslation("pages");
  const { t: tNav } = useClientTranslation("navigation");
  const { lang } = useLanguage();

  const items = categories.slice(0, 4);
  if (items.length === 0) return null;

  return (
    <section className="about-categories">
      <div className="about-categories__header">
        <div className="about-categories__heading">
          <span className="about-categories__eyebrow">
            {t("about.categories_eyebrow")}
          </span>
          <h2 className="about-categories__title">{t("about.categories_title")}</h2>
          <p className="about-categories__subtitle">
            {t("about.categories_subtitle")}
          </p>
        </div>

        <Link href="/products" className="about-categories__view-all">
          {tNav("view_all")}
          <span aria-hidden="true">→</span>
        </Link>
      </div>

      <div className="about-categories__grid">
        {items.map((category) => {
          const name = lang === "ge" ? category.nameGe : category.nameEn;
          return (
            <Link
              key={category.slug}
              href={`/products?category=${category.slug}`}
              className="about-categories__card"
            >
              <Image
                src={getCategoryPlaceholder(category.slug)}
                alt={name}
                fill
                className="about-categories__img"
                sizes="(max-width: 900px) 50vw, 25vw"
              />
              <div className="about-categories__scrim" />
              <div className="about-categories__info">
                <h3 className="about-categories__name">{name}</h3>
                <span className="about-categories__count">
                  {category.productCount ?? 0} {t("home.stats.pieces")}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
