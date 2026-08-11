"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import "./policyCta.scss";

export default function PolicyCta() {
  const { t } = useClientTranslation("pages");
  const { lang } = useLanguage();
  const isGe = lang.toLowerCase() === "ge";

  return (
    <section className="policy-cta">
      <div className="policy-cta__inner">
        <h2 className="policy-cta__title">
          {t("policy.cta_title") ||
            (isGe ? "რამე გაუგებარია?" : "Something here unclear?")}
        </h2>
        <p className="policy-cta__subtitle">
          {t("policy.cta_subtitle") ||
            (isGe
              ? "მოგვწერეთ ქართულად ან ინგლისურად — ადამიანი გიპასუხებთ, ჩვეულებრივ იმავე დღეს."
              : "Write to us in Georgian or English and a person will answer — usually the same day.")}
        </p>

        <div className="policy-cta__actions">
          <Link
            href="/contact"
            className="policy-cta__btn policy-cta__btn--primary"
          >
            <span>
              {t("policy.cta_contact") || (isGe ? "დაგვიკავშირდით" : "Contact us")}
            </span>
            <svg
              className="policy-cta__btn-icon"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>

          <Link
            href="/about"
            className="policy-cta__btn policy-cta__btn--ghost"
          >
            {t("policy.cta_about") ||
              (isGe ? "გაიგეთ ჩვენს შესახებ" : "Read about us")}
          </Link>
        </div>
      </div>
    </section>
  );
}
