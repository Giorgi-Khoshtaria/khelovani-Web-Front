import api from "@/apiCalls/api";

export const getTranslations = async () => {
  try {
    const response = await api.get("/api/admin/translations?limit=0");

    if (response.data?.success && response.data?.data?.grouped) {
      return response.data.data.grouped;
    }
    return {};
  } catch (error) {
    console.error("Error fetching translations:", error);
    throw error;
  }
};
