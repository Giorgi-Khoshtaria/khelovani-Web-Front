// Client-side payment-card validation utilities.
//
// SECURITY NOTE: these helpers only validate *format* so the UI can give fast
// feedback. They never transmit or persist the full card number / CVC. Real
// authorization must happen through a PCI-compliant tokenizing processor — the
// PAN and CVC must go directly to that processor, never to our own backend.

export type CardBrand = "visa" | "mastercard" | "amex" | "other";

export interface CardValues {
  number: string; // may contain formatting spaces
  holder: string;
  expiry: string; // "MM/YY"
  cvc: string;
}

export interface CardErrors {
  number?: string;
  holder?: string;
  expiry?: string;
  cvc?: string;
}

// The validators return translation keys (resolved through the `validation`
// namespace in the UI). The expected keys are:
//   card_number_required · card_number_too_short · card_number_invalid_length
//   card_number_invalid · card_holder_required · card_holder_too_short
//   card_holder_too_long · card_holder_invalid · card_expiry_required
//   card_expiry_invalid_month · card_expiry_invalid_year · card_expired
//   card_cvc_required · card_cvc_invalid

export const onlyDigits = (value: string): string => value.replace(/\D/g, "");

/** Luhn (mod-10) checksum — the standard card-number integrity check. */
export const luhnValid = (digits: string): boolean => {
  if (!digits) return false;
  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = digits.charCodeAt(i) - 48;
    if (d < 0 || d > 9) return false;
    if (double) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    double = !double;
  }
  return sum % 10 === 0;
};

export const detectBrand = (digits: string): CardBrand => {
  if (/^4/.test(digits)) return "visa";
  if (/^(5[1-5]|2(2[2-9]|[3-6]\d|7[01]|720))/.test(digits)) return "mastercard";
  if (/^3[47]/.test(digits)) return "amex";
  return "other";
};

const BRAND_LENGTHS: Record<CardBrand, number[]> = {
  visa: [13, 16, 19],
  mastercard: [16],
  amex: [15],
  other: [12, 13, 14, 15, 16, 17, 18, 19],
};

export const cvcLengthForBrand = (brand: CardBrand): number =>
  brand === "amex" ? 4 : 3;

/** Formats the card number into brand-aware groups (4-6-5 for Amex, 4s otherwise). */
export const formatCardNumber = (raw: string): string => {
  const digits = onlyDigits(raw).slice(0, 19);
  if (detectBrand(digits) === "amex") {
    const a = digits.slice(0, 4);
    const b = digits.slice(4, 10);
    const c = digits.slice(10, 15);
    return [a, b, c].filter(Boolean).join(" ");
  }
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
};

/** Formats raw digits into "MM/YY". */
export const formatExpiry = (raw: string): string => {
  const digits = onlyDigits(raw).slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

export const validateCardNumber = (value: string): string | undefined => {
  const digits = onlyDigits(value);
  if (!digits) return "card_number_required";
  if (digits.length < 12) return "card_number_too_short";
  const brand = detectBrand(digits);
  if (!BRAND_LENGTHS[brand].includes(digits.length))
    return "card_number_invalid_length";
  if (!luhnValid(digits)) return "card_number_invalid";
  return undefined;
};

export const validateHolder = (value: string): string | undefined => {
  const v = value.trim();
  if (!v) return "card_holder_required";
  if (v.length < 2) return "card_holder_too_short";
  if (v.length > 60) return "card_holder_too_long";
  // Letters (any script), spaces, apostrophes, dots and hyphens.
  if (!/^[\p{L}][\p{L} .'-]*$/u.test(v)) return "card_holder_invalid";
  return undefined;
};

export const validateExpiry = (value: string): string | undefined => {
  const digits = onlyDigits(value);
  if (digits.length < 4) return "card_expiry_required";
  const month = Number(digits.slice(0, 2));
  const year = Number(digits.slice(2, 4));
  if (month < 1 || month > 12) return "card_expiry_invalid_month";

  const now = new Date();
  const currentYear = now.getFullYear() % 100;
  const currentMonth = now.getMonth() + 1;
  if (year > currentYear + 20) return "card_expiry_invalid_year";
  if (year < currentYear || (year === currentYear && month < currentMonth))
    return "card_expired";
  return undefined;
};

export const validateCvc = (
  value: string,
  brand: CardBrand,
): string | undefined => {
  const digits = onlyDigits(value);
  if (!digits) return "card_cvc_required";
  if (digits.length !== cvcLengthForBrand(brand)) return "card_cvc_invalid";
  return undefined;
};

export const validateCard = (values: CardValues): CardErrors => {
  const brand = detectBrand(onlyDigits(values.number));
  return {
    number: validateCardNumber(values.number),
    holder: validateHolder(values.holder),
    expiry: validateExpiry(values.expiry),
    cvc: validateCvc(values.cvc, brand),
  };
};

export const hasCardErrors = (errors: CardErrors): boolean =>
  Boolean(errors.number || errors.holder || errors.expiry || errors.cvc);
