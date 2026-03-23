"use client";

import Image from "next/image";
import "./forgot-password.scss";
import TextInput from "@/components/ui/TextInput";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { forgotPassword } from "@/lib/requests/userRequests/auth.req";
import {
  validateForgotPasswordForm,
  type ForgotPasswordErrors,
} from "@/lib/validations/forgotPasswordValidations";
import { useRateLimitCooldown } from "@/lib/hooks/useRateLimitCooldown";
import { useCheckIfUserIsLogin } from "@/lib/hooks/useCheckIfUserIsLogin";
import Link from "next/link";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";

function ForgotPassword() {
  useCheckIfUserIsLogin();
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<ForgotPasswordErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const { t: tPages } = useClientTranslation("pages");
  const { t: tInputs } = useClientTranslation("inputs");
  const { t: tNav } = useClientTranslation("navigation");
  const { t: tCommon } = useClientTranslation("common");

  const { startCooldown, isCooldownActive, cooldownText, isButtonDisabled } =
    useRateLimitCooldown(120);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors({});
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForgotPasswordForm({ email });
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (isCooldownActive) return;

    setIsLoading(true);

    try {
      await forgotPassword(email);

      setSent(true);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          error?.response?.data?.message ?? (tPages("forgot_password.error") || "მოთხოვნის გაგზავნა ვერ მოხერხდა");
        toast.error(message);

        if (error?.response?.status === 429) {
          startCooldown();
        }
      } else {
        toast.error(tPages("forgot_password.network_error") || "სერვერთან დაკავშირება ვერ მოხერხდა");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password">
      <div className="forgot-password__content">
        <div className="image-content">
          <Image
            src="/assets/lock.svg"
            alt="forgot password"
            width={24}
            height={24}
          />
        </div>

        {sent ? (
          // ── Success state ──────────────────────────────────
          <>
            <h1 className="title">{tPages("forgot_password.sent_title")}</h1>
            <p>
              {tPages("forgot_password.sent_sub")}{" "}
              <strong>{email}</strong>
            </p>
            <Link
              href="/login"
              className="send-btn"
              style={{ textAlign: "center", textDecoration: "none" }}
            >
              {tNav("back_to_login") || "შესვლის გვერდზე დაბრუნება"}
            </Link>
          </>
        ) : (
          // ── Form state ────────────────────────────────────
          <>
            <h1 className="title">{tPages("forgot_password.title")}</h1>
            <p>{tPages("forgot_password.subtitle")}</p>
            <form action="" className="form" onSubmit={handleSubmit} noValidate>
              <TextInput
                id="email"
                label={tInputs("label.email")}
                type="email"
                value={email}
                onChange={handleChange}
                error={errors.email}
                placeholder={tInputs("placeholder.email")}
              />

              <button
                className="send-btn"
                type="submit"
                disabled={isLoading || isButtonDisabled}
              >
                {isCooldownActive
                  ? cooldownText
                  : isLoading
                    ? tCommon("loading") || "იგზავნება..."
                    : tCommon("submit") || "გაგზავნა"}
              </button>
            </form>
            <Link href="/login" className="back-link">
              {tNav("back_to_login") || "შესვლის გვერდზე დაბრუნება"}
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
