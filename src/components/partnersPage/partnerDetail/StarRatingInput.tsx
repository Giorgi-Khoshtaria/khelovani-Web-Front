"use client";

import { useState } from "react";
import { Icon } from "@/lib/icons/icons";
import type { StarRatingInputProps } from "@/lib/types/reviewTypes";
import "./starRatingInput.scss";

const STARS = [1, 2, 3, 4, 5];

/**
 * Interactive 1–5 star picker. Exposed as a radiogroup so it is reachable by
 * keyboard: arrows move between stars, Enter/Space picks the focused one.
 */
export default function StarRatingInput({
  value,
  onChange,
  disabled = false,
  label,
}: StarRatingInputProps) {
  const [hovered, setHovered] = useState(0);
  const shown = hovered || value;

  const move = (delta: number) => {
    const next = Math.min(5, Math.max(1, (value || 0) + delta));
    onChange(next);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      move(1);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      move(-1);
    }
  };

  return (
    <div
      className="star-input"
      role="radiogroup"
      aria-label={label}
      onKeyDown={onKeyDown}
      onMouseLeave={() => setHovered(0)}
    >
      {STARS.map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={String(star)}
          // Only the selected star (or the first, when nothing is picked yet)
          // stays in the tab order — arrows do the rest.
          tabIndex={value === star || (!value && star === 1) ? 0 : -1}
          className={`star-input__star${star <= shown ? " star-input__star--on" : ""}`}
          disabled={disabled}
          onMouseEnter={() => setHovered(star)}
          onClick={() => onChange(star)}
        >
          {star <= shown ? Icon.starFilled : Icon.star}
        </button>
      ))}
    </div>
  );
}
