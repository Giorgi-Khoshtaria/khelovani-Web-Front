"use client";

import Link from "next/link";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import "./aboutValues.scss";

const VALUES = [
  { number: "01", titleKey: "about.value_1_title", bodyKey: "about.value_1_body" },
  { number: "02", titleKey: "about.value_2_title", bodyKey: "about.value_2_body" },
  { number: "03", titleKey: "about.value_3_title", bodyKey: "about.value_3_body" },
] as const;

export default function AboutValues() {
  const { t } = useClientTranslation("pages");
  const { t: tNav } = useClientTranslation("navigation");

  return (
    <section className="about-values">
      <div className="about-values__header">
        <div className="about-values__heading">
          <span className="about-values__eyebrow">{t("about.values_eyebrow")}</span>
          <h2 className="about-values__title">{t("about.values_title")}</h2>
        </div>

        <Link href="/become-partner" className="about-values__cta">
          {tNav("become_partner")}
          <span aria-hidden="true">→</span>
        </Link>
      </div>

      <div className="about-values__grid">
        {VALUES.map((v) => (
          <div key={v.number} className="about-values__card">
            <span className="about-values__number">{v.number}</span>
            <h3 className="about-values__card-title">{t(v.titleKey)}</h3>
            <p className="about-values__card-body">{t(v.bodyKey)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
