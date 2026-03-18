import { validatePhone } from "./shared/phone.validation";
import {
  validateEmail,
  validateStrictPassword,
  validateConfirmPassword,
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
  if (!idNumber) {
    errors.idNumber = "პირადი ნომერი აუცილებელია";
  } else if (!/^\d+$/.test(idNumber)) {
    errors.idNumber = "პირადი ნომერი უნდა შეიცავდეს მხოლოდ ციფრებს";
  } else if (idNumber.length !== 11) {
    errors.idNumber = "პირადი ნომერი უნდა შედგებოდეს ზუსტად 11 ციფრისგან";
  }

  // ── Name (English) ────────────────────────────────────────
  if (!nameEn) {
    errors.nameEn = "სახელი (ლათინურად) აუცილებელია";
  } else if (!/^[a-zA-Z\s]+$/.test(nameEn.trim())) {
    errors.nameEn = "სახელი (ლათინურად) უნდა შეიცავდეს მხოლოდ ლათინურ ასოებს";
  } else if (nameEn.trim().length < 2) {
    errors.nameEn = "სახელი (ლათინურად) უნდა შეიცავდეს მინიმუმ 2 სიმბოლოს";
  } else if (nameEn.trim().length > 200) {
    errors.nameEn = "სახელი (ლათინურად) არ უნდა აღემატებოდეს 200 სიმბოლოს";
  }

  // ── Name (Georgian) ───────────────────────────────────────
  if (nameGe && nameGe.trim().length > 0) {
    if (!/^[\u10D0-\u10FF\s]+$/.test(nameGe.trim())) {
      errors.nameGe = "სახელი (ქართულად) უნდა შეიცავდეს მხოლოდ ქართულ ასოებს";
    } else if (nameGe.trim().length < 2) {
      errors.nameGe = "სახელი (ქართულად) უნდა შეიცავდეს მინიმუმ 2 სიმბოლოს";
    } else if (nameGe.trim().length > 200) {
      errors.nameGe = "სახელი (ქართულად) არ უნდა აღემატებოდეს 200 სიმბოლოს";
    }
  }

  // ── Date of Birth ─────────────────────────────────────────
  if (!dateOfBirth) {
    errors.dateOfBirth = "აირჩიეთ დაბადების თარიღი";
  } else {
    const today = new Date();
    const dob = new Date(dateOfBirth);
    const age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    const dayDiff = today.getDate() - dob.getDate();

    const preciseAge =
      monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;

    if (preciseAge < 18) {
      errors.dateOfBirth = "რეგისტრაციისთვის საჭიროა მინიმუმ 18 წელი";
    } else if (preciseAge > 100) {
      errors.dateOfBirth = "გთხოვთ შეიყვანოთ სწორი დაბადების თარიღი";
    }
  }

  // ── City ──────────────────────────────────────────────────
  if (!city) {
    errors.city = "აირჩიეთ ქალაქი";
  }

  // ── Address ───────────────────────────────────────────────
  if (!address) {
    errors.address = "მისამართი აუცილებელია";
  } else if (!/^[\u10D0-\u10FFa-zA-Z0-9\s,.\-/#]+$/.test(address.trim())) {
    errors.address =
      "მისამართი უნდა შეიცავდეს მხოლოდ ქართულ ან ლათინურ სიმბოლოებს";
  } else if (address.trim().length < 5) {
    errors.address = "მისამართი უნდა შეიცავდეს მინიმუმ 5 სიმბოლოს";
  } else if (address.trim().length > 200) {
    errors.address = "მისამართი არ უნდა აღემატებოდეს 200 სიმბოლოს";
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
    errors.terms = "თქვენ უნდა დაეთანხმოთ წესებს და პირობებს";
  }

  return errors;
};
