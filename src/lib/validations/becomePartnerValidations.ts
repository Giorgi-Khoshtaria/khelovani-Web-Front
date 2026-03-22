import {
  validateEmail,
  validatePhone,
  validateCity,
  validateAddress,
  validateAddressEn,
  validateNameEn,
  validateNameGe,
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
  if (!identificationCode) {
    errors.identificationCode = "საიდენტიფიკაციო კოდი აუცილებელია";
  } else if (!/^\d+$/.test(identificationCode)) {
    errors.identificationCode =
      "საიდენტიფიკაციო კოდი უნდა შეიცავდეს მხოლოდ ციფრებს";
  } else if (identificationCode.length !== 9) {
    errors.identificationCode =
      "საიდენტიფიკაციო კოდი უნდა შედგებოდეს ზუსტად 9 ციფრისგან";
  }

  // ── Contact Person ────────────────────────────────────────
  if (!contactPerson) {
    errors.contactPerson = "საკონტაქტო პირის სახელი აუცილებელია";
  } else if (contactPerson.trim().length < 2) {
    errors.contactPerson = "სახელი უნდა შეიცავდეს მინიმუმ 2 სიმბოლოს";
  } else if (contactPerson.trim().length > 200) {
    errors.contactPerson = "სახელი არ უნდა აღემატებოდეს 200 სიმბოლოს";
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
    errors.description = "კომპანიის აღწერა აუცილებელია";
  } else if (description.trim().length < 10) {
    errors.description = "აღწერა უნდა შეიცავდეს მინიმუმ 10 სიმბოლოს";
  } else if (description.trim().length > 1000) {
    errors.description = "აღწერა არ უნდა აღემატებოდეს 1000 სიმბოლოს";
  }

  // ── Terms ─────────────────────────────────────────────────
  if (!terms) {
    errors.terms = "თქვენ უნდა დაეთანხმოთ წესებს და პირობებს";
  }

  return errors;
};
