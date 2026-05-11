/**
 * Shape of translations returned by the backend, keyed namespace → key → lang.
 *
 * Example:
 *   {
 *     pages: {
 *       "products.title": { ge: "ნაკეთობა", en: "Products" }
 *     }
 *   }
 */
export type TranslationEntry = { ge: string; en: string };
export type TranslationNamespace = Record<string, TranslationEntry>;
export type Translations = Record<string, TranslationNamespace>;
