export interface RegistrationFormData {
  idNumber: string;
  nameGe: string;
  nameEn: string;
  dateOfBirth: string;
  city: string;
  address: string;
  email: string;
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
  // only digits, exactly 11
  if (!idNumber) {
    errors.idNumber = "პირადი ნომერი აუცილებელია";
  } else if (!/^\d+$/.test(idNumber)) {
    errors.idNumber = "პირადი ნომერი უნდა შეიცავდეს მხოლოდ ციფრებს";
  } else if (idNumber.length !== 11) {
    errors.idNumber = "პირადი ნომერი უნდა შედგებოდეს ზუსტად 11 ციფრისგან";
  }

  // ── Name (English) ────────────────────────────────────────
  // required, only English letters and spaces, min 2 max 200
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
  // optional, but if filled: only Georgian letters and spaces, min 2 max 200
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
  // required, age must be between 18 and 100
  if (!dateOfBirth) {
    errors.dateOfBirth = "აირჩიეთ დაბადების თარიღი";
  } else {
    const today = new Date();
    const dob = new Date(dateOfBirth);
    const age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    const dayDiff = today.getDate() - dob.getDate();

    // precise age calculation
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
  // required, only Georgian/English letters, digits, spaces and common punctuation
  // min 5 max 200
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

  // ── Email ─────────────────────────────────────────────────
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    errors.email = "ელ-ფოსტა აუცილებელია";
  } else if (!emailRegex.test(email)) {
    errors.email = "შეიყვანეთ სწორი ელ-ფოსტის მისამართი";
  }

  // ── Password ──────────────────────────────────────────────
  // min 8 max 30, at least 1 uppercase, at least 1 special character
  if (!password) {
    errors.password = "პაროლი აუცილებელია";
  } else if (password.length < 8) {
    errors.password = "პაროლი უნდა შეიცავდეს მინიმუმ 8 სიმბოლოს";
  } else if (password.length > 30) {
    errors.password = "პაროლი არ უნდა აღემატებოდეს 30 სიმბოლოს";
  } else if (!/[A-Z]/.test(password)) {
    errors.password = "პაროლი უნდა შეიცავდეს მინიმუმ 1 დიდ ასოს";
  } else if (!/[!@#$%^&*()_+\-=\\[\]{};':"\\|,.<>\\/?]/.test(password)) {
    errors.password =
      "პაროლი უნდა შეიცავდეს მინიმუმ 1 სპეციალურ სიმბოლოს (!@#$%...)";
  }

  // ── Confirm Password ──────────────────────────────────────
  if (!confirmPassword) {
    errors.confirmPassword = "გაიმეორეთ პაროლი";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "პაროლები არ ემთხვევა";
  }

  // ── Terms ─────────────────────────────────────────────────
  if (!terms) {
    errors.terms = "თქვენ უნდა დაეთანხმოთ წესებს და პირობებს";
  }

  return errors;
};
