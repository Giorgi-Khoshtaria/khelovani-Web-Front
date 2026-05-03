import { z } from "zod";
import { strictPasswordSchema, parseForm } from "./shared/zodHelpers";

export interface ChangePasswordFormData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export type ChangePasswordErrors = Record<string, string>;

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "old_password_required"),
    newPassword: strictPasswordSchema,
    confirmPassword: z.string().min(1, "confirm_password"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "password_mismatch",
  })
  .refine((d) => d.oldPassword !== d.newPassword, {
    path: ["newPassword"],
    message: "new_password_same_as_old",
  });

export const validateChangePassword = (data: ChangePasswordFormData): ChangePasswordErrors =>
  parseForm(changePasswordSchema, data);
