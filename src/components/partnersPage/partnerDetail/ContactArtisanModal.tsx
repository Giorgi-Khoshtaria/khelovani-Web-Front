"use client";

import { useEffect } from "react";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import { useContactArtisan } from "./useContactArtisan";
import "./contactArtisanModal.scss";

interface Props {
  partnerId: string;
  name: string;
  initials: string;
  email?: string;
  phone?: string;
  onClose: () => void;
}

const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.7" />
    <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M6.5 4h3l1.5 4-2 1.5a11 11 0 0 0 5.5 5.5l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4.5 6a2 2 0 0 1 2-2Z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
  </svg>
);

const CloseIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export default function ContactArtisanModal({
  partnerId,
  name,
  initials,
  email,
  phone,
  onClose,
}: Props) {
  const { t: tPages } = useClientTranslation("pages");
  const { t: tCommon } = useClientTranslation("common");
  const { t: tErr } = useClientTranslation("validation");
  const { lang } = useLanguage();
  const isGe = lang === "ge";

  const c = useContactArtisan({ partnerId, onClose });

  // Close on Escape + lock background scroll while the modal is open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    <div
      className="contact-modal__overlay"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="contact-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`${tPages("partner_profile.contact_btn") || "Contact"} — ${name}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="contact-modal__header">
          <div className="contact-modal__avatar" aria-hidden="true">
            {initials}
          </div>
          <div className="contact-modal__heading">
            <span className="contact-modal__eyebrow">
              {tPages("partner_profile.contact_btn") ||
                (isGe ? "დაკავშირება" : "Contact")}
            </span>
            <h3 className="contact-modal__title">{name}</h3>
          </div>
          <button
            type="button"
            className="contact-modal__close"
            onClick={onClose}
            aria-label={tCommon("close") || "Close"}
          >
            <CloseIcon />
          </button>
        </div>

        <div className="contact-modal__body">
          <p className="contact-modal__intro">
            {tPages("partner_profile.contact_intro") ||
              (isGe
                ? "იკითხეთ ინდივიდუალური შეკვეთის, მასალების ან ვადების შესახებ."
                : "Ask about a custom commission, materials, lead times or anything else.")}{" "}
            {name}{" "}
            {tPages("partner_profile.contact_reply_time") ||
              (isGe ? "ჩვეულებრივ პასუხობს დღის განმავლობაში." : "usually replies within a day.")}
          </p>

          <div className="contact-modal__field">
            <label className="contact-modal__label" htmlFor="contact-subject">
              {tPages("partner_profile.contact_subject") || (isGe ? "თემა" : "Subject")}
            </label>
            <input
              id="contact-subject"
              type="text"
              className={`contact-modal__input${c.errors.subject ? " contact-modal__input--error" : ""}`}
              placeholder={
                tPages("partner_profile.contact_subject_ph") ||
                "e.g. Custom dinner set in ash glaze"
              }
              value={c.subject}
              maxLength={120}
              onChange={(e) => c.setSubject(e.target.value)}
              aria-invalid={Boolean(c.errors.subject)}
            />
            {c.errors.subject && (
              <span className="contact-modal__error">{tErr(c.errors.subject)}</span>
            )}
          </div>

          <div className="contact-modal__field">
            <label className="contact-modal__label" htmlFor="contact-message">
              {tPages("partner_profile.contact_message") || (isGe ? "შეტყობინება" : "Message")}
            </label>
            <div className="contact-modal__textarea-wrap">
              <textarea
                id="contact-message"
                className={`contact-modal__textarea${c.errors.message ? " contact-modal__textarea--error" : ""}`}
                placeholder={
                  tPages("partner_profile.contact_message_ph") ||
                  `Hi ${name}, I'd love to commission…`
                }
                value={c.message}
                maxLength={c.maxChars}
                rows={5}
                onChange={(e) => c.setMessage(e.target.value)}
                aria-invalid={Boolean(c.errors.message)}
              />
              <span className="contact-modal__counter">
                {c.charCount}/{c.maxChars}
              </span>
            </div>
            {c.errors.message && (
              <span className="contact-modal__error">{tErr(c.errors.message)}</span>
            )}
          </div>
        </div>

        <div className="contact-modal__contacts">
          {email && (
            <a className="contact-modal__chip" href={`mailto:${email}`}>
              <MailIcon />
              {email}
            </a>
          )}
          {phone && (
            <a className="contact-modal__chip" href={`tel:${phone.replace(/\s+/g, "")}`}>
              <PhoneIcon />
              {phone}
            </a>
          )}
        </div>

        <div className="contact-modal__footer">
          <button
            type="button"
            className="contact-modal__cancel"
            onClick={onClose}
            disabled={c.sending}
          >
            {tCommon("cancel") || (isGe ? "გაუქმება" : "Cancel")}
          </button>
          <button
            type="button"
            className="contact-modal__submit"
            onClick={c.handleSend}
            disabled={!c.canSend || c.sending}
          >
            <MailIcon />
            {c.sending
              ? tPages("partner_profile.contact_sending") || (isGe ? "იგზავნება…" : "Sending…")
              : tPages("partner_profile.contact_send") || (isGe ? "გაგზავნა" : "Send message")}
          </button>
        </div>
      </div>
    </div>
  );
}
