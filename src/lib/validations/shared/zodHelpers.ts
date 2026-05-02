import { z } from "zod";

export type FormErrors = Record<string, string>;

export const VALID_CITIES = [
  "tbilisi",
  "batumi",
  "kutaisi",
  "rustavi",
  "gori",
  "zugdidi",
] as const;

export const PHONE_REGEX = /^(\+?995\s?)?5\d{2}\s?\d{3}\s?\d{3}$/;
export const SPECIAL_CHARACTER_REGEX = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

export const zodToFormErrors = (error: z.ZodError): FormErrors => {
  return error.issues.reduce<FormErrors>((errors, issue) => {
    const field = String(issue.path[0] ?? "");
    if (field && !errors[field]) {
      errors[field] = issue.message;
    }
    return errors;
  }, {});
};

export const parseForm = <T>(schema: z.ZodType<T>, data: unknown): FormErrors => {
  const result = schema.safeParse(data);
  return result.success ? {} : zodToFormErrors(result.error);
};

export const citySchema = z
  .string()
  .trim()
  .min(1, "city_required")
  .refine((value) => VALID_CITIES.includes(value as (typeof VALID_CITIES)[number]), {
    message: "city_invalid",
  });

export const emailSchema = (max: number) =>
  z
    .string()
    .trim()
    .min(1, "email_required")
    .email("email_invalid")
    .max(max, "email_too_long");

export const phoneSchema = z
  .string()
  .trim()
  .min(1, "phone_required")
  .regex(PHONE_REGEX, "phone_invalid");

export const strictPasswordSchema = z
  .string()
  .min(1, "password_required")
  .min(8, "password_min_length")
  .max(64, "password_max_length")
  .refine((value) => /[A-Z]/.test(value), {
    message: "password_needs_uppercase",
  })
  .refine((value) => /[a-z]/.test(value), {
    message: "password_needs_lowercase",
  })
  .refine((value) => /[0-9]/.test(value), {
    message: "password_needs_digit",
  })
  .refine((value) => SPECIAL_CHARACTER_REGEX.test(value), {
    message: "password_needs_special",
  });

export const optionalUrlSchema = (message: string, requireHttp = false) =>
  z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine(
      (value) => {
        if (!value) return true;
        try {
          const url = new URL(value);
          return requireHttp
            ? url.protocol === "http:" || url.protocol === "https:"
            : true;
        } catch {
          return false;
        }
      },
      { message },
    );
