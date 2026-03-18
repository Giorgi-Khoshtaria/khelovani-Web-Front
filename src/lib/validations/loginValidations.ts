"use client";

import type { LoginTypes } from "@/lib/types/userTypes";
import { validateEmail, validatePassword } from "./shared/fieldValidators";

export type LoginFormErrors = {
  email?: string;
  password?: string;
};

export function validateLoginForm(data: LoginTypes): LoginFormErrors {
  const errors: LoginFormErrors = {};

  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(data.password);
  if (passwordError) errors.password = passwordError;

  return errors;
}
