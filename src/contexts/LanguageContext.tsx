"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Lang } from "../lib/types/lang.types";

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  translations: Record<string, Record<string, { ge: string; en: string }>>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export const LanguageProvider = ({
  children,
  initialTranslations = {},
  initialLang = "ge",
}: {
  children: React.ReactNode;
  initialTranslations?: Record<string, Record<string, { ge: string; en: string }>>;
  initialLang?: Lang;
}) => {
  const [lang, setLangState] = useState<Lang>(initialLang);
  const [translations] = useState(initialTranslations);

  // useEffect reading from localStorage was removed to prevent Client-Side hydration flickers.
  // The server (layout.tsx) now reads from Cookies and renders correct initialLang instantly!

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
    if (typeof window !== "undefined") {
      localStorage.setItem("lang", newLang);
      
      // Set Cookie so the Server (layout.tsx) can read it on next refresh!
      document.cookie = `lang=${newLang}; path=/; max-age=31536000; Secure; SameSite=Lax`; // 1 year expiry
      
      window.dispatchEvent(new Event("languageChange"));
    }
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
