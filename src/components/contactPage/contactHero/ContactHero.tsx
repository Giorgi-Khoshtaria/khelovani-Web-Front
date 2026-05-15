"use client";

import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import "./contactHero.scss";

export default function ContactHero() {
  const { t } = useClientTranslation("pages");

  return (
    <section className="contact-hero">
      <div className="contact-hero__bg" aria-hidden="true" />
      <div className="contact-hero__inner">
        <span className="contact-hero__eyebrow">{t("contact.eyebrow")}</span>
        <h1 className="contact-hero__title">{t("contact.hero_title")}</h1>
        <p className="contact-hero__description">{t("contact.hero_description")}</p>
      </div>
    </section>
  );
}
