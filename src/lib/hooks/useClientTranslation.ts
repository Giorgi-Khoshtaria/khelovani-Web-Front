import { useLanguage } from "@/contexts/LanguageContext";

export const useClientTranslation = (namespace: string) => {
  const { lang, translations } = useLanguage();

  const t = (key: string) => {
    const mappedLang = lang.toLowerCase() as "ge" | "en";
    
    // Read directly from the Global translations object provided by SSR in layout.tsx
    const nsTranslations = translations[namespace] || {};
    const found = nsTranslations[key]?.[mappedLang] || nsTranslations[key]?.["ge"];

    if (found) return found;

    return key; // Fallback directly to key immediately
  };

  return { t, translations: translations[namespace] || {} };
};
