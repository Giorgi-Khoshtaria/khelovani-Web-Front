import api from "@/apiCalls/api";

export interface PageContent {
  path: string;
  title: { ka: string; en: string };
  description: { ka: string; en: string };
  ogImage: string;
  noindex: boolean;
}

export const getPageByPath = async (path: string): Promise<PageContent> => {
  const response = await api.get<{ data: PageContent }>("/api/pages", {
    params: { path },
  });
  return response.data.data;
};
