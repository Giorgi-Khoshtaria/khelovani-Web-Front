"use client";

import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import "./backToShipping.scss";

interface Props {
  onClick: () => void;
}

const ArrowLeftIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M19 12H5m6 6-6-6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Pill link back to the shipping step. */
export default function BackToShipping({ onClick }: Props) {
  const { t: tPages } = useClientTranslation("pages");

  return (
    <button type="button" className="back-to-shipping" onClick={onClick}>
      <ArrowLeftIcon />
      {tPages("payment.back_to_shipping") || "მიწოდებაზე დაბრუნება"}
    </button>
  );
}
