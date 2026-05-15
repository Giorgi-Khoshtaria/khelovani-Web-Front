"use client";

import { ReactNode } from "react";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";

interface FormFieldProps {
  id: string;
  label: ReactNode;
  error?: string;
  fullWidth?: boolean;
  /** Optional hint shown under the field when there's no error. */
  hint?: ReactNode;
  children: ReactNode;
}

/**
 * Shared wrapper for form inputs — label, body slot, error/hint footer.
 * Encapsulates the `.form-group` shell that every input control duplicated.
 *
 * The `htmlFor` association is the caller's responsibility:
 *   <FormField id="email" label={...}>
 *     <input id="email" ... />
 *   </FormField>
 */
export default function FormField({
  id,
  label,
  error,
  fullWidth,
  hint,
  children,
}: FormFieldProps) {
  const { t } = useClientTranslation(["validation"]);
  return (
    <div className={`form-group${fullWidth ? " form-group--full" : ""}`}>
      <label htmlFor={id}>{label}</label>
      {children}
      {error ? (
        <span className="error-text">{t(error)}</span>
      ) : hint ? (
        <span className="hint-text">{hint}</span>
      ) : null}
    </div>
  );
}
