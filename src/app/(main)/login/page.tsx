"use client";
import Image from "next/image";

import "./login.scss";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";
import type { LoginTypes } from "@/lib/types/userTypes";
import { loginUser } from "@/apiCalls/userRequests/auth.req";
import { useAuth } from "@/contexts/AuthContext";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import { useRateLimitCooldown } from "@/lib/hooks/useRateLimitCooldown";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  validateLoginForm,
  type LoginFormErrors,
} from "@/lib/validations/loginValidations";
import TextInput from "@/components/ui/TextInput";
import PasswordInput from "@/components/ui/PasswordInput";
import { useCheckIfUserIsLogin } from "@/lib/hooks/useCheckIfUserIsLogin";
import { useFormHandler } from "@/lib/hooks/useFormHandler";

function Login() {
  useCheckIfUserIsLogin();
  const { login } = useAuth();
  const router = useRouter();

  const { t: tPages } = useClientTranslation("pages");
  const { t: tInputs } = useClientTranslation("inputs");
  const { t: tNav } = useClientTranslation("navigation");
  const { t: tCommon } = useClientTranslation("common");
  const { t: tAlerts } = useClientTranslation("alerts");
  const { lang } = useLanguage();

  const [isLoading, setIsLoading] = useState(false);

  const { startCooldown, isCooldownActive, cooldownSeconds, isButtonDisabled } =
    useRateLimitCooldown(120);

  const {
    formData: data,
    errors,
    setErrors,
    handleChange,
  } = useFormHandler<LoginTypes>({
    email: "",
    password: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateLoginForm(data);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (isCooldownActive) return;

    setIsLoading(true);

    try {
      const response = await loginUser(data, lang);

      if (response.token) {
        login(response.token, response.user?.nameEn, response.user?.nameGe);
      }

      toast.success(
        tAlerts("login_success") || "წარმატებით შეხვედით სისტემაში",
      );
      setTimeout(() => router.push("/"), 1000);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          error?.response?.data?.message ??
          (tAlerts("login_error") || "შეცდომა შევიდა სისტემაში");
        toast.error(message);

        if (error?.response?.status === 429) {
          startCooldown();
          setIsLoading(false);
          return;
        }
      } else if (error instanceof Error && error.message === "Network Error") {
        toast.error(
          tAlerts("server_connection_failed") ||
            "სერვერთან დაკავშირება ვერ მოხერხდა",
        );
      } else {
        toast.error(tAlerts("login_error") || "შეცდომა შევიდა სისტემაში");
      }

      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-page__form">
        <div className="login-content">
          <h2>{tPages("login.title")}</h2>
          <p>{tPages("login.subtitle")}</p>
        </div>

        <form noValidate onSubmit={handleLogin} className="login-form__inputs">
          <TextInput
            id="email"
            label={tInputs("label.email")}
            type="email"
            value={data.email}
            onChange={handleChange}
            error={errors.email}
            placeholder={tInputs("placeholder.email")}
          />

          <PasswordInput
            id="password"
            label={tInputs("label.password")}
            value={data.password}
            onChange={handleChange}
            error={errors.password}
            placeholder={tInputs("placeholder.password")}
          />

          <div className="forgot-password-container">
            <Link href="/forgot-password">{tNav("forgot_password")}</Link>
          </div>

          <div className="sign-in-button">
            <button type="submit" disabled={isLoading || isButtonDisabled}>
              {isCooldownActive
                ? `${cooldownSeconds} ${tCommon("rate_limit_retry_in")}`
                : isLoading
                  ? tCommon("loading")
                  : tNav("login")}
            </button>
          </div>
        </form>

        <div className="register-container">
          <p>{tNav("no_account")}</p>
          <Link href="/register">{tNav("register")}</Link>
        </div>
      </div>

      <div className="back-to-home">
        <Link href="/">
          <Image
            src="/assets/arrow-left-solid-full.svg"
            width={24}
            height={24}
            alt="უკან"
          />
          {tNav("back_to_home")}
        </Link>
      </div>
    </div>
  );
}

export default Login;
