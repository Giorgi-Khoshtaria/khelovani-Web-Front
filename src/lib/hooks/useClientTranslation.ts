import { useLanguage } from "@/contexts/LanguageContext";

type Namespace = string;

/**
 * useClientTranslation
 *
 * Resolves translation keys by searching through namespaces in order.
 *
 * @param namespaces - A single namespace string OR an ordered array of namespaces.
 *                     Keys are searched left-to-right; first match wins.
 *                     The 'common' namespace is always appended as the last implicit fallback.
 *
 * @example
 * // Single namespace (most common usage)
 * const { t } = useClientTranslation("inputs");
 *
 * @example
 * // Multiple namespaces — searches 'inputs' first, then 'validation'
 * const { t } = useClientTranslation(["inputs", "validation"]);
 */
export const useClientTranslation = (namespaces: Namespace | Namespace[]) => {
  const { lang, translations } = useLanguage();

  // Normalise to array and append 'common' as the last implicit fallback
  const nsArray = [
    ...(Array.isArray(namespaces) ? namespaces : [namespaces]),
    "common",
  ];

  const lookup = (key: string, ns: string): string | undefined => {
    const nsTranslations = translations[ns] || {};
    const mappedLang = lang.toLowerCase() as "ge" | "en";
    return nsTranslations[key]?.[mappedLang] || nsTranslations[key]?.["ge"];
  };

  const t = (key: string): string => {
    if (!key) return "";

    for (const ns of nsArray) {
      const found = lookup(key, ns);
      if (found) return found;
    }

    return key; // Ultimate fallback: return the key itself
  };

  // Expose translations of the primary namespace for advanced consumers
  const primaryNs = Array.isArray(namespaces) ? namespaces[0] : namespaces;
  return { t, translations: translations[primaryNs] || {} };
};
