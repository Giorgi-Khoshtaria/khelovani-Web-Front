"use client";

import { createContext, useContext } from "react";
import type { PublicCategory } from "@/apiCalls/categoryRequests/category.req";

interface CategoriesCtx {
  categories: PublicCategory[];
  getLabel: (slug: string, lang: "ge" | "en") => string;
}

const CategoriesContext = createContext<CategoriesCtx>({
  categories: [],
  getLabel: (slug) => slug,
});

export function CategoriesProvider({
  initialCategories,
  children,
}: {
  initialCategories: PublicCategory[];
  children: React.ReactNode;
}) {
  const getLabel = (slug: string, lang: "ge" | "en"): string => {
    const found = initialCategories.find((c) => c.slug === slug);
    return found ? (lang === "ge" ? found.nameGe : found.nameEn) : slug;
  };

  return (
    <CategoriesContext.Provider value={{ categories: initialCategories, getLabel }}>
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  return useContext(CategoriesContext);
}
