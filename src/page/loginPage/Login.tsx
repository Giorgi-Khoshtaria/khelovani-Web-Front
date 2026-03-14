import { useState } from "react";
import "./login.scss";
import { Link } from "react-router-dom";
import arrowLeft from "/assets/arrow-left-solid-full.svg";

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="login-page">
      <div className="login-page__form">
        <div className="login-content">
          <h2>კეთილი იყოს თქვენი მობრძანება</h2>
          <p>შედი შენს ანგარიშზე გასაგრძელებლად</p>
        </div>
        <form className="login-form__inputs">
          <div>
            <label htmlFor="email">ელ. ფოსტა</label>
            <input
              type="email"
              id="email"
              placeholder="მაგ: example@gmail.com"
            />
          </div>
          <div>
            <label htmlFor="password">პაროლი</label>
            <div className="input-password">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="შეიყვანე პაროლი"
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
          </div>
        </form>
        <div className="forgot-password-container">
          <Link to="/forgot-password">პაროლი დაგავიწყდა?</Link>
        </div>
        <div className="sign-in-button">
          <button>შესვლა</button>
        </div>
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
