import "./registration.scss";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import arrowLeft from "/assets/arrow-left-solid-full.svg";
import { registerUser } from "../../utils/requests/userRequests/registration.req";
import type { UserTypes } from "../../utils/types/userTypes";
import PasswordInput from "../../components/registrationComponents/PasswordInput";
import {
  validateRegistrationForm,
  type RegistrationFormData,
  type FormErrors,
} from "../../utils/validations/RegistrtionValidations";

const INITIAL_FORM: RegistrationFormData = {
  idNumber: "",
  nameGe: "",
  nameEn: "",
  dateOfBirth: "",
  city: "",
  address: "",
  email: "",
  password: "",
  confirmPassword: "",
  terms: false,
};

export default function Registration() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegistrationFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

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

    // Clear error on change
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateRegistrationForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("გთხოვთ შეასწოროთ ფორმაში არსებული შეცდომები");
      return;
    }

    setIsLoading(true);
    try {
      const payload: UserTypes = {
        idNumber: formData.idNumber,
        nameGe: formData.nameGe || undefined,
        nameEn: formData.nameEn,
        dateOfBirth: formData.dateOfBirth,
        city: formData.city,
        address: formData.address,
        email: formData.email,
        password: formData.password,
      };

      await registerUser(payload);
      toast.success("ანგარიში წარმატებით შეიქმნა! გთხოვთ გაიაროთ ავტორიზაცია.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error: unknown) {
      if (error instanceof Error && "response" in error) {
        // @ts-expect-error axios error
        const responseData = error?.response?.data;

        if (responseData?.errors && Array.isArray(responseData.errors)) {
          // 422 — backend validation errors array → show each as individual toast
          responseData.errors.forEach(
            (err: { field: string; message: string }) => {
              toast.error(err.message);
            },
          );
        } else if (responseData?.message) {
          // 409 duplicate / 500 server error → single message toast
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

        <form className="registration-form__inputs" onSubmit={handleSubmit}>
          {/* ID Number */}
          <div className="form-group form-group--full">
            <label htmlFor="idNumber">პირადი ნომერი *</label>
            <input
              type="text"
              id="idNumber"
              value={formData.idNumber}
              onChange={handleChange}
              className={errors.idNumber ? "input-error" : ""}
              placeholder="11-ნიშნა პირადი ნომერი"
              maxLength={11}
            />
            {errors.idNumber && (
              <span className="error-text">{errors.idNumber}</span>
            )}
          </div>

          {/* Names */}
          <div className="form-group">
            <label htmlFor="nameGe">სახელი და გვარი (ქართულად)</label>
            <input
              type="text"
              id="nameGe"
              value={formData.nameGe}
              onChange={handleChange}
              placeholder="სახელი გვარი"
            />
          </div>

          <div className="form-group">
            <label htmlFor="nameEn">სახელი და გვარი (ლათინურად) *</label>
            <input
              type="text"
              id="nameEn"
              value={formData.nameEn}
              onChange={handleChange}
              className={errors.nameEn ? "input-error" : ""}
              placeholder="First and Last Name"
            />
            {errors.nameEn && (
              <span className="error-text">{errors.nameEn}</span>
            )}
          </div>

          {/* Email */}
          <div className="form-group form-group--full">
            <label htmlFor="email">ელ-ფოსტა *</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "input-error" : ""}
              placeholder="example@mail.com"
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          {/* DOB + City */}
          <div className="form-group">
            <label htmlFor="dateOfBirth">დაბადების თარიღი *</label>
            <input
              type="date"
              id="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className={errors.dateOfBirth ? "input-error" : ""}
            />
            {errors.dateOfBirth && (
              <span className="error-text">{errors.dateOfBirth}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="city">ქალაქი *</label>
            <select
              id="city"
              value={formData.city}
              onChange={handleChange}
              className={errors.city ? "input-error" : ""}
            >
              <option value="" disabled>
                აირჩიე ქალაქი
              </option>
              <option value="tbilisi">თბილისი</option>
              <option value="batumi">ბათუმი</option>
              <option value="kutaisi">ქუთაისი</option>
              <option value="rustavi">რუსთავი</option>
              <option value="gori">გორი</option>
              <option value="zugdidi">ზუგდიდი</option>
            </select>
            {errors.city && <span className="error-text">{errors.city}</span>}
          </div>

          {/* Address */}
          <div className="form-group form-group--full">
            <label htmlFor="address">მისამართი *</label>
            <input
              type="text"
              id="address"
              value={formData.address}
              onChange={handleChange}
              className={errors.address ? "input-error" : ""}
              placeholder="ქუჩა, შენობა, ბინა"
            />
            {errors.address && (
              <span className="error-text">{errors.address}</span>
            )}
          </div>

          {/* Passwords — reusable component */}
          <PasswordInput
            id="password"
            label="პაროლი *"
            value={formData.password}
            onChange={handleChange}
            placeholder="შექმენი ძლიერი პაროლი"
            hasError={!!errors.password}
            errorMessage={errors.password}
          />

          <PasswordInput
            id="confirmPassword"
            label="გაიმეორე პაროლი *"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="ხელახლა შეიყვანე პაროლი"
            hasError={!!errors.confirmPassword}
            errorMessage={errors.confirmPassword}
          />

          {/* Terms */}
          <div className="terms-container form-group--full">
            <div
              style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}
            >
              <input
                type="checkbox"
                id="terms"
                checked={formData.terms}
                onChange={handleChange}
              />
              <label htmlFor="terms">
                ვეთანხმები <Link to="/terms">მომსახურების პირობებს</Link> და{" "}
                <Link to="/privacy">კონფიდენციალურობის პოლიტიკას</Link>
              </label>
            </div>
            {errors.terms && <span className="error-text">{errors.terms}</span>}
          </div>

          <button
            type="submit"
            className="create-account-btn form-group--full"
            disabled={isLoading}
          >
            {isLoading ? "მიმდინარეობს..." : "ანგარიშის შექმნა"}
          </button>
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
