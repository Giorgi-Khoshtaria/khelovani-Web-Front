"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  addFavorite as apiAdd,
  removeFavorite as apiRemove,
  getFavoriteIds,
} from "@/apiCalls/favoriteRequests/favorite.req";
import { useAuth } from "@/contexts/AuthContext";

interface FavoritesContextType {
  ids: Set<string>;
  isFavorite: (productId: string) => boolean;
  toggle: (productId: string) => Promise<boolean>;
  refresh: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined,
);

export const FavoritesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isAuthenticated, isHydrated } = useAuth();
  const [ids, setIds] = useState<Set<string>>(new Set());
  const inflight = useRef<Set<string>>(new Set());

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setIds(new Set());
      return;
    }
    try {
      const list = await getFavoriteIds();
      setIds(new Set(list));
    } catch {
      // 401 handled by axios interceptor; nothing useful to surface here.
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isHydrated) return;
    refresh();
  }, [isHydrated, refresh]);

  const toggle = useCallback(
    async (productId: string): Promise<boolean> => {
      if (!isAuthenticated) return false;
      if (inflight.current.has(productId)) return ids.has(productId);
      inflight.current.add(productId);

      const wasFavorite = ids.has(productId);
      // Optimistic flip — restore on failure
      setIds((prev) => {
        const next = new Set(prev);
        wasFavorite ? next.delete(productId) : next.add(productId);
        return next;
      });

      try {
        if (wasFavorite) await apiRemove(productId);
        else await apiAdd(productId);
        return !wasFavorite;
      } catch {
        setIds((prev) => {
          const next = new Set(prev);
          wasFavorite ? next.add(productId) : next.delete(productId);
          return next;
        });
        return wasFavorite;
      } finally {
        inflight.current.delete(productId);
      }
    },
    [ids, isAuthenticated],
  );

  const isFavorite = useCallback((id: string) => ids.has(id), [ids]);

  return (
    <FavoritesContext.Provider value={{ ids, isFavorite, toggle, refresh }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx)
    throw new Error("useFavorites must be used within a FavoritesProvider");
  return ctx;
};
