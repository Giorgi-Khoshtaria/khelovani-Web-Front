import api from "@/apiCalls/api";
import type { IProduct } from "@/lib/types/productTypes";

export interface FavoriteItem {
  _id: string;
  savedAt: string;
  priceAtSave: number;
  priceDropped: boolean;
  product: IProduct;
}

export interface FavoriteStats {
  total: number;
  priceDrops: number;
  totalValue: number;
  categories: Record<string, number>;
}

export type FavoriteSort =
  | "recent"
  | "oldest"
  | "priceAsc"
  | "priceDesc";

export interface GetFavoritesResponse {
  items: FavoriteItem[];
  stats: FavoriteStats;
}

const authHeader = (token?: string) =>
  token ? { Authorization: `Bearer ${token}` } : undefined;

export const getFavorites = async (
  params: { category?: string; sort?: FavoriteSort } = {},
  token?: string,
): Promise<GetFavoritesResponse> => {
  const res = await api.get("/api/favorites", {
    params,
    headers: authHeader(token),
  });
  return {
    items: res.data.data ?? [],
    stats: res.data.meta?.stats ?? {
      total: 0,
      priceDrops: 0,
      totalValue: 0,
      categories: {},
    },
  };
};

export const getFavoriteIds = async (token?: string): Promise<string[]> => {
  const res = await api.get("/api/favorites/ids", { headers: authHeader(token) });
  return res.data.data ?? [];
};

export const addFavorite = async (productId: string): Promise<void> => {
  await api.post(`/api/favorites/${productId}`);
};

export const removeFavorite = async (productId: string): Promise<void> => {
  await api.delete(`/api/favorites/${productId}`);
};

export const clearFavorites = async (): Promise<void> => {
  await api.delete("/api/favorites");
};
