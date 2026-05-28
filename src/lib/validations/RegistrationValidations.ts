import { z } from "zod";
import {
  emailSchema,
  parseForm,
  phoneSchema,
  strictPasswordSchema,
} from "./shared/zodHelpers";

export interface RegistrationFormData {
  idNumber: string;
  nameGe: string;
  nameEn: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

export type FormErrors = Record<string, string>;

const optionalNameGeSchema = z
  .string()
  .trim()
  .transform((value) => (value === "" ? undefined : value))
  .pipe(
    z
      .string()
      .min(2, "name_ge_min_length")
      .max(100, "name_ge_max_length")
      .regex(/^[\u10D0-\u10FF\s'-]+$/, "name_ge_letters_only")
      .optional(),
  );

export const registrationSchema = z
  .object({
    idNumber: z.string().trim().min(1, "idNumber_required").regex(/^\d+$/, "idNumber_only_numbers").length(11, "idNumber_invalid"),
    nameGe: optionalNameGeSchema,
    nameEn: z
      .string()
      .trim()
      .min(1, "name_en_required")
      .min(2, "name_en_min_length")
      .max(100, "name_en_max_length")
      .regex(/^[A-Za-z\s'\-']+$/, "name_en_letters_only"),
    email: emailSchema(150),
    phone: phoneSchema.max(40, "phone_too_long"),
    password: strictPasswordSchema,
    confirmPassword: z.string().min(1, "confirm_password"),
    terms: z.boolean().refine((value) => value === true, {
      message: "terms_required",
    }),
  })
  .strict()
  .refine((data) => data.confirmPassword === data.password, {
    path: ["confirmPassword"],
    message: "password_mismatch",
  });

export const validateRegistrationForm = (
  formData: RegistrationFormData,
): FormErrors => {
  return parseForm(registrationSchema, formData);
};
