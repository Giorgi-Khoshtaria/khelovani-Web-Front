"use client";

import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import "./aboutHero.scss";

export default function AboutHero() {
  const { t } = useClientTranslation("pages");

  return (
    <section className="about-hero">
      <div className="about-hero__bg" aria-hidden="true" />
      <div className="about-hero__inner">
        <span className="about-hero__eyebrow">{t("about.eyebrow")}</span>
        <h1 className="about-hero__title">
          {t("about.hero_title_a")} <em>{t("about.hero_title_b")}</em>
        </h1>
        <p className="about-hero__description">{t("about.hero_description")}</p>
        <div className="about-hero__mark" aria-hidden="true" />
      </div>
    </section>
  );
}
