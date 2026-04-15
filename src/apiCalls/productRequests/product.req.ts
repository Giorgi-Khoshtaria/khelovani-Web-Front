import api from "../api";
import { IProduct } from "@/lib/types/productTypes";

export interface GetProductsParams {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export interface GetProductsResponse {
  products: IProduct[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export const getProducts = async (
  params: GetProductsParams
): Promise<GetProductsResponse> => {
  const { data } = await api.get<GetProductsResponse>("/api/products", {
    params,
  });
  return data;
};
