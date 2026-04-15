"use client";

import { useRef, useState, useEffect } from "react";
import ProductCard from "../productCard/ProductCard";
import "./productListing.scss";
import { getProducts } from "@/apiCalls/productRequests/product.req";
import { IProduct, ProductCategory, PRODUCT_CATEGORY_LABELS } from "@/lib/types/productTypes";
import { useLanguage } from "@/contexts/LanguageContext";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";

interface ProductListingProps {
  initialProducts: IProduct[];
  initialTotalPages: number;
}

export default function ProductListing({ initialProducts, initialTotalPages }: ProductListingProps) {
  const { lang } = useLanguage();
  const currentLang = lang.toLowerCase() as "ge" | "en";
  const { t: tCommon } = useClientTranslation("common");

  const [products, setProducts] = useState<IProduct[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<ProductCategory | "all">("all");
  
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
            <div className="product-listing__search">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="search-icon">
                <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 21L16.65 16.65" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input 
                type="text" 
                placeholder="Search products or artisans..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="product-listing__category-select">
              <select 
                value={activeCategory} 
                onChange={(e) => handleCategoryChange(e.target.value as ProductCategory | "all")}
                aria-label="Filter by category"
              >
                {categoriesList.map(category => {
                  const isAll = category === "all";
                  const label = isAll ? "All Categories" : PRODUCT_CATEGORY_LABELS[category as ProductCategory]?.[currentLang] || category;
                  return (
                    <option key={category} value={category}>
                      {label}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          
          <button className="product-listing__favs-btn" aria-label="Favorites">
            <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.6667 1.33334C10.22 1.33334 8.97334 2.14668 8 3.32668C7.02667 2.14668 5.78 1.33334 4.33334 1.33334C1.94 1.33334 0 3.27334 0 5.66668C0 9.18668 8 14 8 14C8 14 16 9.18668 16 5.66668C16 3.27334 14.06 1.33334 11.6667 1.33334Z" fill="#F87171"/>
            </svg>
            <span>0 Favourites</span>
          </button>
        </div>

        {/* Dynamic Product Grid */}
        <div className="product-listing__grid">
          {loading ? (
            <div className="product-listing__empty">
              <p>{tCommon("loading") || "Loading..."}</p>
            </div>
          ) : products.length > 0 ? (
            products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <div className="product-listing__empty">
              <p>No products found matching your criteria.</p>
            </div>
          )}
        </div>
        
        {/* Pagination placeholder (if there are more pages) */}
        {!loading && totalPages > 1 && (
          <div className="product-listing__pagination">
            <button 
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
            >
              Previous
            </button>
            <span>Page {page} of {totalPages}</span>
            <button 
              disabled={page === totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
