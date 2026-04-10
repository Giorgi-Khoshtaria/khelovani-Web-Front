import api from "@/apiCalls/api";
import { PaginatedPartnerResponse, Partner } from "@/lib/types/partnerTypes";

export interface GetPartnersParams {
  search?: string;
  city?: string;
  category?: string;
  minRating?: number;
  page?: number;
  limit?: number;
}

export const getPartners = async (
  params?: GetPartnersParams,
  signal?: AbortSignal,
) => {
  try {
    const response = await api.get<PaginatedPartnerResponse>("/api/partner", {
      params,
      signal,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching partners:", error);
    throw error;
  }
};

export const getPartnerById = async (id: string, signal?: AbortSignal) => {
  try {
    const response = await api.get<Partner>(`/api/partner/${id}`, {
      signal,
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching partner with id ${id}:`, error);
    throw error;
  }
};
