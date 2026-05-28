"use client";

import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import type { ContactErrors } from "@/lib/hooks/useShippingCheckout";
import "./contactInfoSection.scss";

interface Props {
  person: string;
  email: string;
  phone: string;
  errors: ContactErrors;
  onPersonChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
}

export default function ContactInfoSection({
  person,
  email,
  phone,
  errors,
  onPersonChange,
  onEmailChange,
  onPhoneChange,
}: Props) {
  const { t: tPages } = useClientTranslation("pages");
  const { t: tInputs } = useClientTranslation("inputs");
  const { t: tErr } = useClientTranslation("validation");

  return (
    <section className="contact-info">
      <div className="contact-info__head">
        <span className="contact-info__step">01</span>
        <div className="contact-info__head-text">
          <h2 className="contact-info__title">
            {tPages("shipping.contact.title") || "საკონტაქტო ინფორმაცია"}
          </h2>
          <p className="contact-info__subtitle">
            {tPages("shipping.contact.subtitle") ||
              "შეკვეთის სტატუსს გამოგიგზავნით აქ."}
          </p>
        </div>
      </div>

      <div className="contact-info__fields">
        <div className="contact-info__field contact-info__field--full">
          <label className="contact-info__label" htmlFor="contact-person">
            {tInputs("label.contact_person") || "საკონტაქტო პირის სახელი"}{" "}
            <span aria-hidden="true">*</span>
          </label>
          <input
            id="contact-person"
            type="text"
            className={`contact-info__input${
              errors.person ? " contact-info__input--error" : ""
            }`}
            value={person}
            onChange={(e) => onPersonChange(e.target.value)}
            autoComplete="name"
          />
          {errors.person && (
            <span className="contact-info__error">{tErr(errors.person)}</span>
          )}
        </div>

        <div className="contact-info__field">
          <label className="contact-info__label" htmlFor="contact-email">
            {tInputs("label.email") || "ელ. ფოსტა"}{" "}
            <span aria-hidden="true">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            className={`contact-info__input${
              errors.email ? " contact-info__input--error" : ""
            }`}
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            autoComplete="email"
          />
          {errors.email && (
            <span className="contact-info__error">{tErr(errors.email)}</span>
          )}
        </div>

        <div className="contact-info__field">
          <label className="contact-info__label" htmlFor="contact-phone">
            {tInputs("label.phone") || "ტელეფონის ნომერი"}{" "}
            <span aria-hidden="true">*</span>
          </label>
          <input
            id="contact-phone"
            type="tel"
            className={`contact-info__input${
              errors.phone ? " contact-info__input--error" : ""
            }`}
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            autoComplete="tel"
          />
          {errors.phone && (
            <span className="contact-info__error">{tErr(errors.phone)}</span>
          )}
        </div>
      </div>
    </section>
  );
}
