import { useState } from "react";
import { EyeOpen, EyeOff } from "./Eyeicons";

interface PasswordInputProps {
  id: string;
  value: string;
  placeholder: string;
  hasError: boolean;
  errorMessage?: string;
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function PasswordInput({
  id,
  value,
  placeholder,
  hasError,
  errorMessage,
  label,
  onChange,
}: PasswordInputProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <div className="input-password">
        <input
          type={show ? "text" : "password"}
          id={id}
          value={value}
          onChange={onChange}
          className={hasError ? "input-error" : ""}
          placeholder={placeholder}
        />
        <button
          type="button"
          className="toggle-password"
          onClick={() => setShow((p) => !p)}
          aria-label="პაროლის ჩვენება"
        >
          {show ? <EyeOff /> : <EyeOpen />}
        </button>
      </div>
      {hasError && errorMessage && (
        <span className="error-text">{errorMessage}</span>
      )}
    </div>
  );
}

export default PasswordInput;
