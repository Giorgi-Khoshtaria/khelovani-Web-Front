// PopularProduct.tsx

"use client";

import { useRef } from "react";
import "./popularProducts.scss";
import { IProduct } from "@/lib/types/productTypes";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import Link from "next/link";
import ProductCard from "@/components/productsPage/productCard/ProductCard";
import { useRevealOnScroll } from "@/lib/hooks/useRevealOnScroll";

function PopularProduct({ pinnedProducts }: { pinnedProducts?: IProduct[] }) {
  const { t: Pages } = useClientTranslation("pages");
  const { t: Nav } = useClientTranslation("navigation");

  const sectionRef = useRef<HTMLElement>(null);

  useRevealOnScroll({
    ref: sectionRef,
  });

  return (
    <section className="popular-products" ref={sectionRef}>
      <div className="popular-products__header">
        <h2 className="popular-products__title">
          {Pages("home.popularProducts._title")}
        </h2>

        <Link href="/products" className="popular-products__view-all">
          {Nav("view_all")}
        </Link>
      </div>

      <div className="popular-products__cards">
        {pinnedProducts?.map((product) => (
          <Link key={product._id} href={`/products/${product._id}`}>
            <ProductCard product={product} />
          </Link>
        ))}
      </div>
    </section>
  );
}

export default PopularProduct;
