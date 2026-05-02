import { z } from "zod";
import {
  emailSchema,
  parseForm,
  strictPasswordSchema,
} from "./shared/zodHelpers";

export type ForgotPasswordErrors = {
  email?: string;
};

export type ResetPasswordErrors = {
  password?: string;
  confirmPassword?: string;
};

export const forgotPasswordSchema = z
  .object({
    email: emailSchema(150),
  })
  .strict();

export const resetPasswordSchema = z
  .object({
    password: strictPasswordSchema,
    confirmPassword: z.string().min(1, "confirm_password"),
  })
  .strict()
  .refine((data) => data.confirmPassword === data.password, {
    path: ["confirmPassword"],
    message: "password_mismatch",
  });

export function validateForgotPasswordForm(data: {
  email: string;
}): ForgotPasswordErrors {
  return parseForm(forgotPasswordSchema, data);
}

export function validateResetPasswordForm(data: {
  password: string;
  confirmPassword: string;
}): ResetPasswordErrors {
  return parseForm(resetPasswordSchema, data);
}
