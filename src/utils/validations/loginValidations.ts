import { toast } from "react-toastify";
import type { LoginTypes } from "../../utils/types/userTypes";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
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

export const useCheckIfUserIsLogin = () => {
  const navigate = useNavigate();
  const hasRun = useRef(false); // ← prevents double fire

  useEffect(() => {
    if (hasRun.current) return; // ← skip if already ran

    const token = localStorage.getItem("access-token");
    if (token) {
      hasRun.current = true; // ← mark as ran
      toast.error("თქვენ უკვე შესული ხართ სისტემაში");
      setTimeout(() => navigate("/"), 1500);
    }
  }, [navigate]);
};
