import "./login.scss";
import { useState } from "react";
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
import TextInput from "@/utils/sharedComponents/Textinput";
import PasswordInput from "@/utils/sharedComponents/Passwordinput";

function Login() {
  useCheckIfUserIsLogin();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<LoginFormErrors>({});

  const { startCooldown, isCooldownActive, cooldownText, isButtonDisabled } =
    useRateLimitCooldown(120);

  const [data, setData] = useState<LoginTypes>({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setData((prev) => ({ ...prev, [id]: value }));
    if (errors[id as keyof LoginFormErrors]) {
      setErrors((prev) => ({ ...prev, [id]: undefined }));
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

        <form noValidate onSubmit={handleLogin} className="login-form__inputs">
          <TextInput
            id="email"
            label="ელ. ფოსტა"
            type="email"
            value={data.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="მაგ: example@gmail.com"
          />

          <PasswordInput
            id="password"
            label="პაროლი"
            value={data.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="შეიყვანე პაროლი"
          />

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
