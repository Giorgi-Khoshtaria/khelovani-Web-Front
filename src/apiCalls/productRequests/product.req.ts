import api from "../api";
import { IProduct } from "@/lib/types/productTypes";

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
  };
}

export const getProducts = async (
  params: GetProductsParams,
): Promise<GetProductsResponse> => {
  const { data } = await api.get("/api/products", { params });
  return { data: data.data, meta: data.meta };
};

export const getProductById = async (productId: string): Promise<IProduct> => {
  const { data } = await api.get<{ data: IProduct }>(
    `/api/products/${productId}`,
  );
  return data.data;
};
export const getPinnedProducts = async (): Promise<IProduct[]> => {
  const { data } = await api.get<{ data: IProduct[] }>(`/api/products/pinned`);
  return data.data;
};
