import type { LoginTypes } from "../../utils/types/userTypes";

export type LoginFormErrors = {
  email?: string;
  password?: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 8;

export function validateLoginForm(data: LoginTypes): LoginFormErrors {
  const errors: LoginFormErrors = {};

  if (!data.email) {
    errors.email = "ელ. ფოსტა სავალდებულოა";
  } else if (!EMAIL_REGEX.test(data.email)) {
    errors.email = "შეიყვანეთ სწორი ელ. ფოსტის მისამართი";
  }

  if (!data.password) {
    errors.password = "პაროლი სავალდებულოა";
  } else if (data.password.length < PASSWORD_MIN_LENGTH) {
    errors.password = `პაროლი უნდა შეიცავდეს მინიმუმ ${PASSWORD_MIN_LENGTH} სიმბოლოს`;
  } else if (!/[a-zA-Z]/.test(data.password)) {
    errors.password = "პაროლი უნდა შეიცავდეს მინიმუმ ერთ ასოს";
  } else if (!/[0-9]/.test(data.password)) {
    errors.password = "პაროლი უნდა შეიცავდეს მინიმუმ ერთ ციფრს";
  }

  return errors;
}
