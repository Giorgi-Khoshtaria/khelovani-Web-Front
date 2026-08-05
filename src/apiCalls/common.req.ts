import api from "@/apiCalls/api";
import { Translations } from "@/lib/types/translations";

export const getTranslations = async (): Promise<Translations> => {
  try {
    const response = await api.get("/api/admin/translations?limit=0");

    if (response.data?.success && response.data?.data?.grouped) {
      return response.data.data.grouped as Translations;
    }
    return {};
  } catch (error) {
    console.error("Error fetching translations:", error);
    throw error;
  }
};

export interface PublicStats {
  makers: number;
  pieces: number;
  regions: number;
}

export const getPublicStats = async (): Promise<PublicStats> => {
  try {
    const [partnersRes, productsRes] = await Promise.all([
      api.get("/api/partner?limit=1"),
      api.get("/api/products?limit=1"),
    ]);
    return {
      makers: partnersRes.data?.meta?.totalCount ?? 0,
      pieces: productsRes.data?.meta?.totalCount ?? 0,
      regions: 12, // TODO: replace with distinct regions endpoint when available
    };
  } catch {
    return { makers: 0, pieces: 0, regions: 12 };
  }
};
