// ─────────────────────────────────────────────────────────────────────────────
// Shared field validators — used across login, registration, forgot-password,
// reset-password, and any future forms.
// ─────────────────────────────────────────────────────────────────────────────

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PASSWORD_MIN_LENGTH = 8;

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
  if (!/[0-9]/.test(password))
    return "პაროლი უნდა შეიცავდეს მინიმუმ ერთ ციფრს";
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
  if (password.length > 30)
    return "პაროლი არ უნდა აღემატებოდეს 30 სიმბოლოს";
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
