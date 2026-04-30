import api from "@/apiCalls/api";

export interface PublicCategory {
  slug: string;
  nameGe: string;
  nameEn: string;
}

export async function getPublicCategories(): Promise<PublicCategory[]> {
  const response = await api.get<{ data: PublicCategory[] }>("/api/categories");
  return response.data?.data ?? [];
}
export async function getPinnedCategories(): Promise<PublicCategory[]> {
  const response = await api.get<{ data: PublicCategory[] }>(
    "/api/categories/pinned",
  );
  return response.data?.data ?? [];
}
