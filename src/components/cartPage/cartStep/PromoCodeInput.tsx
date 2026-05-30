"use client";

import { useState } from "react";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import "./promoCodeInput.scss";

interface Props {
  onApply: (code: string) => boolean;
  applied: boolean;
}

const TagIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path
      d="M20 12 12 4H4v8l8 8 8-8Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <circle cx="8" cy="8" r="1.4" fill="currentColor" />
  </svg>
);

export default function PromoCodeInput({ onApply, applied }: Props) {
  const { t: tPages } = useClientTranslation("pages");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleApply = () => {
    if (!code.trim()) return;
    const ok = onApply(code);
    if (ok) {
      setError("");
    } else {
      setError(tPages("cart.promo.invalid") || "კოდი არასწორია");
    }
  };

  return (
    <div className="promo-code">
      <div className="promo-code__label">
        <TagIcon />
        <span>{tPages("cart.promo.label") || "პრომო კოდი"}</span>
      </div>
      <div className="promo-code__row">
        <input
          type="text"
          className={`promo-code__input${
            error ? " promo-code__input--error" : ""
          }${applied ? " promo-code__input--applied" : ""}`}
          placeholder={tPages("cart.promo.placeholder") || "შეიყვანე კოდი"}
          value={code}
          onChange={(e) => {
            setCode(e.target.value.toUpperCase());
            if (error) setError("");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleApply();
            }
          }}
          maxLength={40}
        />
        <button
          type="button"
          className="promo-code__apply"
          onClick={handleApply}
          disabled={!code.trim()}
        >
          {applied
            ? tPages("cart.promo.applied") || "დადასტურდა"
            : tPages("cart.promo.apply") || "გამოყენება"}
        </button>
      </div>
      {error && <span className="promo-code__error">{error}</span>}
    </div>
  );
}
