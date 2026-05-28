"use client";

import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import "./freeShippingBar.scss";

interface Props {
  subtotal: number;
  threshold: number;
}

const TruckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M3 7h11v10H3zM14 11h4l3 3v3h-7"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <circle cx="7" cy="18" r="1.6" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="17" cy="18" r="1.6" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

export default function FreeShippingBar({ subtotal, threshold }: Props) {
  const { t: tPages } = useClientTranslation("pages");
  const unlocked = subtotal >= threshold;
  const remaining = Math.max(0, threshold - subtotal);
  const pct = Math.min(100, Math.round((subtotal / threshold) * 100));

  return (
    <div
      className={`free-shipping-bar${
        unlocked ? " free-shipping-bar--unlocked" : ""
      }`}
    >
      <div className="free-shipping-bar__line">
        <span className="free-shipping-bar__icon">
          <TruckIcon />
        </span>
        <span className="free-shipping-bar__text">
          {unlocked
            ? tPages("cart.shipping.unlocked") ||
              "უფასო მიწოდება გააქტიურდა"
            : `${tPages("cart.shipping.add_more") || "დაამატე"} ₾${remaining} ${
                tPages("cart.shipping.for_free") || "უფასო მიწოდებისთვის"
              }`}
        </span>
      </div>
      <div
        className="free-shipping-bar__track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
      >
        <span
          className="free-shipping-bar__fill"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
