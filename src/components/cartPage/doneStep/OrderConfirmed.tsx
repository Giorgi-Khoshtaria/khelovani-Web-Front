"use client";

import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import "./orderConfirmed.scss";

interface Props {
  name: string;
  email: string;
  onTrack: () => void;
}

const CheckIcon = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Terminal "order confirmed" card shown on the final checkout step. */
export default function OrderConfirmed({ name, email, onTrack }: Props) {
  const { t: tPages } = useClientTranslation("pages");
  const { lang } = useLanguage();
  const isGe = lang.toLowerCase() === "ge";

  const firstName = name.trim().split(" ")[0] || name.trim();
  const thankYou = tPages("done.thank_you") || (isGe ? "გმადლობთ" : "Thank you");
  const message =
    tPages("done.message") ||
    (isGe
      ? "თქვენი შეკვეთა დადასტურდა და ხელოსნები ინფორმირებულნი არიან. ქვითარი და თვალთვალის ინფორმაცია გამოგზავნილია მისამართზე"
      : "Your order is confirmed and the makers have been notified. We've sent a receipt and tracking details to");

  return (
    <div className="order-confirmed">
      <span className="order-confirmed__check">
        <CheckIcon />
      </span>

      <span className="order-confirmed__eyebrow">
        {tPages("done.eyebrow") || (isGe ? "შეკვეთა დადასტურდა" : "Order confirmed")}
      </span>

      <h1 className="order-confirmed__title">
        {thankYou}
        {firstName ? `, ${firstName}` : ""}.
      </h1>

      <p className="order-confirmed__message">
        {message} <strong>{email}</strong>.
      </p>

      <button type="button" className="order-confirmed__track" onClick={onTrack}>
        <span>{tPages("done.track_order") || (isGe ? "შეკვეთის თვალთვალი" : "Track your order")}</span>
        <ArrowIcon />
      </button>
    </div>
  );
}
