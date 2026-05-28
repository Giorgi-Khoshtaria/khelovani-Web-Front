import { z } from "zod";
import { parseForm } from "./shared/zodHelpers";
import { AddressType } from "@/lib/types/addressTypes";

export interface AddressFormData {
  type: AddressType;
  addressLine: string;
  city: string;
  postalCode: string;
  additionalComment: string;
  isDefault: boolean;
}

export type AddressFormErrors = Record<string, string>;

export const addressSchema = z
  .object({
    type: z.enum(AddressType, { message: "address_type_invalid" }),
    addressLine: z
      .string()
      .trim()
      .min(1, "address_line_required")
      .min(5, "address_line_min_length")
      .max(200, "address_line_max_length"),
    city: z
      .string()
      .trim()
      .min(1, "address_city_required")
      .max(100, "address_city_max_length"),
    postalCode: z
      .string()
      .trim()
      .max(20, "address_postal_max_length")
      .optional()
      .or(z.literal("")),
    additionalComment: z
      .string()
      .trim()
      .max(300, "address_comment_max_length")
      .optional()
      .or(z.literal("")),
    isDefault: z.boolean().optional(),
  })
  .strict();

export const validateAddressForm = (
  data: AddressFormData,
): AddressFormErrors => parseForm(addressSchema, data);
