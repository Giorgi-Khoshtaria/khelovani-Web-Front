"use client";

import "./summaryAction.scss";

interface Props {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  /** Spread layout with a trailing arrow (cart step). Otherwise centred. */
  spread?: boolean;
}

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <rect x="4" y="10" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="1.8" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Primary checkout CTA (secure checkout / continue / pay). */
export default function SummaryAction({
  label,
  onClick,
  disabled = false,
  spread = false,
}: Props) {
  return (
    <button
      type="button"
      className={`summary-action${spread ? " summary-action--spread" : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      <LockIcon />
      <span>{label}</span>
      {spread && <ArrowIcon />}
    </button>
  );
}
