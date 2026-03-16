import "./registration.scss";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import arrowLeft from "/assets/arrow-left-solid-full.svg";
import { registerUser } from "../../utils/requests/userRequests/auth.req";
import type { UserTypes } from "../../utils/types/userTypes";
import {
  validateRegistrationForm,
  type RegistrationFormData,
  type FormErrors,
} from "../../utils/validations/RegistrtionValidations";
import { useRateLimitCooldown } from "@/utils/limiters/requestLimiter";
import { useCheckIfUserIsLogin } from "@/utils/validations/loginValidations";
import TextInput from "@/utils/sharedComponents/Textinput";
import PhoneInput from "@/utils/sharedComponents/Phoneinput";
import PasswordInput from "@/utils/sharedComponents/PasswordInput";
import SelectInput from "@/utils/sharedComponents/Selectinput";
import TermsCheckbox from "@/utils/sharedComponents/Termscheckbox";
import { CITY_OPTIONS } from "@/utils/sharedComponents/Cityoptions";

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
  const navigate = useNavigate();
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
        phone: `+995${formData.phone}`,
        email: formData.email,
        password: formData.password,
      };

      await registerUser(payload);
      toast.success("ანგარიში წარმატებით შეიქმნა! გთხოვთ გაიაროთ ავტორიზაცია.");
      setTimeout(() => navigate("/login"), 2000);
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
            უკვე გაქვს ანგარიში? <Link to="/login">შესვლა</Link>
          </p>
        </div>
      </div>

      <div className="back-to-home">
        <Link to="/">
          <img src={arrowLeft} alt="უკან" />
          მთავარ გვერდზე დაბრუნება
        </Link>
      </div>
    </div>
  );
}
