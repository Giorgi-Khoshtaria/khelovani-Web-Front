"use client";

import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import "./paymentMethods.scss";

const METHODS = ["Visa", "Mastercard", "American Express"] as const;
export default function PaymentMethods() {
  const { t: tPages } = useClientTranslation("pages");
  return (
    <div className="payment-methods">
      <span className="payment-methods__label">
        {tPages("cart.we_accept") || "ვიღებთ"}
      </span>
      <ul className="payment-methods__list">
        {METHODS.map((m) => (
          <li key={m} className="payment-methods__chip">
            {m}
          </li>
        ))}
      </ul>
    </div>
  );
}
