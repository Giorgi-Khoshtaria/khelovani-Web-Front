"use client";

import "./registration.scss";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";
import { registerUser } from "@/lib/requests/userRequests/auth.req";
import type { UserTypes } from "@/lib/types/userTypes";
import {
  validateRegistrationForm,
  type RegistrationFormData,
  type FormErrors,
} from "@/lib/validations/RegistrationValidations";
import { useRateLimitCooldown } from "@/lib/hooks/useRateLimitCooldown";
import { useCheckIfUserIsLogin } from "@/lib/validations/loginValidations";
import TextInput from "@/components/ui/TextInput";
import PhoneInput from "@/components/ui/PhoneInput";
import PasswordInput from "@/components/ui/PasswordInput";
import SelectInput from "@/components/ui/SelectInput";
import TermsCheckbox from "@/components/ui/TermsCheckbox";
import { CITY_OPTIONS } from "@/components/ui/CityOptions";

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
  const [formData, setFormData] = useState<RegistrationFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const { startCooldown, isCooldownActive, cooldownText, isButtonDisabled } =
    useRateLimitCooldown(120);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { id, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));

    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

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
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
      };

      await registerUser(payload);
      toast.success(
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
          toast.error("რეგისტრაციის დროს დაფიქსირდა შეცდომა");
        }
      } else if (error instanceof Error && error.message === "Network Error") {
        toast.error("სერვერთან დაკავშირება ვერ მოხერხდა. სცადეთ მოგვიანებით");
      } else {
        toast.error("რეგისტრაციის დროს დაფიქსირდა შეცდომა");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="registration-page">
      <div className="registration-page__form">
        <div className="registration-content">
          <h2>ანგარიშის შექმნა</h2>
          <p>შემოგვიერთდი და აღმოაჩინე ქართული ხელოსნური ნივთები</p>
        </div>

        <form
          className="registration-form__inputs"
          onSubmit={handleSubmit}
          noValidate
        >
          <TextInput
            id="idNumber"
            label="პირადი ნომერი *"
            value={formData.idNumber}
            onChange={handleChange}
            error={errors.idNumber}
            placeholder="11-ნიშნა პირადი ნომერი"
            maxLength={11}
            fullWidth
          />

          <TextInput
            id="nameGe"
            label="სახელი და გვარი (ქართულად)"
            value={formData.nameGe}
            onChange={handleChange}
            placeholder="სახელი გვარი"
          />

          <TextInput
            id="nameEn"
            label="სახელი და გვარი (ლათინურად) *"
            value={formData.nameEn}
            onChange={handleChange}
            error={errors.nameEn}
            placeholder="First and Last Name"
          />

          <TextInput
            id="email"
            label="ელ-ფოსტა *"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="example@mail.com"
          />

          <PhoneInput
            id="phone"
            label="ტელეფონის ნომერი *"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
          />

          <TextInput
            id="dateOfBirth"
            label="დაბადების თარიღი *"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleChange}
            error={errors.dateOfBirth}
          />

          <SelectInput
            id="city"
            label="ქალაქი *"
            value={formData.city}
            onChange={handleChange}
            options={CITY_OPTIONS}
            placeholder="აირჩიე ქალაქი"
            error={errors.city}
          />

          <TextInput
            id="address"
            label="მისამართი *"
            value={formData.address}
            onChange={handleChange}
            error={errors.address}
            placeholder="ქუჩა, შენობა, ბინა"
            fullWidth
          />

          <PasswordInput
            id="password"
            label="პაროლი *"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="შექმენი ძლიერი პაროლი"
          />

          <PasswordInput
            id="confirmPassword"
            label="გაიმეორე პაროლი *"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            placeholder="ხელახლა შეიყვანე პაროლი"
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
                  ? "მიმდინარეობს..."
                  : "ანგარიშის შექმნა"}
            </button>
          </div>
        </form>

        <div className="sign-in-container">
          <p>
            უკვე გაქვს ანგარიში? <Link href="/login">შესვლა</Link>
          </p>
        </div>
      </div>

      <div className="back-to-home">
        <Link href="/">
          <img src="/assets/arrow-left-solid-full.svg" alt="უკან" />
          მთავარ გვერდზე დაბრუნება
        </Link>
      </div>
    </div>
  );
}
