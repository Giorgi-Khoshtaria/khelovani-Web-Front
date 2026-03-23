"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Lang } from "../lib/types/lang.types";

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export const LanguageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [lang, setLangState] = useState<Lang>("ge");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem("lang") as Lang;
      if (savedLang === "ge" || savedLang === "en") {
        setLangState(savedLang);
      }
    }
  }, []);

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
    if (typeof window !== "undefined") {
      localStorage.setItem("lang", newLang);
      // Trigger a custom event to notify Axios or other listeners that lang changed if needed
      window.dispatchEvent(new Event("languageChange"));
    }
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
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
