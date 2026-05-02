import { z } from "zod";
import {
  citySchema,
  emailSchema,
  optionalUrlSchema,
  parseForm,
  phoneSchema,
} from "./shared/zodHelpers";
import { PartnerTypeEnum } from "@/lib/types/partnerTypes";

export type FormErrors = Record<string, string>;

const sharedFields = {
  companyNameGe: z.string().trim().min(1, "companyNameGe_required").max(100, "companyNameGe_max_length"),
  companyNameEn: z.string().trim().min(1, "companyNameEn_required").max(100, "companyNameEn_max_length"),
  phone: phoneSchema,
  city: citySchema,
  categories: z
    .array(z.string().trim().min(1))
    .min(1, "category_required")
    .max(5, "category_too_many"),
  email: emailSchema(254),
  address: z
    .string()
    .trim()
    .min(1, "address_required")
    .max(200, "address_max_length")
    .regex(/^[ა-ჰ0-9\s.,/\\\-()]+$/, "address_needs_georgian"),
  addressEn: z
    .string()
    .trim()
    .min(1, "addressEn_required")
    .max(200, "addressEn_max_length")
    .regex(/^[a-zA-Z0-9\s.,/\\\-()]+$/, "addressEn_needs_english"),
  description: z.string().max(500, "description_max_length").optional().or(z.literal("")),
  descriptionEn: z.string().max(500, "description_max_length").optional().or(z.literal("")),
  website: optionalUrlSchema("website_invalid", true),
  facebook: optionalUrlSchema("facebook_invalid"),
  instagram: optionalUrlSchema("instagram_invalid"),
  tiktok: optionalUrlSchema("tiktok_invalid"),
  terms: z.boolean().refine((value) => value === true, { message: "terms_required" }),
};

const organizationBranch = z.object({
  partnerType: z.literal(PartnerTypeEnum.ORGANIZATION),
  identificationCode: z
    .string()
    .trim()
    .min(1, "id_code_required")
    .regex(/^\d{9}$/, "id_code_invalid_org"),
  contactPerson: z.string().trim().min(1, "contactPerson_required").max(100, "contactPerson_max_length"),
  ...sharedFields,
});

const individualBranch = z.object({
  partnerType: z.literal(PartnerTypeEnum.INDIVIDUAL),
  personalNumber: z
    .string()
    .trim()
    .min(1, "id_number_required")
    .regex(/^\d{11}$/, "id_number_invalid"),
  ...sharedFields,
});

export const partnerRegistrationSchema = z.discriminatedUnion("partnerType", [
  organizationBranch,
  individualBranch,
]);

export type PartnerFormData = z.infer<typeof partnerRegistrationSchema>;

export const validatePartnerForm = (formData: PartnerFormData): FormErrors => {
  return parseForm(partnerRegistrationSchema, formData);
};
