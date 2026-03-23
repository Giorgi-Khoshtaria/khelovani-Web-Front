export type Lang = "ge" | "en";

export type TranslationMap = Record<string, string>;

export interface NamespacedTranslations {
  [namespace: string]: TranslationMap;
}
