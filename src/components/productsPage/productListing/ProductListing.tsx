"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import ProductCard from "../productCard/ProductCard";
import "./productListing.scss";
import { getProducts } from "@/apiCalls/productRequests/product.req";
import { IProduct } from "@/lib/types/productTypes";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ProductPagination from "../ProductPagination/ProductPagination";
import ProductFilters, {
  ProductFiltersState,
} from "../productFilters/ProductFilters";
import {
  clampPrice,
  PRICE_CEIL,
  PRICE_FLOOR,
  sanitizeCategory,
} from "@/lib/utils/productFilters";

interface ProductListingProps {
  initialProducts: IProduct[];
  initialTotalPages: number;
  initialTotalCount?: number;
}

export default function ProductListing({
  initialProducts,
  initialTotalPages,
  initialTotalCount = 0,
}: ProductListingProps) {
  const { t: tCommon } = useClientTranslation("common");
  const { t: tPages } = useClientTranslation("pages");
  const { lang } = useLanguage();
  const isGe = lang === "ge";

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialCategory = sanitizeCategory(searchParams.get("category"));
  const initialSearch = searchParams.get("search") ?? "";
  const initialPartners = (searchParams.get("partnerId") ?? "")
    .split(",")
    .filter(Boolean);
  const initialMin = clampPrice(searchParams.get("minPrice"), PRICE_FLOOR);
  const initialMaxRaw = searchParams.get("maxPrice");
  const initialMax =
    initialMaxRaw === null ? PRICE_CEIL : clampPrice(initialMaxRaw, PRICE_CEIL);
  const initialPageParam = Number(searchParams.get("page")) || 1;

  const [products, setProducts] = useState<IProduct[]>(initialProducts);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState<ProductFiltersState>({
    search: initialSearch,
    category: initialCategory,
    partnerIds: initialPartners,
    minPrice: initialMin,
    maxPrice: initialMax,
  });

  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);

  const [page, setPage] = useState(initialPageParam);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [totalCount, setTotalCount] = useState(initialTotalCount);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isFirstRender = useRef(true);

  const notifyEmptyCategory = () => {
    toast.info(
      tPages("products.category_empty_fallback") ||
        (isGe
          ? "ამ კატეგორიაში პროდუქტები არ მოიძებნა — ნაჩვენებია ყველა პროდუქტი"
          : "No products in this category — showing all products instead"),
    );
  };

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [filters.search]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  // Sync filters → URL
  useEffect(() => {
    if (isFirstRender.current) return;
    const params = new URLSearchParams();
    if (filters.category !== "all") params.set("category", filters.category);
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (filters.partnerIds.length)
      params.set("partnerId", filters.partnerIds.join(","));
    if (filters.minPrice > PRICE_FLOOR)
      params.set("minPrice", String(filters.minPrice));
    if (filters.maxPrice < PRICE_CEIL)
      params.set("maxPrice", String(filters.maxPrice));
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [
    filters.category,
    filters.partnerIds,
    filters.minPrice,
    filters.maxPrice,
    debouncedSearch,
    page,
    pathname,
    router,
  ]);

  // Fetch products with abort-on-change
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const controller = new AbortController();
    const hasFilters =
      filters.category !== "all" ||
      !!debouncedSearch ||
      filters.partnerIds.length > 0 ||
      filters.minPrice > PRICE_FLOOR ||
      filters.maxPrice < PRICE_CEIL;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = {
          page,
          limit: 12,
          ...(debouncedSearch && { search: debouncedSearch }),
          ...(filters.category !== "all" && { category: filters.category }),
          // Backend currently accepts a single partnerId — pass first selected.
          ...(filters.partnerIds[0] && { partnerId: filters.partnerIds[0] }),
          ...(filters.minPrice > PRICE_FLOOR && { minPrice: filters.minPrice }),
          ...(filters.maxPrice < PRICE_CEIL && { maxPrice: filters.maxPrice }),
        };

        const response = await getProducts(params, controller.signal);
        if (controller.signal.aborted) return;
        const resultCount = response.meta?.totalCount ?? 0;

        // A category with no matches is a dead end — fall back to showing
        // everything rather than leaving the visitor on an empty grid.
        if (filters.category !== "all" && resultCount === 0) {
          notifyEmptyCategory();
          setCategory("all");
          return;
        }

        setProducts(response.data);
        setTotalPages(response.meta?.totalPages ?? 1);

        // Only refresh the unfiltered total when no filters are active,
        // so the "X pieces" label stays stable while filtering.
        if (!hasFilters) {
          setTotalCount(resultCount);
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
  }, [
    debouncedSearch,
    filters.category,
    filters.partnerIds,
    filters.minPrice,
    filters.maxPrice,
    page,
  ]);

  const hasHandledEmptyInitialCategory = useRef(false);
  useEffect(() => {
    if (hasHandledEmptyInitialCategory.current) return;
    hasHandledEmptyInitialCategory.current = true;

    if (initialCategory !== "all" && initialTotalCount === 0) {
      notifyEmptyCategory();
      setCategory("all");
    }
  }, []);

  // ── Filter mutators ──────────────────────────────────────────
  const setSearch = (v: string) =>
    setFilters((prev) => ({ ...prev, search: v }));

  const setCategory = (slug: string) => {
    setFilters((prev) => ({ ...prev, category: sanitizeCategory(slug) }));
    setPage(1);
  };

  const togglePartner = (id: string) => {
    setFilters((prev) => ({
      ...prev,
      partnerIds: prev.partnerIds.includes(id)
        ? prev.partnerIds.filter((p) => p !== id)
        : [...prev.partnerIds, id],
    }));
    setPage(1);
  };

  const setPrice = (minPrice: number, maxPrice: number) => {
    setFilters((prev) => ({ ...prev, minPrice, maxPrice }));
    setPage(1);
  };

  const clearAll = () => {
    setFilters({
      search: "",
      category: "all",
      partnerIds: [],
      minPrice: PRICE_FLOOR,
      maxPrice: PRICE_CEIL,
    });
    setPage(1);
  };

  // ── Labels ──────────────────────────────────────────────────
  const piecesLabel =
    tPages("home.stats.pieces") || (isGe ? "ნამუშევარი" : "pieces");
  const filtersLabel = isGe ? "ფილტრები" : "Filters";

  const activeCount = useMemo(() => {
    let n = 0;
    if (filters.category !== "all") n++;
    if (filters.partnerIds.length) n += filters.partnerIds.length;
    if (filters.minPrice > PRICE_FLOOR || filters.maxPrice < PRICE_CEIL) n++;
    return n;
  }, [filters]);

  return (
    <section className="product-listing animate-in">
      <div className="product-listing__container">
        {/* Top row: Filters button + count */}
        <div className="product-listing__topbar">
          <button
            type="button"
            className="product-listing__filters-btn"
            onClick={() => setDrawerOpen(true)}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="7" y1="12" x2="17" y2="12" />
              <line x1="10" y1="18" x2="14" y2="18" />
            </svg>
            <span>{filtersLabel}</span>
            {activeCount > 0 && (
              <span className="product-listing__filters-badge">
                {activeCount}
              </span>
            )}
          </button>

          <span className="product-listing__count">
            <strong>{totalCount}</strong> {piecesLabel}
          </span>
        </div>

        {/* Grid */}
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

        {!loading && (
          <ProductPagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            isLoading={loading}
          />
        )}
      </div>

      <ProductFilters
        isOpen={drawerOpen}
        filters={filters}
        onClose={() => setDrawerOpen(false)}
        onSearchChange={setSearch}
        onCategoryChange={setCategory}
        onPartnerToggle={togglePartner}
        onPriceChange={setPrice}
        onClearAll={clearAll}
      />
    </section>
  );
}
