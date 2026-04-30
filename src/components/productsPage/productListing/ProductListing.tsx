"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import ProductCard from "../productCard/ProductCard";
import "./productListing.scss";
import { getProducts } from "@/apiCalls/productRequests/product.req";
import { IProduct } from "@/lib/types/productTypes";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import { useSearchParams } from "next/navigation";
import ProductSearch from "../ProductSearch/ProductSearch";
import CategoryFilter from "../CategoryFilter/CategoryFilter";
import ProductPagination from "../ProductPagination/ProductPagination";

interface ProductListingProps {
  initialProducts: IProduct[];
  initialTotalPages: number;
}

export default function ProductListing({
  initialProducts,
  initialTotalPages,
}: ProductListingProps) {
  const { t: tCommon } = useClientTranslation("common");
  const { t: tPages } = useClientTranslation("pages");

  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") ?? "all";

  const [products, setProducts] = useState<IProduct[]>(initialProducts);
  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>(categoryParam);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const isFirstRender = useRef(true);

  // Sync with searchParams
  useEffect(() => {
    if (categoryParam) {
      setActiveCategory(categoryParam);
    } else {
      setActiveCategory("all");
    }
  }, [categoryParam]);

  // Debouncing search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset page on new search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetching data
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = {
          page,
          limit: 12,
          ...(debouncedSearch && { search: debouncedSearch }),
          ...(activeCategory !== "all" && { category: activeCategory }),
        };

        const response = await getProducts(params);
        setProducts(response.data);
        setTotalPages(response.meta?.totalPages ?? 1);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [debouncedSearch, activeCategory, page]);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setPage(1);
  };

  return (
    <section className="product-listing animate-in">
      <div className="product-listing__container">
        {/* Toolbar: Search, Filter & Favourites */}
        <div className="product-listing__toolbar">
          <div className="product-listing__filters">
            <ProductSearch value={searchQuery} onChange={setSearchQuery} />

            <CategoryFilter
              activeCategory={activeCategory}
              onCategoryChange={handleCategoryChange}
            />
          </div>
        </div>

        {/* Dynamic Product Grid */}
        <div className="product-listing__grid">
          {loading ? (
            <div className="product-listing__empty">
              <p>{tCommon("loading") || "Loading..."}</p>
            </div>
          ) : products.length > 0 ? (
            products.map((product) => (
              <Link key={product._id} href={`/products/${product._id}`} style={{ textDecoration: "none" }}>
                <ProductCard product={product} />
              </Link>
            ))
          ) : (
            <div className="product-listing__empty">
              <p>{tPages("products.not_found")}</p>
            </div>
          )}
        </div>

        {/* Pagination component */}
        {!loading && (
          <ProductPagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            isLoading={loading}
          />
        )}
      </div>
    </section>
  );
}
