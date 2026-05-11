"use client";

import { useRef, useState } from "react";
import "./popularProducts.scss";
import type { PinnedProductsGrouped } from "@/apiCalls/productRequests/product.req";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import Link from "next/link";
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
  const { t: tNav } = useClientTranslation("navigation");
  const { t: tPages } = useClientTranslation("pages");
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState<ProductCondition>(
    ProductCondition.HANDMADE,
  );
  const sectionRef = useRef<HTMLElement>(null);

  useRevealOnScroll({ ref: sectionRef });

  const g = grouped ?? EMPTY;

  // only render tabs that have at least one product
  const visibleTabs = PRODUCT_CONDITIONS.filter((c) => (g[c]?.length ?? 0) > 0);
  const items = g[activeTab] ?? [];

  return (
    <section className="pop-products" ref={sectionRef}>
      <div className="pop-products__header">
        <h2 className="pop-products__title">
          {tPages("home.popularProducts._title") || "Popular Products"}
        </h2>
        <Link href="/products" className="pop-products__view-all">
          {tNav("view_all")} →
        </Link>
      </div>

      <div className="pop-products__tabs">
        {visibleTabs.map((condition) => (
          <button
            key={condition}
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
          <Link
            key={product._id}
            href={`/products/${product._id}`}
            className="pop-products__item"
          >
            <ProductCard product={product} />
          </Link>
        ))}
      </div>
    </section>
  );
}

export default PopularProduct;
