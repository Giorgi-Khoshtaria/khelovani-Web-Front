"use client";

import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import {
  type CardBrand,
  type CardErrors,
  cvcLengthForBrand,
} from "@/lib/validations/cardValidations";
import CardPreview from "./CardPreview";
import "./cardDetailsForm.scss";

interface Props {
  number: string;
  holder: string;
  expiry: string;
  cvc: string;
  brand: CardBrand;
  saveCard: boolean;
  errors: CardErrors;
  onNumberChange: (value: string) => void;
  onHolderChange: (value: string) => void;
  onExpiryChange: (value: string) => void;
  onCvcChange: (value: string) => void;
  onSaveCardChange: (value: boolean) => void;
}

const LockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <rect x="4" y="10" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="1.8" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function CardDetailsForm({
  number,
  holder,
  expiry,
  cvc,
  brand,
  saveCard,
  errors,
  onNumberChange,
  onHolderChange,
  onExpiryChange,
  onCvcChange,
  onSaveCardChange,
}: Props) {
  const { t: tPages } = useClientTranslation("pages");
  const { t: tInputs } = useClientTranslation("inputs");
  const { t: tErr } = useClientTranslation("validation");

  return (
    <section className="card-form">
      <div className="card-form__head">
        <span className="card-form__step">01</span>
        <div className="card-form__head-text">
          <h2 className="card-form__title">
            {tPages("payment.card.title") || "ბარათის დეტალები"}
          </h2>
          <p className="card-form__subtitle">
            {tPages("payment.card.subtitle") ||
              "შეიყვანეთ მონაცემები ზუსტად ისე, როგორც ბარათზეა."}
          </p>
        </div>
        <span className="card-form__secure">
          <LockIcon />
          {tPages("payment.secure") || "დაცული"}
        </span>
      </div>

      <CardPreview number={number} holder={holder} expiry={expiry} brand={brand} />

      <div className="card-form__fields">
        <div className="card-form__field card-form__field--full">
          <label className="card-form__label" htmlFor="card-number">
            {tInputs("label.card_number") || "ბარათის ნომერი"}{" "}
            <span aria-hidden="true">*</span>
          </label>
          <input
            id="card-number"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            maxLength={23}
            placeholder="1234 5678 9012 3456"
            className={`card-form__input${errors.number ? " card-form__input--error" : ""}`}
            value={number}
            onChange={(e) => onNumberChange(e.target.value)}
            aria-invalid={Boolean(errors.number)}
          />
          {errors.number && (
            <span className="card-form__error">{tErr(errors.number)}</span>
          )}
        </div>

        <div className="card-form__field card-form__field--full">
          <label className="card-form__label" htmlFor="card-holder">
            {tInputs("label.card_holder") || "მფლობელის სახელი"}{" "}
            <span aria-hidden="true">*</span>
          </label>
          <input
            id="card-holder"
            type="text"
            autoComplete="off"
            maxLength={60}
            placeholder={tInputs("placeholder.card_holder") || "Giorgi Khoshtaria"}
            className={`card-form__input${errors.holder ? " card-form__input--error" : ""}`}
            value={holder}
            onChange={(e) => onHolderChange(e.target.value)}
            aria-invalid={Boolean(errors.holder)}
          />
          {errors.holder && (
            <span className="card-form__error">{tErr(errors.holder)}</span>
          )}
        </div>

        <div className="card-form__field">
          <label className="card-form__label" htmlFor="card-expiry">
            {tInputs("label.card_expiry") || "მოქმედების ვადა"}{" "}
            <span aria-hidden="true">*</span>
          </label>
          <input
            id="card-expiry"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            maxLength={5}
            placeholder="MM/YY"
            className={`card-form__input${errors.expiry ? " card-form__input--error" : ""}`}
            value={expiry}
            onChange={(e) => onExpiryChange(e.target.value)}
            aria-invalid={Boolean(errors.expiry)}
          />
          {errors.expiry && (
            <span className="card-form__error">{tErr(errors.expiry)}</span>
          )}
        </div>

        <div className="card-form__field">
          <label className="card-form__label" htmlFor="card-cvc">
            {tInputs("label.card_cvc") || "CVC / CVV"}{" "}
            <span aria-hidden="true">*</span>
          </label>
          <input
            id="card-cvc"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            maxLength={cvcLengthForBrand(brand)}
            placeholder={brand === "amex" ? "1234" : "123"}
            className={`card-form__input${errors.cvc ? " card-form__input--error" : ""}`}
            value={cvc}
            onChange={(e) => onCvcChange(e.target.value)}
            aria-invalid={Boolean(errors.cvc)}
          />
          {errors.cvc && (
            <span className="card-form__error">{tErr(errors.cvc)}</span>
          )}
        </div>
      </div>

      <label className="card-form__save">
        <input
          type="checkbox"
          checked={saveCard}
          onChange={(e) => onSaveCardChange(e.target.checked)}
        />
        <span className="card-form__save-box" aria-hidden="true">
          {saveCard && <CheckIcon />}
        </span>
        <span className="card-form__save-label">
          {tPages("payment.save_card") ||
            "შეინახე ბარათი შემდეგი გადახდისთვის"}
        </span>
      </label>
    </section>
  );
}
