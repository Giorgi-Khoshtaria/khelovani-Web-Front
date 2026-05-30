"use client";

import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import type { CardBrand } from "@/lib/validations/cardValidations";
import "./cardPreview.scss";

interface Props {
  number: string;
  holder: string;
  expiry: string;
  brand: CardBrand;
}

const BRAND_LABEL: Record<CardBrand, string> = {
  visa: "VISA",
  mastercard: "MASTERCARD",
  amex: "AMEX",
  other: "CARD",
};

const NUMBER_PLACEHOLDER = "•••• •••• •••• ••••";

/** Live preview of the card being entered (front face only — never the CVC). */
export default function CardPreview({ number, holder, expiry, brand }: Props) {
  const { t: tPages } = useClientTranslation("pages");

  return (
    <div className={`card-preview card-preview--${brand}`} aria-hidden="true">
      <div className="card-preview__top">
        <span className="card-preview__chip" />
        <span className="card-preview__brand">{BRAND_LABEL[brand]}</span>
      </div>

      <div className="card-preview__number">{number || NUMBER_PLACEHOLDER}</div>

      <div className="card-preview__bottom">
        <div className="card-preview__field">
          <span className="card-preview__label">
            {tPages("payment.card_holder_short") || "CARD HOLDER"}
          </span>
          <span className="card-preview__value">
            {holder.trim().toUpperCase() ||
              tPages("payment.card_holder_placeholder") ||
              "YOUR NAME"}
          </span>
        </div>
        <div className="card-preview__field card-preview__field--exp">
          <span className="card-preview__label">
            {tPages("payment.expires_short") || "EXPIRES"}
          </span>
          <span className="card-preview__value">{expiry || "MM/YY"}</span>
        </div>
      </div>
    </div>
  );
}
