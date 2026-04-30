import {
  validateEmail,
  validatePhone,
  validateCity,
  validateAddress,
  validateAddressEn,
  validateNameEn,
  validateNameGe,
  validateIdentificationCode,
} from "./shared/fieldValidators";

export interface PartnerFormData {
  companyNameGe: string;
  companyNameEn: string;
  identificationCode: string;
  contactPerson: string;
  phone: string;
  city: string;
  email: string;
  address: string;
  addressEn: string;
  description: string;
  terms: boolean;
  categories?: string[];
}

export type FormErrors = Record<string, string>;

export const validatePartnerForm = (formData: PartnerFormData): FormErrors => {
  const errors: FormErrors = {};
  const {
    companyNameGe,
    companyNameEn,
    identificationCode,
    contactPerson,
    email,
    address,
    addressEn,
    description,
    city,
    terms,
  } = formData;

  // ── Company Name (Georgian) - required ────────────────────
  const companyNameGeError = validateNameGe(companyNameGe, true);
  if (companyNameGeError) errors.companyNameGe = companyNameGeError;

  // ── Company Name (English) - required ─────────────────────
  const companyNameEnError = validateNameEn(companyNameEn, true);
  if (companyNameEnError) errors.companyNameEn = companyNameEnError;
  // ── Identification Code ───────────────────────────────────
  const idCodeError = validateIdentificationCode(identificationCode);
  if (idCodeError) errors.identificationCode = idCodeError;

  // ── Contact Person ────────────────────────────────────────
  if (!contactPerson) {
    errors.contactPerson = "contact_required";
  } else if (contactPerson.trim().length < 2) {
    errors.contactPerson = "contact_min";
  } else if (contactPerson.trim().length > 200) {
    errors.contactPerson = "contact_max";
  }

  // ── Phone (shared) ────────────────────────────────────────
  const phoneError = validatePhone(formData.phone);
  if (phoneError) errors.phone = phoneError;

  // ── City (shared) ─────────────────────────────────────────
  const cityError = validateCity(city);
  if (cityError) errors.city = cityError;

  // ── Email (shared) ────────────────────────────────────────
  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  // ── Address ───────────────────────────────────────────────
  const addressError = validateAddress(address);
  if (addressError) errors.address = addressError;

  // ── Address En ───────────────────────────────────────────
  const addressEnError = validateAddressEn(addressEn);
  if (addressEnError) errors.addressEn = addressEnError;

  // ── Description ───────────────────────────────────────────
  if (!description) {
    errors.description = "description_required";
  } else if (description.trim().length < 10) {
    errors.description = "description_min";
  } else if (description.trim().length > 1000) {
    errors.description = "description_max";
  }

  // ── Categories ────────────────────────────────────────────
  if (!formData.categories || formData.categories.length === 0) {
    errors.categories = "category_required";
  } else if (formData.categories.length > 5) {
    errors.categories = "category_too_many";
  }

  // ── Terms ─────────────────────────────────────────────────
  if (!terms) {
    errors.terms = "terms_required";
  }

  return errors;
};
