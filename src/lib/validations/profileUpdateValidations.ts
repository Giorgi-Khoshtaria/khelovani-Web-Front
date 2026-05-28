import { z } from "zod";
import { emailSchema, parseForm } from "./shared/zodHelpers";

export interface ProfileUpdateFormData {
  idNumber: string;
  nameGe: string;
  nameEn: string;
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
  email: emailSchema(150),
  phone: z
    .string()
    .trim()
    .min(1, "phone_required")
    .regex(/^(\+?995\s?)?5\d{2}\s?\d{3}\s?\d{3}$/, "phone_invalid"),
});

export const validateProfileUpdate = (data: ProfileUpdateFormData): ProfileFormErrors =>
  parseForm(profileUpdateSchema, data);
