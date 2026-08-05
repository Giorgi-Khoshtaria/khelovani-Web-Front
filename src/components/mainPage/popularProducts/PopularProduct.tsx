"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import "./popularProducts.scss";
import type { PinnedProductsGrouped } from "@/apiCalls/productRequests/product.req";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import ProductCard from "@/components/productsPage/productCard/ProductCard";
import { useRevealOnScroll } from "@/lib/hooks/useRevealOnScroll";
import {
  ProductCondition,
  PRODUCT_CONDITIONS,
  CONDITION_LABELS,
} from "@/lib/types/productCondition.enum";
import { useLanguage } from "@/contexts/LanguageContext";

const EMPTY: PinnedProductsGrouped = {
  handmade: [],
  made_to_order: [],
  limited_edition: [],
  one_of_a_kind: [],
  restored: [],
  upcycled: [],
};

function PopularProduct({ grouped }: { grouped?: PinnedProductsGrouped }) {
  const { t } = useClientTranslation("pages");
  const { t: tNav } = useClientTranslation("navigation");
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState<ProductCondition>(
    ProductCondition.HANDMADE,
  );
  const sectionRef = useRef<HTMLElement>(null);

  useRevealOnScroll({ ref: sectionRef });

  const g = grouped ?? EMPTY;
  const visibleTabs = PRODUCT_CONDITIONS.filter((c) => (g[c]?.length ?? 0) > 0);
  const items = g[activeTab] ?? [];

  return (
    <section className="pop-products" ref={sectionRef}>
      <div className="pop-products__container">
        <div className="pop-products__header">
          <div className="pop-products__heading">
            {/* <span className="pop-products__eyebrow">
              {t("home.popularProducts.eyebrow")}
            </span> */}
            <h2 className="pop-products__title">
              {t("home.popularProducts._title")}
            </h2>
            <p className="pop-products__subtitle">
              {t("home.popularProducts._subtitle")}
            </p>
          </div>

          <Link href="/products" className="pop-products__view-all">
            {tNav("view_all")}
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="pop-products__tabs" role="tablist">
          {visibleTabs.map((condition) => (
            <button
              key={condition}
              role="tab"
              aria-selected={activeTab === condition}
              className={`pop-products__tab${activeTab === condition ? " pop-products__tab--active" : ""}`}
              onClick={() => setActiveTab(condition)}
            >
              {CONDITION_LABELS[condition][lang]}
              <span className="pop-products__tab-count">
                {g[condition].length}
              </span>
            </button>
          ))}
        </div>

        <div className="pop-products__grid">
          {items.map((product) => (
            <div key={product._id} className="pop-products__item">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PopularProduct;
