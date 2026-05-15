import api from "../api";
import { IProduct } from "@/lib/types/productTypes";
import type { ProductCondition } from "@/lib/types/productCondition.enum";

export interface GetProductsParams {
  search?: string;
  category?: string;
  partnerId?: string;
  isShown?: boolean;
  page?: number;
  limit?: number;
}

export interface GetProductsResponse {
  data: IProduct[];
  meta: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

export const getProducts = async (
  params: GetProductsParams,
  signal?: AbortSignal,
): Promise<GetProductsResponse> => {
  const { data } = await api.get("/api/products", { params, signal });
  return { data: data.data, meta: data.meta };
};

export const getProductById = async (productId: string): Promise<IProduct> => {
  const { data } = await api.get<{ data: IProduct }>(
    `/api/products/${productId}`,
  );
  return data.data;
};
export type PinnedProductsGrouped = Record<ProductCondition, IProduct[]>;

export const getPinnedProducts = async (): Promise<PinnedProductsGrouped> => {
  const { data } = await api.get<{ data: PinnedProductsGrouped }>(`/api/products/pinned`);
  return data.data;
};
