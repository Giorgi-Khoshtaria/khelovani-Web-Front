import {
  validateEmail,
  validateStrictPassword,
  validateConfirmPassword,
  validatePhone,
  validateCity,
  validateAddress,
  validateNameEn,
  validateNameGe,
  validateIdNumber,
  validateDateOfBirth,
} from "./shared/fieldValidators";

export interface RegistrationFormData {
  idNumber: string;
  nameGe: string;
  nameEn: string;
  dateOfBirth: string;
  city: string;
  address: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

export type FormErrors = Record<string, string>;

export const validateRegistrationForm = (
  formData: RegistrationFormData,
): FormErrors => {
  const errors: FormErrors = {};
  const {
    idNumber,
    nameGe,
    nameEn,
    dateOfBirth,
    city,
    address,
    email,
    password,
    confirmPassword,
    terms,
  } = formData;
  // ── ID Number ─────────────────────────────────────────────
  const idError = validateIdNumber(idNumber);
  if (idError) errors.idNumber = idError;

  // ── Name (Georgian) - optional ────────────────────────────
  const nameGeError = validateNameGe(nameGe, false);
  if (nameGeError) errors.nameGe = nameGeError;

  // ── Name (English) - required ─────────────────────────────
  const nameEnError = validateNameEn(nameEn, true);
  if (nameEnError) errors.nameEn = nameEnError;

  // ── Date of Birth ─────────────────────────────────────────
  const dobError = validateDateOfBirth(dateOfBirth);
  if (dobError) errors.dateOfBirth = dobError;

  // ── City ──────────────────────────────────────────────────
  if (!city) {
    errors.city = "city_required";
  }

  // ── Address ───────────────────────────────────────────────
  if (!address) {
    errors.address = "address_required";
  } else if (address.trim().length < 5) {
    errors.address = "address_min";
  } else if (address.trim().length > 200) {
    errors.address = "address_max";
  }

  // ── Email (shared) ────────────────────────────────────────
  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  // ── Phone (shared) ────────────────────────────────────────
  const phoneError = validatePhone(formData.phone);
  if (phoneError) errors.phone = phoneError;

  // ── Password strict (shared) ──────────────────────────────
  const passwordError = validateStrictPassword(password);
  if (passwordError) errors.password = passwordError;

  // ── Confirm Password (shared) ─────────────────────────────
  const confirmError = validateConfirmPassword(password, confirmPassword);
  if (confirmError) errors.confirmPassword = confirmError;

  // ── Terms ─────────────────────────────────────────────────
  if (!terms) {
    errors.terms = "validation.terms_required";
  }

  return errors;
};
