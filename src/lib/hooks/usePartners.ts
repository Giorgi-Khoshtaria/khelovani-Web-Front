import { useState, useEffect, useRef } from "react";
import api from "@/lib/api";
import axios from "axios";
import {
  Partner,
  PaginatedPartnerResponse,
  PartnerFilterState,
} from "@/lib/types/partnerTypes";

/**
 * Senior-level hook for managing partner data with server-side filtering.
 * Features:
 * - Request cancellation (AbortController) to prevent race conditions.
 * - Robust error handling with user-friendly logging.
 * - Integrated search debouncing.
 */
export function usePartners(
  initialPartners: Partner[],
  initialTotalPages: number
) {
  const [partners, setPartners] = useState<Partner[]>(initialPartners);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<PartnerFilterState>({
    search: "",
    category: "",
    city: "",
    minRating: 0,
  });
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const isFirstMount = useRef(true);

  // ── Debounce search logic ──────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
      setPage(1);
    }, 450);
    return () => clearTimeout(timer);
  }, [filters.search]);

  // ── Fetch partners from API (Full Server-Side) ─────────────
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    const abortController = new AbortController();

    const fetchPartners = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data } = await api.get<PaginatedPartnerResponse>(
          "/api/partner",
          {
            signal: abortController.signal,
            params: {
              search: debouncedSearch || undefined,
              city: filters.city || undefined,
              category: filters.category || undefined,
              minRating: filters.minRating || undefined,
              page,
              limit: 12,
            },
          }
        );
        setPartners(data.data);
        setTotalPages(data.totalPages);
      } catch (err: unknown) {
        if (!axios.isCancel(err)) {
          console.error("Failed to fetch partners:", err);
          setError("Failed to load partners. Please try again.");
          setPartners([]);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchPartners();

    return () => abortController.abort();
  }, [debouncedSearch, filters.city, filters.category, filters.minRating, page]);

  // ── Actions ───────────────────────────────────────────────
  const updateFilter = <K extends keyof PartnerFilterState>(
    key: K,
    value: PartnerFilterState[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    if (key !== "search") setPage(1);
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "",
      city: "",
      minRating: 0,
    });
    setPage(1);
  };

  const activeFiltersCount =
    (filters.search ? 1 : 0) +
    (filters.category ? 1 : 0) +
    (filters.city ? 1 : 0) +
    (filters.minRating ? 1 : 0);

  return {
    partners,
    page,
    totalPages,
    isLoading,
    error,
    filters,
    activeFiltersCount,
    setPage,
    updateFilter,
    clearFilters,
  };
}
