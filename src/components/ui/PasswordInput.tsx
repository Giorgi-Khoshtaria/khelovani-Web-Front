"use client";

import { useState } from "react";
import { EyeOpen, EyeOff } from "@/components/ui/EyeIcons";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import FormField from "./FormField";

interface PasswordInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  fullWidth?: boolean;
}

export default function PasswordInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
  fullWidth,
}: PasswordInputProps) {
  const { t } = useClientTranslation(["common"]);
  const [show, setShow] = useState(false);

  return (
    <FormField id={id} label={label} error={error} fullWidth={fullWidth}>
      <div className={`input-password${error ? " input-error" : ""}`}>
        <input
          type={show ? "text" : "password"}
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
        <button
          type="button"
          className="toggle-password"
          onClick={() => setShow((p) => !p)}
          aria-label={t(show ? "hide_password" : "show_password")}
          aria-pressed={show}
        >
          {show ? <EyeOff /> : <EyeOpen />}
        </button>
      </div>
    </FormField>
  );
}
