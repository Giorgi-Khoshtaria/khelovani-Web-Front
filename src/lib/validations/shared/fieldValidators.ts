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
    return required ? "სახელი (ქართულად) აუცილებელია" : null;
  }
  if (!/^[\u10D0-\u10FF\s]+$/.test(nameGe.trim()))
    return "სახელი (ქართულად) უნდა შეიცავდეს მხოლოდ ქართულ ასოებს";
  if (nameGe.trim().length < 2)
    return "სახელი (ქართულად) უნდა შეიცავდეს მინიმუმ 2 სიმბოლოს";
  if (nameGe.trim().length > 200)
    return "სახელი (ქართულად) არ უნდა აღემატებოდეს 200 სიმბოლოს";
  return null;
};

export const validateNameEn = (
  nameEn: string,
  required = true,
): string | null => {
  if (!nameEn || nameEn.trim().length === 0) {
    return required ? "სახელი (ლათინურად) აუცილებელია" : null;
  }
  if (!/^[a-zA-Z\s]+$/.test(nameEn.trim()))
    return "სახელი (ლათინურად) უნდა შეიცავდეს მხოლოდ ლათინურ ასოებს";
  if (nameEn.trim().length < 2)
    return "სახელი (ლათინურად) უნდა შეიცავდეს მინიმუმ 2 სიმბოლოს";
  if (nameEn.trim().length > 200)
    return "სახელი (ლათინურად) არ უნდა აღემატებოდეს 200 სიმბოლოს";
  return null;
};
// ── Email ─────────────────────────────────────────────────────────────────────
/**
 * Returns an error string when the email is invalid, or null when it's fine.
 */
export function validateEmail(email: string): string | null {
  if (!email) return "ელ. ფოსტა სავალდებულოა";
  if (!EMAIL_REGEX.test(email)) return "შეიყვანეთ სწორი ელ. ფოსტის მისამართი";
  return null;
}

// ── Password (basic) ──────────────────────────────────────────────────────────
/**
 * Basic password: min 8 chars, at least one letter, at least one digit.
 * Used by: login, reset-password.
 */
export function validatePassword(password: string): string | null {
  if (!password) return "პაროლი სავალდებულოა";
  if (password.length < PASSWORD_MIN_LENGTH)
    return `პაროლი უნდა შეიცავდეს მინიმუმ ${PASSWORD_MIN_LENGTH} სიმბოლოს`;
  if (!/[a-zA-Z]/.test(password))
    return "პაროლი უნდა შეიცავდეს მინიმუმ ერთ ასოს";
  if (!/[0-9]/.test(password)) return "პაროლი უნდა შეიცავდეს მინიმუმ ერთ ციფრს";
  return null;
}

// ── Password (strict) ─────────────────────────────────────────────────────────
/**
 * Strict password: min 8 chars, max 30, uppercase, digit, special character.
 * Used by: registration.
 */
export function validateStrictPassword(password: string): string | null {
  if (!password) return "პაროლი აუცილებელია";
  if (password.length < PASSWORD_MIN_LENGTH)
    return "პაროლი უნდა შეიცავდეს მინიმუმ 8 სიმბოლოს";
  if (password.length > 30) return "პაროლი არ უნდა აღემატებოდეს 30 სიმბოლოს";
  if (!/[A-Z]/.test(password))
    return "პაროლი უნდა შეიცავდეს მინიმუმ 1 დიდ ასოს";
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password))
    return "პაროლი უნდა შეიცავდეს მინიმუმ 1 სპეციალურ სიმბოლოს (!@#$%...)";
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
  if (!confirmPassword) return "გაიმეორეთ პაროლი";
  if (confirmPassword !== password) return "პაროლები არ ემთხვევა";
  return null;
}
// shared/fieldValidators.ts - add this
export const validateCity = (city: string): string | null => {
  if (!city) return "აირჩიეთ ქალაქი";
  return null;
};
export const validatePhone = (phone?: string): string | null => {
  if (!phone || phone.trim() === "") return "ტელეფონის ნომერი სავალდებულოა";
  if (!/^5\d{2}\s?\d{3}\s?\d{3}$/.test(phone.trim()))
    return "ტელეფონის ნომერი უნდა იყოს ფორმატში: 5XX XXX XXX";
  return null;
};
// shared/fieldValidators.ts - add this
export const validateAddress = (address: string): string | null => {
  if (!address) return "მისამართი აუცილებელია";
  if (!/^[\u10D0-\u10FFa-zA-Z0-9\s,.\-/#]+$/.test(address.trim()))
    return "მისამართი უნდა შეიცავდეს მხოლოდ ქართულ ან ლათინურ სიმბოლოებს";
  if (address.trim().length < 5)
    return "მისამართი უნდა შეიცავდეს მინიმუმ 5 სიმბოლოს";
  if (address.trim().length > 200)
    return "მისამართი არ უნდა აღემატებოდეს 200 სიმბოლოს";
  return null;
};
