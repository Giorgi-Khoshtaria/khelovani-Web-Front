import type { FormScenario } from "./formValidation";

export const validLogin: FormScenario = {
  path: "/login",
  fields: {
    email: "test@example.com",
    password: "plainpassword",
  },
};

export const validRegistration: FormScenario = {
  path: "/register",
  fields: {
    idNumber: "12345678901",
    nameGe: "",
    nameEn: "John Smith",
    email: "john@example.com",
    phone: "599 123 456",
    password: "Strong1!",
    confirmPassword: "Strong1!",
    terms: true,
  },
};

export const validPartnerRegistration: FormScenario = {
  path: "/become-partner",
  fields: {
    companyNameGe: "კომპანია",
    companyNameEn: "Company",
    identificationCode: "123456789",
    contactPerson: "Contact Person",
    phone: "599 123 456",
    email: "partner@example.com",
    address: "თბილისი 10",
    addressEn: "Tbilisi 10",
    description: "",
    terms: true,
  },
  select: { city: "tbilisi" },
  chips: ["first-category"],
};

export const validIndividualPartnerRegistration: FormScenario = {
  path: "/become-partner",
  radio: { partnerType: "individual" },
  fields: {
    companyNameGe: "სახელი გვარი",
    companyNameEn: "Name Surname",
    personalNumber: "12345678901",
    phone: "599 123 456",
    email: "individual@example.com",
    address: "თბილისი 10",
    addressEn: "Tbilisi 10",
    description: "",
    terms: true,
  },
  select: { city: "tbilisi" },
  chips: ["first-category"],
};
