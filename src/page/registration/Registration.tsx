import { useState } from "react";
import "./registration.scss";
import { Link } from "react-router-dom";
import arrowLeft from "/assets/arrow-left-solid-full.svg";

const EyeOpen = () => (
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
);

const EyeOff = () => (
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
);

function Registration() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="registration-page">
      <div className="registration-page__form">
        <div className="registration-content">
          <h2>ანგარიშის შექმნა</h2>
          <p>შემოგვიერთდი და აღმოაჩინე ქართული ხელოსნური ნივთები</p>
        </div>

        <form className="registration-form__inputs">
          {/* Full width: ID */}
          <div className="form-group form-group--full">
            <label htmlFor="idNumber">პირადი ნომერი</label>
            <input
              type="text"
              id="idNumber"
              placeholder="11-ნიშნა პირადი ნომერი"
              maxLength={11}
            />
          </div>

          {/* 2 cols: Names */}
          <div className="form-group">
            <label htmlFor="nameGe">სახელი და გვარი (ქართულად)</label>
            <input type="text" id="nameGe" placeholder="სახელი გვარი" />
          </div>

          <div className="form-group">
            <label htmlFor="nameEn">სახელი და გვარი (ლათინურად)</label>
            <input type="text" id="nameEn" placeholder="First and Last Name" />
          </div>

          {/* 2 cols: DOB + City */}
          <div className="form-group">
            <label htmlFor="dob">დაბადების თარიღი</label>
            <input type="date" id="dob" />
          </div>

          <div className="form-group">
            <label htmlFor="city">ქალაქი</label>
            <select id="city" defaultValue="">
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
          </div>

          {/* Full width: Address */}
          <div className="form-group form-group--full">
            <label htmlFor="address">მისამართი</label>
            <input type="text" id="address" placeholder="ქუჩა, შენობა, ბინა" />
          </div>

          {/* 2 cols: Passwords */}
          <div className="form-group">
            <label htmlFor="password">პაროლი</label>
            <div className="input-password">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="შექმენი ძლიერი პაროლი"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword((p) => !p)}
                aria-label="პაროლის ჩვენება"
              >
                {showPassword ? <EyeOff /> : <EyeOpen />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">გაიმეორე პაროლი</label>
            <div className="input-password">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                placeholder="ხელახლა შეიყვანე პაროლი"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword((p) => !p)}
                aria-label="პაროლის ჩვენება"
              >
                {showConfirmPassword ? <EyeOff /> : <EyeOpen />}
              </button>
            </div>
          </div>

          {/* Full width: Terms + Submit */}
          <div className="terms-container form-group--full">
            <input type="checkbox" id="terms" />
            <label htmlFor="terms">
              ვეთანხმები <Link to="/terms">მომსახურების პირობებს</Link> და{" "}
              <Link to="/privacy">კონფიდენციალურობის პოლიტიკას</Link>
            </label>
          </div>

          <button type="submit" className="create-account-btn form-group--full">
            ანგარიშის შექმნა
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

export default Registration;
