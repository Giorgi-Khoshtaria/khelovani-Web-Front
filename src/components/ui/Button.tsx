"use client";

import { ButtonHTMLAttributes, ReactNode, forwardRef } from "react";
import "./Button.scss";

type Variant = "primary" | "secondary" | "ghost" | "icon" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  isLoading?: boolean;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "md",
    leadingIcon,
    trailingIcon,
    isLoading = false,
    fullWidth = false,
    disabled,
    className,
    children,
    ...rest
  },
  ref,
) {
  const classes = [
    "btn",
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth ? "btn--full" : "",
    isLoading ? "btn--loading" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      ref={ref}
      type="button"
      className={classes}
      disabled={disabled || isLoading}
      {...rest}
    >
      {leadingIcon && (
        <span className="btn__icon" aria-hidden="true">
          {leadingIcon}
        </span>
      )}
      <span className="btn__label">{children}</span>
      {trailingIcon && (
        <span className="btn__icon" aria-hidden="true">
          {trailingIcon}
        </span>
      )}
    </button>
  );
});

export default Button;
