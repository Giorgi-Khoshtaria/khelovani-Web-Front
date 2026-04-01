// ─── Category enum (matches backend Organisation schema) ──────

export const CATEGORY_ENUM = [
  "handcraft",
  "jewelry",
  "ceramics",
  "textile",
  "wood",
  "food",
  "art",
  "leather",
  "enamel",
] as const;

export type CategoryValue = (typeof CATEGORY_ENUM)[number];

export interface Category {
  value: CategoryValue;
  labelGe: string;
  labelEn: string;
}

export const CATEGORIES: Category[] = [
  { value: "handcraft", labelGe: "ხელნაკეთობა", labelEn: "Handcraft" },
  { value: "jewelry", labelGe: "სამკაულები", labelEn: "Jewelry" },
  { value: "ceramics", labelGe: "კერამიკა", labelEn: "Ceramics" },
  { value: "textile", labelGe: "ტექსტილი", labelEn: "Textile" },
  { value: "wood", labelGe: "ხე-ტყე", labelEn: "Wood" },
  { value: "food", labelGe: "საკვები და სასმელი", labelEn: "Food & Drinks" },
  { value: "art", labelGe: "ხელოვნება", labelEn: "Art" },
  { value: "leather", labelGe: "ტყავი", labelEn: "Leather" },
  { value: "enamel", labelGe: "მინანქარი", labelEn: "Enamel" },
];

// ─── Cities (matches backend Organisation city enum) ─────────

export interface City {
  value: string;
  labelGe: string;
  labelEn: string;
}

export const CITIES: City[] = [
  { value: "tbilisi", labelGe: "თბილისი", labelEn: "Tbilisi" },
  { value: "batumi", labelGe: "ბათუმი", labelEn: "Batumi" },
  { value: "kutaisi", labelGe: "ქუთაისი", labelEn: "Kutaisi" },
  { value: "rustavi", labelGe: "რუსთავი", labelEn: "Rustavi" },
  { value: "gori", labelGe: "გორი", labelEn: "Gori" },
  { value: "zugdidi", labelGe: "ზუგდიდი", labelEn: "Zugdidi" },
];

// ─── Icon library ─────────────────────────────────────────────

export const Icons = {
  website: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  facebook: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  ),
  instagram: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
  tiktok: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 12a4 4 0 1 0 4 4V4h3.5c.8 2.7 3 4.5 5.5 4.5v3c-1.5 0-3-.5-4-1.5v6a8 8 0 1 1-8-8v3a5 5 0 0 0 4 4z" />
    </svg>
  ),
  search: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  location: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  filter: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="8" y1="12" x2="16" y2="12" />
      <line x1="11" y1="18" x2="13" y2="18" />
    </svg>
  ),
  close: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  chevronDown: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  arrowRight: (
    <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2.5 7h9M8 3.5 11.5 7 8 10.5"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
} as const;
