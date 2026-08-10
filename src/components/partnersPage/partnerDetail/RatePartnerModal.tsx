"use client";

import { useEffect } from "react";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import { Icon } from "@/lib/icons/icons";
import type { RatePartnerModalProps } from "@/lib/types/reviewTypes";
import StarRatingInput from "./StarRatingInput";
import { useRatePartner } from "@/lib/hooks/useRatePartner";
import "./ratePartnerModal.scss";

const CloseIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export default function RatePartnerModal({
  partnerId,
  name,
  initials,
  initialReview = null,
  onClose,
  onSaved,
}: RatePartnerModalProps) {
  const { t: tPages } = useClientTranslation("pages");
  const { t: tCommon } = useClientTranslation("common");
  const { t: tErr } = useClientTranslation("validation");
  const { lang } = useLanguage();
  const isGe = lang === "ge";

  const r = useRatePartner({ partnerId, initialReview, onClose, onSaved });

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

  const title = tPages("partner_profile.rate_title") ||
    (isGe ? "შეაფასეთ ხელოვანი" : "Rate this artisan");

  return (
    <div className="rate-modal__overlay" role="presentation" onClick={onClose}>
      <div
        className="rate-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`${title} — ${name}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="rate-modal__header">
          <div className="rate-modal__avatar" aria-hidden="true">
            {initials}
          </div>
          <div className="rate-modal__heading">
            <span className="rate-modal__eyebrow">{title}</span>
            <h3 className="rate-modal__title">{name}</h3>
          </div>
          <button
            type="button"
            className="rate-modal__close"
            onClick={onClose}
            aria-label={tCommon("close") || "Close"}
          >
            <CloseIcon />
          </button>
        </div>

        <div className="rate-modal__body">
          <p className="rate-modal__intro">
            {tPages("partner_profile.rate_intro") ||
              (isGe
                ? "გაუზიარეთ სხვებს თქვენი გამოცდილება"
                : "Share your experience with others")}
          </p>

          {r.isEditing && (
            <p className="rate-modal__hint">
              {tPages("partner_profile.rate_edit_hint") ||
                (isGe
                  ? "თქვენ უკვე შეაფასეთ — ცვლილება ჩაანაცვლებს წინა შეფასებას"
                  : "You already rated — saving replaces your previous review")}
            </p>
          )}

          <div className="rate-modal__field">
            <span className="rate-modal__label">
              {tPages("partner_profile.rate_stars_label") ||
                (isGe ? "თქვენი შეფასება" : "Your rating")}
            </span>
            <StarRatingInput
              value={r.rating}
              onChange={r.setRating}
              disabled={r.saving}
              label={
                tPages("partner_profile.rate_stars_label") ||
                (isGe ? "თქვენი შეფასება" : "Your rating")
              }
            />
            {r.errors.rating && (
              <span className="rate-modal__error">{tErr(r.errors.rating)}</span>
            )}
          </div>

          <div className="rate-modal__field">
            <label className="rate-modal__label" htmlFor="review-comment">
              {tPages("partner_profile.rate_comment_label") ||
                (isGe ? "კომენტარი" : "Comment")}
            </label>
            <div className="rate-modal__textarea-wrap">
              <textarea
                id="review-comment"
                className={`rate-modal__textarea${r.errors.comment ? " rate-modal__textarea--error" : ""}`}
                placeholder={
                  tPages("partner_profile.rate_comment_ph") ||
                  (isGe
                    ? "რა მოგეწონათ? რას გაუზიარებდით სხვებს?"
                    : "What did you like? What would you tell others?")
                }
                value={r.comment}
                maxLength={r.maxChars}
                rows={5}
                onChange={(e) => r.setComment(e.target.value)}
                aria-invalid={Boolean(r.errors.comment)}
              />
              <span className="rate-modal__counter">
                {r.charCount}/{r.maxChars}
              </span>
            </div>
            {r.errors.comment && (
              <span className="rate-modal__error">{tErr(r.errors.comment)}</span>
            )}
          </div>
        </div>

        <div className="rate-modal__footer">
          <button
            type="button"
            className="rate-modal__cancel"
            onClick={onClose}
            disabled={r.saving}
          >
            {tCommon("cancel") || (isGe ? "გაუქმება" : "Cancel")}
          </button>
          <button
            type="button"
            className="rate-modal__submit"
            onClick={r.handleSubmit}
            disabled={!r.canSubmit || r.saving}
          >
            <span className="rate-modal__submit-icon">{Icon.starFilled}</span>
            {r.saving
              ? tCommon("sending") || (isGe ? "იგზავნება…" : "Saving…")
              : tPages("partner_profile.rate_submit") ||
                (isGe ? "შეფასების გაგზავნა" : "Submit rating")}
          </button>
        </div>
      </div>
    </div>
  );
}
