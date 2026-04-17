"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { IProduct } from "@/lib/types/productTypes";
import { getProducts } from "@/apiCalls/productRequests/product.req";
import ProductCard from "../productCard/ProductCard";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import "./relatedProducts.scss";

interface RelatedProductsProps {
  currentProductId: string;
  category: string;
}

export default function RelatedProducts({
  currentProductId,
  category,
}: RelatedProductsProps) {
  const { t: tPages } = useClientTranslation("pages");
  const [related, setRelated] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        setLoading(true);
        const res = await getProducts({ category, limit: 12 });
        // Filter out the current product and take first 4
        const filtered = res.products
          .filter((p) => p._id !== currentProductId)
          .slice(0, 4);
        setRelated(filtered);
      } catch (error) {
        console.error("Failed to fetch related products:", error);
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      fetchRelated();
    }
  }, [currentProductId, category]);

  if (!loading && related.length === 0) return null;

  return (
    <section className="related-products">
      <h2 className="related-products__title">
        {tPages("products.related") || "Related Products"}
      </h2>
      <div className="related-products__grid">
        {loading ? (
          <p>Loading...</p>
        ) : (
          related.map((p) => (
            <Link
              key={p._id}
              href={`/products/${p._id}`}
              style={{ textDecoration: "none" }}
            >
              <ProductCard product={p} />
            </Link>
          ))
        )}
      </div>
    </section>
  );
}
