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
    errors.contactPerson = "validation.contact_required";
  } else if (contactPerson.trim().length < 2) {
    errors.contactPerson = "validation.contact_min";
  } else if (contactPerson.trim().length > 200) {
    errors.contactPerson = "validation.contact_max";
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
    errors.description = "validation.description_required";
  } else if (description.trim().length < 10) {
    errors.description = "validation.description_min";
  } else if (description.trim().length > 1000) {
    errors.description = "validation.description_max";
  }

  // ── Terms ─────────────────────────────────────────────────
  if (!terms) {
    errors.terms = "validation.terms_required";
  }

  return errors;
};
