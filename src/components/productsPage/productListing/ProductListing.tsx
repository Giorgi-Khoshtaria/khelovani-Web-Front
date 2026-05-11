"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import ProductCard from "../productCard/ProductCard";
import "./productListing.scss";
import { getProducts } from "@/apiCalls/productRequests/product.req";
import { IProduct, ProductCategory } from "@/lib/types/productTypes";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ProductSearch from "../ProductSearch/ProductSearch";
import CategoryFilter from "../CategoryFilter/CategoryFilter";
import ProductPagination from "../ProductPagination/ProductPagination";

interface ProductListingProps {
  initialProducts: IProduct[];
  initialTotalPages: number;
  initialTotalCount?: number;
}

const VALID_CATEGORIES = new Set<string>(Object.values(ProductCategory));

const sanitizeCategory = (raw: string | null): string => {
  if (!raw || raw === "all") return "all";
  return VALID_CATEGORIES.has(raw) ? raw : "all";
};

export default function ProductListing({
  initialProducts,
  initialTotalPages,
  initialTotalCount = 0,
}: ProductListingProps) {
  const { t: tCommon } = useClientTranslation("common");
  const { t: tPages } = useClientTranslation("pages");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialCategory = sanitizeCategory(searchParams.get("category"));
  const initialSearch = searchParams.get("search") ?? "";
  const initialPageParam = Number(searchParams.get("page")) || 1;

  const [products, setProducts] = useState<IProduct[]>(initialProducts);
  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);

  const [page, setPage] = useState(initialPageParam);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [totalCount, setTotalCount] = useState(initialTotalCount);
  const isFirstRender = useRef(true);

  // Keep state in sync with URL changes (back/forward nav, deep links)
  useEffect(() => {
    setActiveCategory(sanitizeCategory(searchParams.get("category")));
  }, [searchParams]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Sync filters to URL (replace, not push, to avoid history spam)
  useEffect(() => {
    if (isFirstRender.current) return;
    const params = new URLSearchParams();
    if (activeCategory !== "all") params.set("category", activeCategory);
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [activeCategory, debouncedSearch, page, pathname, router]);

  // Fetch products with abort-on-change to prevent stale results
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = {
          page,
          limit: 12,
          ...(debouncedSearch && { search: debouncedSearch }),
          ...(activeCategory !== "all" && { category: activeCategory }),
        };

        const response = await getProducts(params, controller.signal);
        if (controller.signal.aborted) return;
        setProducts(response.data);
        setTotalPages(response.meta?.totalPages ?? 1);

        // Only refresh global total when nothing is filtered, otherwise keep
        // the previous (unfiltered) total so the "X pieces" label stays stable.
        if (activeCategory === "all" && !debouncedSearch) {
          setTotalCount(response.meta?.totalCount ?? 0);
        }
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("Failed to fetch products:", error);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchProducts();
    return () => controller.abort();
  }, [debouncedSearch, activeCategory, page]);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(sanitizeCategory(cat));
    setPage(1);
  };

  const piecesLabel = tPages("home.stats.pieces") || "pieces";

  return (
    <section className="product-listing animate-in">
      <div className="product-listing__container">

        {/* Top row: search + count */}
        <div className="product-listing__topbar">
          <ProductSearch value={searchQuery} onChange={setSearchQuery} />
          <span className="product-listing__count">
            <strong>{totalCount}</strong> {piecesLabel}
          </span>
        </div>

        {/* Category chips row */}
        <CategoryFilter
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />

        {/* Grid */}
        <div className="product-listing__grid">
          {loading ? (
            <div className="product-listing__empty">
              <p>{tCommon("loading") || "Loading..."}</p>
            </div>
          ) : products.length > 0 ? (
            products.map((product) => (
              <Link key={product._id} href={`/products/${product._id}`}>
                <ProductCard product={product} />
              </Link>
            ))
          ) : (
            <div className="product-listing__empty">
              <p>{tPages("products.not_found")}</p>
            </div>
          )}
        </div>

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
