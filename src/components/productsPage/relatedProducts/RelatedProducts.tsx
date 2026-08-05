"use client";

import { useState, useEffect } from "react";
import { IProduct } from "@/lib/types/productTypes";
import { getProducts } from "@/apiCalls/productRequests/product.req";
import ProductCard from "../productCard/ProductCard";
import Skeleton from "@/components/ui/Skeleton";
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        setLoading(true);
        const res = await getProducts({ category, page: 1, limit: 8 });
        const filtered = (res.data ?? [])
          .filter((p) => p._id !== currentProductId)
          .slice(0, 4);
        setRelated(filtered);
      } catch (error) {
        console.error("Failed to fetch related products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelated();
  }, [currentProductId, category]);

  if (!loading && related.length === 0) return null;

  return (
    <section className="related-products">
      <h2 className="related-products__title">
        {tPages("products.related") || "Related Products"}
      </h2>
      <div className="related-products__grid">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="related-products__skeleton">
                <Skeleton height={220} radius={14} />
                <Skeleton height={18} width="70%" />
                <Skeleton height={14} width="40%" />
              </div>
            ))
          : related.map((p) => <ProductCard key={p._id} product={p} />)}
      </div>
    </section>
  );
}
