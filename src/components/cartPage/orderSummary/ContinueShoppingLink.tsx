"use client";

import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import "./continueShoppingLink.scss";

const ArrowLeftIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M19 12H5m6 6-6-6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** "Continue shopping" back-link shown under the cart-step summary. */
export default function ContinueShoppingLink() {
  const { t: tNav } = useClientTranslation("navigation");

  return (
    <a href="/products" className="continue-shopping">
      <ArrowLeftIcon />
      {tNav("continue_shopping") || "შოპინგის გაგრძელება"}
    </a>
  );
}
