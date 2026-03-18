import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from "./shared/fieldValidators";

// ── Forgot Password ───────────────────────────────────────────────────────────
export type ForgotPasswordErrors = {
  email?: string;
};

export function validateForgotPasswordForm(data: {
  email: string;
}): ForgotPasswordErrors {
  const errors: ForgotPasswordErrors = {};
  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;
  return errors;
}

// ── Reset Password ────────────────────────────────────────────────────────────
export type ResetPasswordErrors = {
  password?: string;
  confirmPassword?: string;
};

export function validateResetPasswordForm(data: {
  password: string;
  confirmPassword: string;
}): ResetPasswordErrors {
  const errors: ResetPasswordErrors = {};

  const passwordError = validatePassword(data.password);
  if (passwordError) errors.password = passwordError;

  const confirmError = validateConfirmPassword(
    data.password,
    data.confirmPassword,
  );
  if (confirmError) errors.confirmPassword = confirmError;

  return errors;
}
