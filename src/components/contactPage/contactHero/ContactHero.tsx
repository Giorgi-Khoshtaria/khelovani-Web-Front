"use client";

import React from "react";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import "./contactHero.scss";

export default function ContactHero() {
  const { t } = useClientTranslation("pages");

  return (
    <section className="contact-hero">
      <div className="contact-hero__bg" />
      <div className="contact-hero__inner">
        <h1 className="contact-hero__title">{t("contact.hero_title")}</h1>
        <p className="contact-hero__description">{t("contact.hero_description")}</p>
      </div>
    </section>
  );
}
