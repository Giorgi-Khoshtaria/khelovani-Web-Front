"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  clearFavorites,
  getFavorites,
  type FavoriteItem,
  type FavoriteSort,
  type FavoriteStats,
} from "@/apiCalls/favoriteRequests/favorite.req";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";

interface FavoritesState {
  items: FavoriteItem[];
  stats: FavoriteStats;
  category: string;
  sort: FavoriteSort;
  sortOpen: boolean;
  loading: boolean;
  setCategory: (v: string) => void;
  setSort: (v: FavoriteSort) => void;
  toggleSortOpen: () => void;
  closeSortMenu: () => void;
  handleClear: () => void;
}

const FavoritesStateContext = createContext<FavoritesState | null>(null);

export function useFavoritesState() {
  const ctx = useContext(FavoritesStateContext);
  if (!ctx) throw new Error("useFavoritesState must be inside FavoritesStateProvider");
  return ctx;
}

interface ProviderProps {
  initialItems: FavoriteItem[];
  initialStats: FavoriteStats;
  children: React.ReactNode;
}

export function FavoritesStateProvider({ initialItems, initialStats, children }: ProviderProps) {
  const { ids, refresh } = useFavorites();
  const { t: tCommon } = useClientTranslation("common");
  const isFirst = useRef(true);

  const [items, setItems] = useState<FavoriteItem[]>(initialItems);
  const [stats, setStats] = useState<FavoriteStats>(initialStats);
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<FavoriteSort>("recent");
  const [sortOpen, setSortOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isFirst.current) { isFirst.current = false; return; }
    let cancelled = false;
    setLoading(true);
    getFavorites({ sort, category: category === "all" ? undefined : category })
      .then((res) => { if (!cancelled) { setItems(res.items); setStats(res.stats); } })
      .catch(() => undefined)
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [sort, category]);

  useEffect(() => {
    setItems((prev) => prev.filter((i) => ids.has(i.product._id)));
  }, [ids]);

  const handleClear = async () => {
    if (!items.length) return;
    if (!window.confirm(tCommon("clear_confirm") || "Clear all favorites?")) return;
    await clearFavorites();
    setItems([]);
    setStats({ total: 0, priceDrops: 0, totalValue: 0, categories: {} });
    await refresh();
  };

  return (
    <FavoritesStateContext.Provider
      value={{
        items,
        stats,
        category,
        sort,
        sortOpen,
        loading,
        setCategory,
        setSort,
        toggleSortOpen: () => setSortOpen((v) => !v),
        closeSortMenu: () => setSortOpen(false),
        handleClear,
      }}
    >
      {children}
    </FavoritesStateContext.Provider>
  );
}
