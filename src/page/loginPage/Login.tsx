import { useState } from "react";
import "./login.scss";
import { Link, useNavigate } from "react-router-dom";
import arrowLeft from "/assets/arrow-left-solid-full.svg";
import type { LoginTypes } from "../../utils/types/userTypes";
import { toast } from "react-toastify";
import { loginUser } from "@/utils/requests/userRequests/auth.req";
import axios from "axios";
import { useRateLimitCooldown } from "@/utils/limiters/requestLimiter";
import {
  validateLoginForm,
  type LoginFormErrors,
  useCheckIfUserIsLogin,
} from "@/utils/validations/loginValidations";

function Login() {
  useCheckIfUserIsLogin();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<LoginFormErrors>({});

  const { startCooldown, isCooldownActive, cooldownText, isButtonDisabled } =
    useRateLimitCooldown(120);

  const [data, setData] = useState<LoginTypes>({
    email: "",
    password: "",
  });

  const handleFieldChange = (field: keyof LoginTypes, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

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
      const response = await loginUser(data);

      if (response.token) {
        localStorage.setItem("access-token", response.token);
      }

      toast.success("წარმატებით შეხვედით სისტემაში");
      setTimeout(() => navigate("/"), 2000);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          error?.response?.data?.message ?? "შეცდომა შევიდა სისტემაში";
        toast.error(message);

        if (error?.response?.status === 429) {
          startCooldown();
          setIsLoading(false);
          return;
        }
      } else if (error instanceof Error && error.message === "Network Error") {
        toast.error("სერვერთან დაკავშირება ვერ მოხერხდა");
      } else {
        toast.error("შეცდომა შევიდა სისტემაში");
      }

      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-page__form">
        <div className="login-content">
          <h2>კეთილი იყოს თქვენი მობრძანება</h2>
          <p>შედი შენს ანგარიშზე გასაგრძელებლად</p>
        </div>

        <form noValidate onSubmit={handleLogin} className="login-form__inputs ">
          <div className="form-field">
            <label htmlFor="email">ელ. ფოსტა</label>
            <input
              type="email"
              id="email"
              placeholder="მაგ: example@gmail.com"
              value={data.email}
              onChange={(e) => handleFieldChange("email", e.target.value)}
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && (
              <span className="field-error">{errors.email}</span>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="password">პაროლი</label>
            <div
              className={`input-password ${errors.password ? "input-error" : ""}`}
            >
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="შეიყვანე პაროლი"
                value={data.password}
                onChange={(e) => handleFieldChange("password", e.target.value)}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword((p) => !p)}
                aria-label="პაროლის ჩვენება"
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <span className="field-error">{errors.password}</span>
            )}
          </div>

          <div className="forgot-password-container">
            <Link to="/forgot-password">პაროლი დაგავიწყდა?</Link>
          </div>

          <div className="sign-in-button">
            <button type="submit" disabled={isLoading || isButtonDisabled}>
              {isCooldownActive
                ? cooldownText
                : isLoading
                  ? "მიმდინარეობს..."
                  : "შესვლა"}
            </button>
          </div>
        </form>

        <div className="register-container">
          <p>არ გაქვს ანგარიში?</p>
          <Link to="/register">რეგისტრაცია</Link>
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

export default Login;
