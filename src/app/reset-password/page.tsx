"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import axios from "axios";
import "./reset-password.scss";
import PasswordInput from "@/components/ui/PasswordInput";
import { resetPassword } from "@/lib/requests/userRequests/auth.req";
import {
  validateResetPasswordForm,
  type ResetPasswordErrors,
} from "@/lib/validations/forgotPasswordValidations";

// ── Inner component (needs useSearchParams) ───────────────────────────────
function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<ResetPasswordErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);

  // No token in URL → show error immediately
  if (!token) {
    return (
      <div className="reset-password">
        <div className="reset-password__content">
          <div className="rp-error">
            <div className="rp-icon">
              <svg viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
                <circle
                  cx="26"
                  cy="26"
                  r="25"
                  fill="none"
                  stroke="#d32f2f"
                  strokeWidth="2"
                />
                <path
                  fill="none"
                  stroke="#d32f2f"
                  strokeWidth="2.5"
                  d="M16 16l20 20M36 16l-20 20"
                />
              </svg>
            </div>
            <h1>ბმული არასწორია</h1>
            <p>პაროლის აღდგენის ბმული არასწორია ან ვადა გასულია.</p>
            <Link href="/forgot-password">ახლიდან სცადე</Link>
          </div>
        </div>
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id as keyof ResetPasswordErrors]) {
      setErrors((prev) => ({ ...prev, [id]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateResetPasswordForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      await resetPassword(token, formData.password);
      setDone(true);
      toast.success("პაროლი წარმატებით შეიცვალა");
      setTimeout(() => router.push("/login"), 2000);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          error?.response?.data?.message ?? "პაროლის შეცვლა ვერ მოხერხდა";
        toast.error(message);
      } else {
        toast.error("სერვერთან დაკავშირება ვერ მოხერხდა");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (done) {
    return (
      <div className="reset-password">
        <div className="reset-password__content">
          <div className="rp-success">
            <div className="rp-icon">
              <svg viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
                <circle
                  cx="26"
                  cy="26"
                  r="25"
                  fill="none"
                  stroke="#111827"
                  strokeWidth="2"
                />
                <path
                  fill="none"
                  stroke="#111827"
                  strokeWidth="2.5"
                  d="M14 27l8 8 16-16"
                />
              </svg>
            </div>
            <h1>პაროლი შეიცვალა!</h1>
            <p>შეგიძლია ახლა შეხვიდე სისტემაში ახალი პაროლით.</p>
            <Link href="/login">შესვლა</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password">
      <div className="reset-password__content">
        <div className="image-content">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#111827"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        <h1 className="title">ახალი პაროლი</h1>
        <p>შეიყვანე ახალი პაროლი შენი ანგარიშისთვის</p>

        <form className="form" onSubmit={handleSubmit} noValidate>
          <PasswordInput
            id="password"
            label="ახალი პაროლი"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="მინ. 8 სიმბოლო"
          />

          <PasswordInput
            id="confirmPassword"
            label="გაიმეორე პაროლი"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            placeholder="გაიმეორე ახალი პაროლი"
          />

          <button
            className="reset-btn"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "მიმდინარეობს..." : "პაროლის შეცვლა"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Page (wraps with Suspense for useSearchParams) ────────────────────────
export default function ResetPassword() {
  return (
    <Suspense
      fallback={
        <div className="reset-password">
          <div className="reset-password__content">
            <p>იტვირთება...</p>
          </div>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
