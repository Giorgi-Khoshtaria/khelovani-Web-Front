import {
  emailSchema,
  phoneSchema,
  strictPasswordSchema,
} from "./zodHelpers";
import type { FormErrors } from "./zodHelpers";

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PASSWORD_MIN_LENGTH = 8;

const firstError = (errors: FormErrors): string | null =>
  Object.values(errors)[0] ?? null;

export const validateNameGe = (
  nameGe: string,
  required = false,
): string | null => {
  const value = nameGe.trim();
  if (!value) return required ? "name_ge_required" : null;
  if (!/^[\u10D0-\u10FF\s'-]+$/.test(value)) return "name_ge_letters_only";
  if (value.length < 2) return "name_ge_min_length";
  if (value.length > 100) return "name_ge_max_length";
  return null;
};

export const validateNameEn = (
  nameEn: string,
  required = true,
): string | null => {
  const value = nameEn.trim();
  if (!value) return required ? "name_en_required" : null;
  if (!/^[A-Za-z\s'\-']+$/.test(value)) return "name_en_letters_only";
  if (value.length < 2) return "name_en_min_length";
  if (value.length > 100) return "name_en_max_length";
  return null;
};

export function validateEmail(email: string): string | null {
  const result = emailSchema(150).safeParse(email);
  return result.success ? null : firstError({ email: result.error.issues[0]?.message ?? "" });
}

export function validatePassword(password: string): string | null {
  if (!password) return "password_required";
  if (password.length > 100) return "password_too_long";
  return null;
}

export function validateStrictPassword(password: string): string | null {
  const result = strictPasswordSchema.safeParse(password);
  return result.success ? null : result.error.issues[0]?.message ?? null;
}

export function validateConfirmPassword(
  password: string,
  confirmPassword: string,
): string | null {
  if (!confirmPassword) return "confirm_password";
  if (confirmPassword !== password) return "password_mismatch";
  return null;
}

export const validateCity = (city: string): string | null => {
  if (!city) return "city_required";
  return null;
};

export const validatePhone = (phone?: string): string | null => {
  const result = phoneSchema.safeParse(phone ?? "");
  return result.success ? null : result.error.issues[0]?.message ?? null;
};

export const validateAddress = (address: string): string | null => {
  const value = address.trim();
  if (!value) return "address_required";
  if (value.length < 5) return "address_min_length";
  if (value.length > 200) return "address_max_length";
  return null;
};

export const validateAddressEn = (addressEn: string): string | null => {
  const value = addressEn.trim();
  if (!value) return "addressEn_required";
  if (value.length > 200) return "addressEn_max_length";
  if (!/^[a-zA-Z0-9\s.,/\\\-()]+$/.test(value))
    return "addressEn_needs_english";
  return null;
};

export function validateIdNumber(idNumber: string): string | null {
  if (!idNumber) return "idNumber_required";
  if (!/^\d+$/.test(idNumber.trim())) return "idNumber_only_numbers";
  if (idNumber.trim().length !== 11) return "idNumber_invalid";
  return null;
}

export function validateDateOfBirth(dateOfBirth: string): string | null {
  if (!dateOfBirth) return "dob_required";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth)) return "dob_invalid_format";
  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) return "dob_invalid";

  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  if (age < 16) return "age_limit_16";
  if (age > 120) return "age_limit_120";
  return null;
}

export function validateIdentificationCode(code: string): string | null {
  if (!code) return "id_code_required";
  if (!/^\d{9}$/.test(code.trim())) return "id_code_invalid";
  return null;
}
