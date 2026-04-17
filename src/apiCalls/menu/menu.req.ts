import api from "@/apiCalls/api";

export interface MenuItem {
  _id: string;
  label: { ka: string; en: string };
  href: string;
  order: number;
  isActive: boolean;
}

export const getMenu = async () => {
  try {
    const response = await api.get<{ data: MenuItem[] }>("/api/menu");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching menu:", error);
    throw error;
  }
};
