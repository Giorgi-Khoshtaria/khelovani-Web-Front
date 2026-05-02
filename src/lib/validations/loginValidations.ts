"use client";

import { z } from "zod";
import type { LoginTypes } from "@/lib/types/userTypes";
import { emailSchema, parseForm } from "./shared/zodHelpers";

export type LoginFormErrors = {
  email?: string;
  password?: string;
};

export const loginSchema = z
  .object({
    email: emailSchema(255),
    password: z.string().min(1, "password_required").max(100, "password_too_long"),
  })
  .strict();

export function validateLoginForm(data: LoginTypes): LoginFormErrors {
  return parseForm(loginSchema, data);
}
