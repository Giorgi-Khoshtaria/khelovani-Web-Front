"use client";
import Image from "next/image";

import "./registration.scss";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";
import { registerUser } from "@/apiCalls/userRequests/auth.req";
import type { UserTypes } from "@/lib/types/userTypes";
import {
  validateRegistrationForm,
  type RegistrationFormData,
} from "@/lib/validations/RegistrationValidations";
import { useRateLimitCooldown } from "@/lib/hooks/useRateLimitCooldown";
import { useFormHandler } from "@/lib/hooks/useFormHandler";
import TextInput from "@/components/ui/TextInput";
import PhoneInput from "@/components/ui/PhoneInput";
import PasswordInput from "@/components/ui/PasswordInput";
import SelectInput from "@/components/ui/SelectInput";
import TermsCheckbox from "@/components/ui/TermsCheckbox";
import { CITY_OPTIONS } from "@/components/ui/CityOptions";
import { useCheckIfUserIsLogin } from "@/lib/hooks/useCheckIfUserIsLogin";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import { useLanguage } from "@/contexts/LanguageContext";

const INITIAL_FORM: RegistrationFormData = {
  idNumber: "",
  nameGe: "",
  nameEn: "",
  dateOfBirth: "",
  city: "",
  address: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  terms: false,
};

export default function Registration() {
  useCheckIfUserIsLogin();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { t: tPages } = useClientTranslation("pages");
  const { t: tInputs } = useClientTranslation("inputs");
  const { t: tNav } = useClientTranslation("navigation");
  const { t: tCommon } = useClientTranslation("common");
  const { t: tAlerts } = useClientTranslation("alerts");
  const { lang } = useLanguage();

  const { formData, setFormData, errors, setErrors, handleChange } =
    useFormHandler(INITIAL_FORM);

  const { startCooldown, isCooldownActive, cooldownText, isButtonDisabled } =
    useRateLimitCooldown(120);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateRegistrationForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (isCooldownActive) return;

    setIsLoading(true);

    try {
      const payload: UserTypes = {
        idNumber: formData.idNumber,
        nameGe: formData.nameGe || undefined,
        nameEn: formData.nameEn,
        dateOfBirth: formData.dateOfBirth,
        city: formData.city,
        address: formData.address,
        phone: formData.phone.replace(/^\+?995/, ""),
        email: formData.email,
        password: formData.password,
      };

      await registerUser(payload, lang);
      toast.success(
        tAlerts("account_created") ||
          "ანგარიში წარმატებით შეიქმნა! გთხოვთ დაადასტუროთ თქვენი მეილი",
      );
      setTimeout(() => router.push("/login"), 2000);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error?.response?.status === 429) {
          startCooldown();
          setIsLoading(false);
          return;
        }
        const responseData = error?.response?.data;
        if (responseData?.errors && Array.isArray(responseData.errors)) {
          responseData.errors.forEach(
            (err: { field: string; message: string }) => {
              toast.error(err.message);
            },
          );
        } else if (responseData?.message) {
          toast.error(responseData.message);
        } else {
          toast.error(
            tAlerts("registration_error") ||
              "რეგისტრაციის დროს დაფიქსირდა შეცდომა",
          );
        }
      } else if (error instanceof Error && error.message === "Network Error") {
        toast.error(
          tAlerts("server_connection_failed") ||
            "სერვერთან დაკავშირება ვერ მოხერხდა. სცადეთ მოგვიანებით",
        );
      } else {
        toast.error(
          tAlerts("registration_error") ||
            "რეგისტრაციის დროს დაფიქსირდა შეცდომა",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="registration-page">
      <div className="registration-page__form">
        <div className="registration-content">
          <h2>{tPages("register.title")}</h2>
          <p>{tPages("register.subtitle")}</p>
        </div>

        <form
          className="registration-form__inputs"
          onSubmit={handleSubmit}
          noValidate
        >
          <TextInput
            id="idNumber"
            label={tInputs("label.id_number")}
            value={formData.idNumber}
            onChange={handleChange}
            error={errors.idNumber}
            placeholder={tInputs("placeholder.id_number")}
            maxLength={11}
            fullWidth
          />

          <TextInput
            id="nameGe"
            label={tInputs("label.full_name_ge")}
            value={formData.nameGe}
            onChange={handleChange}
            error={errors.nameGe}
            placeholder={tInputs("placeholder.full_name")}
          />

          <TextInput
            id="nameEn"
            label={tInputs("label.full_name_en")}
            value={formData.nameEn}
            onChange={handleChange}
            error={errors.nameEn}
            placeholder="First and Last Name"
          />

          <TextInput
            id="email"
            label={tInputs("label.email")}
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder={tInputs("placeholder.email")}
          />

          <PhoneInput
            id="phone"
            label={tInputs("label.phone")}
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
          />

          <TextInput
            id="dateOfBirth"
            label={tInputs("label.date_of_birth")}
            type="date"
            value={formData.dateOfBirth}
            onChange={handleChange}
            error={errors.dateOfBirth}
          />

          <SelectInput
            id="city"
            label={tInputs("label.city")}
            value={formData.city}
            onChange={handleChange}
            options={CITY_OPTIONS}
            placeholder={tInputs("placeholder.city")}
            error={errors.city}
          />

          <TextInput
            id="address"
            label={tInputs("label.address")}
            value={formData.address}
            onChange={handleChange}
            error={errors.address}
            placeholder={tInputs("placeholder.address")}
            fullWidth
          />

          <PasswordInput
            id="password"
            label={tInputs("label.password")}
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder={tInputs("placeholder.password")}
          />

          <PasswordInput
            id="confirmPassword"
            label={tInputs("label.confirm_password") || "გაიმეორე პაროლი"}
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            placeholder={tInputs("placeholder.confirm_password")}
          />

          <TermsCheckbox
            id="terms"
            checked={formData.terms}
            onChange={handleChange}
            error={errors.terms}
          />

          <div className="create-account-button">
            <button
              type="submit"
              disabled={isLoading || isButtonDisabled}
              className="create-account-btn"
            >
              {isCooldownActive
                ? cooldownText
                : isLoading
                  ? tCommon("loading")
                  : tNav("register")}
            </button>
          </div>
        </form>

        <div className="sign-in-container">
          <p>
            {tNav("already_account")} <Link href="/login">{tNav("login")}</Link>
          </p>
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
