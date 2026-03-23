import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";
import { TranslationMap } from "../types/lang.types";
type RawTranslationMap = Record<string, Record<string, string>>;
const translationCache: Record<string, RawTranslationMap> = {};

export const useClientTranslation = (namespace: string) => {
  const { lang } = useLanguage();
  const [translations, setTranslations] = useState<RawTranslationMap>({});

  useEffect(() => {
    const fetchTranslations = async () => {
      const cacheKey = namespace; // Cache raw response data per namespace

      if (translationCache[cacheKey]) {
        setTranslations(translationCache[cacheKey]);
        return;
      }

      try {
        const response = await api.get(
          `/api/admin/translations?namespace=${namespace}`,
        );
        const data = response.data;

        if (data.success && data.data.grouped && data.data.grouped[namespace]) {
          const rawMap = data.data.grouped[namespace];
          translationCache[cacheKey] = rawMap;
          setTranslations(rawMap);
        }
      } catch (err) {
        console.error("Failed to fetch translations for", namespace, err);
      }
    };

    fetchTranslations();
  }, [namespace]); // Removed lang dependency so we only fetch once per namespace!

  const t = (key: string) => {
    const mappedLang = lang.toLowerCase() as "ge" | "en";
    return translations[key]?.[mappedLang] || translations[key]?.["ge"] || key;
  };

  return { t, translations };
};
