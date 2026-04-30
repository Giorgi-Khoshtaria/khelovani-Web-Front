"use client";

import "./CategoryMultiChips.scss";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";

interface Option {
  value: string;
  label: string;
}

interface CategoryMultiChipsProps {
  label: string;
  options: Option[];
  value: string[];
  onChange: (selected: string[]) => void;
  error?: string;
  maxItems?: number;
}

export default function CategoryMultiChips({
  label,
  options,
  value,
  onChange,
  error,
  maxItems = 5,
}: CategoryMultiChipsProps) {
  const { t } = useClientTranslation(["validation"]);
  const isMaxed = value.length >= maxItems;

  const toggle = (slug: string) => {
    if (value.includes(slug)) {
      onChange(value.filter((v) => v !== slug));
    } else if (!isMaxed) {
      onChange([...value, slug]);
    }
  };

  return (
    <div className="category-multi-field">
      <div className="category-multi-field__header">
        <label>
          {label}
          <span style={{ color: "#d32f2f", marginLeft: 2 }}>*</span>
        </label>
        <span className={`category-multi-field__counter${isMaxed ? " category-multi-field__counter--maxed" : ""}`}>
          {value.length} / {maxItems}
        </span>
      </div>

      <p className="category-multi-field__hint">
        {isMaxed
          ? `მაქსიმუმ ${maxItems} კატეგორია შეგიძლიათ აირჩიოთ`
          : "აირჩიეთ თქვენი საქმიანობის შესაბამისი კატეგორიები"}
      </p>

      <div className={`category-multi-chips${error ? " category-multi-chips--error" : ""}`}>
        {options.map((opt) => {
          const active = value.includes(opt.value);
          const disabled = !active && isMaxed;
          return (
            <button
              key={opt.value}
              type="button"
              className={`category-chip${active ? " category-chip--active" : ""}${disabled ? " category-chip--disabled" : ""}`}
              onClick={() => toggle(opt.value)}
              disabled={disabled}
              title={disabled ? `მაქსიმუმ ${maxItems} კატეგორია` : opt.label}
            >
              {active && (
                <span className="category-chip__check" aria-hidden="true">
                  <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}
              {opt.label}
              {active && (
                <span className="category-chip__remove" aria-label="წაშლა">×</span>
              )}
            </button>
          );
        })}
      </div>

      {error && <span className="error-text">{t(error)}</span>}
    </div>
  );
}
