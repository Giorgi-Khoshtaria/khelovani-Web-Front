import React from "react";
import "./login.scss";
import { Link } from "react-router-dom";
import arrowLeft from "/public/assets/arrow-left-solid-full.svg";
function Login() {
  return (
    <div className="login-page">
      <div className="login-page__form">
        <div className="login-content">
          <h2>Welcome Back</h2>
          <p> Sign in to your account to continue</p>
        </div>
        <form className="login-form__inputs">
          <div>
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" placeholder="example@gmail.com" />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
            />
          </div>
        </form>
        <div className="forgot-password-container">
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>
        <div className="sign-in-button">
          <button>Sign In</button>
        </div>
        <div className="register-container">
          <p>Don't have an account?</p>
          <Link to="/register">Register</Link>
        </div>
      </div>
      <div className="back-to-home">
        <Link to="/">
          <img src={arrowLeft} alt="arrow left" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default Login;
