// ─────────────────────────────────────────────────────────────────────────────
// Shared field validators — used across login, registration, forgot-password,
// reset-password, and any future forms.
// ─────────────────────────────────────────────────────────────────────────────

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PASSWORD_MIN_LENGTH = 8;
// shared/fieldValidators.ts - add these
export const validateNameGe = (
  nameGe: string,
  required = false,
): string | null => {
  if (!nameGe || nameGe.trim().length === 0) {
    return required ? "name_ge_required" : null;
  }
  if (!/^[ა-\u10FF\s]+$/.test(nameGe.trim())) return "name_ge_letters";
  if (nameGe.trim().length < 2) return "name_ge_min";
  if (nameGe.trim().length > 200) return "name_ge_max";
  return null;
};

export const validateNameEn = (
  nameEn: string,
  required = true,
): string | null => {
  if (!nameEn || nameEn.trim().length === 0) {
    return required ? "name_en_required" : null;
  }
  if (!/^[a-zA-Z\s]+$/.test(nameEn.trim())) return "name_en_letters";
  if (nameEn.trim().length < 2) return "name_en_min";
  if (nameEn.trim().length > 200) return "name_en_max";
  return null;
};
// ── Email ─────────────────────────────────────────────────────────────────────
/**
 * Returns an error string when the email is invalid, or null when it's fine.
 */
export function validateEmail(email: string): string | null {
  if (!email) return "email_required";
  if (!EMAIL_REGEX.test(email)) return "email_invalid";
  return null;
}

// ── Password (basic) ──────────────────────────────────────────────────────────
/**
 * Basic password: min 8 chars, at least one letter, at least one digit.
 * Used by: login, reset-password.
 */
export function validatePassword(password: string): string | null {
  if (!password) return "password_required";
  if (password.length < PASSWORD_MIN_LENGTH) return "password_min";
  if (!/[a-zA-Z]/.test(password)) return "password_lowercase";
  if (!/[0-9]/.test(password)) return "password_number";
  return null;
}

// ── Password (strict) ─────────────────────────────────────────────────────────
/**
 * Strict password: min 8 chars, max 30, uppercase, digit, special character.
 * Used by: registration.
 */
export function validateStrictPassword(password: string): string | null {
  if (!password) return "password_required";
  if (password.length < PASSWORD_MIN_LENGTH) return "password_min";
  if (password.length > 30) return "password_max";
  if (!/[A-Z]/.test(password)) return "password_uppercase";
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password))
    return "password_special";
  return null;
}

// ── Confirm Password ──────────────────────────────────────────────────────────
/**
 * Returns an error string when confirmPassword doesn't match, or null when ok.
 */
export function validateConfirmPassword(
  password: string,
  confirmPassword: string,
): string | null {
  if (!confirmPassword) return "confirm_password";
  if (confirmPassword !== password) return "password_mismatch";
  return null;
}
// shared/fieldValidators.ts - add this
export const validateCity = (city: string): string | null => {
  if (!city) return "city_required";
  return null;
};
export const validatePhone = (phone?: string): string | null => {
  if (!phone || phone.trim() === "") return "phone_required";
  if (!/^5\d{2}\s?\d{3}\s?\d{3}$/.test(phone.trim())) return "phone_format";
  return null;
};
// shared/fieldValidators.ts - add this
export const validateAddress = (address: string): string | null => {
  if (!address) return "address_required";
  if (!/^[\u10D0-\u10FF0-9\s,.\-/#]+$/.test(address.trim()))
    return "address_ge_letters";
  if (address.trim().length < 5) return "address_min";
  if (address.trim().length > 200) return "address_max";
  return null;
};

export const validateAddressEn = (addressEn: string): string | null => {
  if (!addressEn) return "address_en_required";
  if (!/^[a-zA-Z0-9\s,.\-/#]+$/.test(addressEn.trim()))
    return "address_en_letters";
  if (addressEn.trim().length < 5) return "address_min";
  if (addressEn.trim().length > 200) return "address_max";
  return null;
};

// ── ID Number ─────────────────────────────────────────────────────────────
export function validateIdNumber(idNumber: string): string | null {
  if (!idNumber) return "id_number_required";
  if (!/^\d+$/.test(idNumber)) return "id_number_digits";
  if (idNumber.length !== 11) return "id_number_length";
  return null;
}

// ── Date of Birth ─────────────────────────────────────────────────────────
export function validateDateOfBirth(dateOfBirth: string): string | null {
  if (!dateOfBirth) return "date_of_birth_required";

  const today = new Date();
  const dob = new Date(dateOfBirth);
  const age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  const dayDiff = today.getDate() - dob.getDate();

  const preciseAge =
    monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;

  if (preciseAge < 18) return "age_min_18";
  if (preciseAge > 100) return "age_invalid";

  return null;
}

// ── Identification Code ───────────────────────────────────────────────────
export function validateIdentificationCode(code: string): string | null {
  if (!code) return "id_code_required";
  if (!/^\d+$/.test(code)) return "id_code_digits";
  if (code.length !== 9) return "id_code_length";
  return null;
}
