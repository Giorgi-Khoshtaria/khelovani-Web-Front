import type { CardBrand } from "@/apiCalls/profileRequests/paymentCards.req";

/** Strip everything but digits. */
export const digitsOnly = (value: string): string => value.replace(/\D/g, "");

/** Detect the card brand from the leading digits (IIN/BIN). */
export const detectBrand = (number: string): CardBrand => {
  const n = digitsOnly(number);
  if (/^4/.test(n)) return "visa";
  if (/^3[47]/.test(n)) return "amex";
  if (
    /^5[1-5]/.test(n) ||
    /^2(2[2-9]|[3-6]\d|7[01]|720)/.test(n)
  ) {
    return "mastercard";
  }
  return "other";
};

/** Luhn checksum — rejects mistyped numbers before they reach the API. */
export const luhnValid = (number: string): boolean => {
  const n = digitsOnly(number);
  if (n.length < 12) return false;
  let sum = 0;
  let double = false;
  for (let i = n.length - 1; i >= 0; i--) {
    let d = parseInt(n[i], 10);
    if (double) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    double = !double;
  }
  return sum % 10 === 0;
};

/** Format a card number with spaces as the user types. */
export const formatCardNumber = (value: string): string => {
  const n = digitsOnly(value).slice(0, 19);
  return n.replace(/(.{4})/g, "$1 ").trim();
};

/** Last 4 digits of a card number. */
export const lastFour = (number: string): string =>
  digitsOnly(number).slice(-4);

/** Parse an "MM/YY" or "MM/YYYY" string into month + 4-digit year. */
export const parseExpiry = (
  value: string,
): { month: number; year: number } | null => {
  const m = value.match(/^(\d{1,2})\s*\/\s*(\d{2}|\d{4})$/);
  if (!m) return null;
  const month = parseInt(m[1], 10);
  let year = parseInt(m[2], 10);
  if (m[2].length === 2) year += 2000;
  if (month < 1 || month > 12) return null;
  return { month, year };
};

const BRAND_LABEL: Record<CardBrand, string> = {
  visa: "Visa",
  mastercard: "Mastercard",
  amex: "American Express",
  other: "Card",
};

export const brandLabel = (brand: CardBrand): string => BRAND_LABEL[brand];
