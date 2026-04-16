"use client";

import { useRef, useState, useEffect } from "react";
import ProductCard from "../productCard/ProductCard";
import "./productListing.scss";
import { getProducts } from "@/apiCalls/productRequests/product.req";
import {
  IProduct,
  ProductCategory,
} from "@/lib/types/productTypes";
import { useLanguage } from "@/contexts/LanguageContext";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";

// Sub-components
import ProductSearch from "../ProductSearch/ProductSearch";
import CategoryFilter from "../CategoryFilter/CategoryFilter";
import ProductFavorites from "../ProductFavorites/ProductFavorites";
import ProductPagination from "../ProductPagination/ProductPagination";

interface ProductListingProps {
  initialProducts: IProduct[];
  initialTotalPages: number;
}

export default function ProductListing({
  initialProducts,
  initialTotalPages,
}: ProductListingProps) {
  const { lang } = useLanguage();
  const currentLang = lang.toLowerCase() as "ge" | "en";
  const { t: tCommon } = useClientTranslation("common");
  const { t: tPages } = useClientTranslation("pages");

  const [products, setProducts] = useState<IProduct[]>(initialProducts);
  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<ProductCategory | "all">(
    "all",
  );

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const isFirstRender = useRef(true);

  // Available categories for iteration
  const categoriesList = ["all", ...Object.values(ProductCategory)];

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
        setProducts(response.products);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [debouncedSearch, activeCategory, page]);

  const handleCategoryChange = (cat: ProductCategory | "all") => {
    setActiveCategory(cat);
    setPage(1); // Reset to page 1 on category change
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
              categoriesList={categoriesList}
              currentLang={currentLang}
            />
          </div>

          <ProductFavorites count={0} />
        </div>

        {/* Dynamic Product Grid */}
        <div className="product-listing__grid">
          {loading ? (
            <div className="product-listing__empty">
              <p>{tCommon("loading") || "Loading..."}</p>
            </div>
          ) : products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product._id} product={product} />
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
