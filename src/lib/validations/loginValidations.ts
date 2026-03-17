"use client";

import { toast } from "react-toastify";
import type { LoginTypes } from "@/lib/types/userTypes";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import {
  validateEmail,
  validatePassword,
} from "./shared/fieldValidators";

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

export const useCheckIfUserIsLogin = () => {
  const router = useRouter();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;

    const token = localStorage.getItem("access-token");
    if (token) {
      hasRun.current = true;
      toast.error("თქვენ უკვე შესული ხართ სისტემაში");
      setTimeout(() => router.push("/"), 1500);
    }
  }, [router]);
};

