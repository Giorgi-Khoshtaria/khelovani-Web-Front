import { z } from "zod";
import { citySchema, emailSchema, parseForm } from "./shared/zodHelpers";

export interface ProfileUpdateFormData {
  idNumber: string;
  nameGe: string;
  nameEn: string;
  dateOfBirth: string;
  city: string;
  address: string;
  email: string;
  phone: string;
}

export type ProfileFormErrors = Record<string, string>;

const optionalNameGeSchema = z
  .string()
  .trim()
  .transform((v) => (v === "" ? undefined : v))
  .pipe(
    z
      .string()
      .min(2, "name_ge_min_length")
      .max(100, "name_ge_max_length")
      .regex(/^[ა-ჿ\s'-]+$/, "name_ge_letters_only")
      .optional(),
  );

const dateOfBirthSchema = z
  .string()
  .min(1, "dob_required")
  .refine((v) => /^\d{4}-\d{2}-\d{2}$/.test(v), { message: "dob_invalid_format" })
  .refine((v) => !Number.isNaN(Date.parse(v)), { message: "dob_invalid" })
  .refine(
    (v) => {
      const dob = new Date(v);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
      return age >= 16;
    },
    { message: "age_limit_16" },
  )
  .refine(
    (v) => {
      const dob = new Date(v);
      return new Date().getFullYear() - dob.getFullYear() <= 120;
    },
    { message: "age_limit_120" },
  );

export const profileUpdateSchema = z.object({
  idNumber: z.string().trim().min(1, "idNumber_required").regex(/^\d+$/, "idNumber_only_numbers").length(11, "idNumber_invalid"),
  nameGe: optionalNameGeSchema,
  nameEn: z
    .string()
    .trim()
    .min(1, "name_en_required")
    .min(2, "name_en_min_length")
    .max(100, "name_en_max_length")
    .regex(/^[A-Za-z\s'\-']+$/, "name_en_letters_only"),
  dateOfBirth: dateOfBirthSchema,
  city: citySchema,
  address: z.string().trim().min(1, "address_required").min(5, "address_min_length").max(200, "address_max_length"),
  email: emailSchema(150),
  phone: z
    .string()
    .trim()
    .min(1, "phone_required")
    .regex(/^(\+?995\s?)?5\d{2}\s?\d{3}\s?\d{3}$/, "phone_invalid"),
});

export const validateProfileUpdate = (data: ProfileUpdateFormData): ProfileFormErrors =>
  parseForm(profileUpdateSchema, data);
