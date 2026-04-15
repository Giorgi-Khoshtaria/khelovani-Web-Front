"use client";

import "./productsHero.scss";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";

function ProductsHero() {
  const { t: tPages } = useClientTranslation("pages");

  // Fallback text if translations are missing
  const title = tPages("products.hero_title") || "Our Products";
  const desc = tPages("products.hero_description") || "Discover our amazing collection of products tailored for your needs.";

  return (
    <section className="products-hero">
      <div className="products-hero__inner">
        <h1 className="products-hero__title">
          {title === "products.hero_title" ? (
            <>Our <span>Products</span></>
          ) : title}
        </h1>
        <p className="products-hero__description">
          {desc === "products.hero_description" ? "Discover our amazing collection of products tailored for your needs." : desc}
        </p>
      </div>
    </section>
  );
}

export default ProductsHero;
