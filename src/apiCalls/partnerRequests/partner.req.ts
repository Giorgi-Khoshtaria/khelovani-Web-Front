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
): Promise<PaginatedPartnerResponse> => {
  try {
    const response = await api.get("/api/partner", { params, signal });
    return { data: response.data.data, meta: response.data.meta };
  } catch (error) {
    console.error("Error fetching partners:", error);
    throw error;
  }
};

export const getPartnerById = async (id: string, signal?: AbortSignal) => {
  try {
    const response = await api.get<{ data: Partner }>(`/api/partner/${id}`, {
      signal,
    });
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching partner with id ${id}:`, error);
    throw error;
  }
};

export const getPinnedPartners = async (signal?: AbortSignal) => {
  try {
    const response = await api.get<{ data: Partner[] }>("/api/partner/pinned", {
      signal,
    });

    // Safe fallback
    return response.data?.data || [];
  } catch (error) {
    console.error("Error fetching pinned partners:", error);
    return []; // ← Return empty array instead of throwing (better UX)
  }
};
