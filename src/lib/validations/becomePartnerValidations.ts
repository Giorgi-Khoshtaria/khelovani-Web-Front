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
  companyNameGe: z
    .string()
    .trim()
    .min(1, "companyNameGe_required")
    .max(100, "companyNameGe_max_length")
    .regex(/^[ა-ჿ0-9\s&.,'-]+$/, "companyNameGe_invalid"),
  companyNameEn: z
    .string()
    .trim()
    .min(1, "companyNameEn_required")
    .max(100, "companyNameEn_max_length")
    .regex(/^[A-Za-z0-9\s&.,'-]+$/, "companyNameEn_invalid"),
  phone: phoneSchema,
  city: citySchema,
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

export const PARTNER_CATEGORY_LIMITS = {
  [PartnerTypeEnum.ORGANIZATION]: { min: 1, max: 5 },
  [PartnerTypeEnum.INDIVIDUAL]: { min: 1, max: 3 },
} as const;

const organizationBranch = z.object({
  partnerType: z.literal(PartnerTypeEnum.ORGANIZATION),
  identificationCode: z
    .string()
    .trim()
    .min(1, "id_code_required")
    .regex(/^\d+$/, "id_code_only_numbers_org")
    .length(9, "id_code_invalid_org"),
  contactPerson: z.string().trim().min(1, "contactPerson_required").max(100, "contactPerson_max_length"),
  ...sharedFields,
  categories: z
    .array(z.string())
    .min(PARTNER_CATEGORY_LIMITS[PartnerTypeEnum.ORGANIZATION].min, "categories_required")
    .max(PARTNER_CATEGORY_LIMITS[PartnerTypeEnum.ORGANIZATION].max, "categories_max_org"),
});

const individualBranch = z.object({
  partnerType: z.literal(PartnerTypeEnum.INDIVIDUAL),
  personalNumber: z
    .string()
    .trim()
    .min(1, "id_number_required")
    .regex(/^\d+$/, "id_number_only_numbers")
    .length(11, "id_number_invalid"),
  ...sharedFields,
  categories: z
    .array(z.string())
    .min(PARTNER_CATEGORY_LIMITS[PartnerTypeEnum.INDIVIDUAL].min, "categories_required")
    .max(PARTNER_CATEGORY_LIMITS[PartnerTypeEnum.INDIVIDUAL].max, "categories_max_individual"),
});

export const partnerRegistrationSchema = z.discriminatedUnion("partnerType", [
  organizationBranch,
  individualBranch,
]);

export type PartnerFormData = z.infer<typeof partnerRegistrationSchema>;

export const validatePartnerForm = (formData: PartnerFormData): FormErrors => {
  return parseForm(partnerRegistrationSchema, formData);
};
