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
import Link from "next/link";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<ForgotPasswordErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

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
          error?.response?.data?.message ??
          "მოთხოვნის გაგზავნა ვერ მოხერხდა";
        toast.error(message);

        if (error?.response?.status === 429) {
          startCooldown();
        }
      } else {
        toast.error("სერვერთან დაკავშირება ვერ მოხერხდა");
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
            <h1 className="title">შეამოწმე ელ. ფოსტა</h1>
            <p>
              პაროლის აღდგენის ბმული გაგზავნილია{" "}
              <strong>{email}</strong>-ზე. შეამოწმე შენი შემოსული ფოსტა.
            </p>
            <Link href="/login" className="send-btn" style={{ textAlign: "center", textDecoration: "none" }}>
              შესვლის გვერდზე დაბრუნება
            </Link>
          </>
        ) : (
          // ── Form state ────────────────────────────────────
          <>
            <h1 className="title">დაგავიწყდა პაროლი?</h1>
            <p>
              შეიყვანე შენი მეილი და ჩვენ გამოგიგზავნით <br /> პაროლის
              აღდგენის ბმულს
            </p>
            <form action="" className="form" onSubmit={handleSubmit} noValidate>
              <TextInput
                id="email"
                label="ელ. ფოსტა"
                type="email"
                value={email}
                onChange={handleChange}
                error={errors.email}
                placeholder="company@example.com"
              />

              <button
                className="send-btn"
                type="submit"
                disabled={isLoading || isButtonDisabled}
              >
                {isCooldownActive
                  ? cooldownText
                  : isLoading
                    ? "იგზავნება..."
                    : "გაგზავნა"}
              </button>
            </form>
            <Link href="/login" className="back-link">
              შესვლის გვერდზე დაბრუნება
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
