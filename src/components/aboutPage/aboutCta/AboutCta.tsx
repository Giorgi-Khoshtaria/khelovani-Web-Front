"use client";

import Link from "next/link";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import "./aboutCta.scss";

export default function AboutCta() {
  const { t } = useClientTranslation("pages");
  const { t: tNav } = useClientTranslation("navigation");

  return (
    <section className="about-cta">
      <div className="about-cta__inner">
        <h2 className="about-cta__title">{t("about.cta_title")}</h2>
        <p className="about-cta__subtitle">{t("about.cta_subtitle")}</p>

        <div className="about-cta__actions">
          <Link href="/products" className="about-cta__btn about-cta__btn--primary">
            <span>{t("home.discover_collection")}</span>
            <svg
              className="about-cta__btn-icon"
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

          <Link href="/partners" className="about-cta__btn about-cta__btn--ghost">
            {t("about.cta_meet_makers")}
          </Link>

          <Link href="/become-partner" className="about-cta__btn about-cta__btn--text">
            {tNav("become_partner")}
          </Link>
        </div>
      </div>
    </section>
  );
}
