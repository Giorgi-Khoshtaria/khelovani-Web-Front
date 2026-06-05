"use client";

import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import "./partnerAbout.scss";

interface Props {
  description?: string;
}

/** "About the workshop" card — splits the description into paragraphs. */
export default function PartnerAbout({ description }: Props) {
  const { t: tPages } = useClientTranslation("pages");
  const { lang } = useLanguage();
  const isGe = lang === "ge";

  const paragraphs = (description || "")
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <section className="partner-about">
      <h2 className="partner-about__title">
        {tPages("partner_profile.about_workshop") ||
          (isGe ? "სახელოსნოს შესახებ" : "About the workshop")}
      </h2>
      <div className="partner-about__body">
        {paragraphs.length ? (
          paragraphs.map((p, i) => <p key={i}>{p}</p>)
        ) : (
          <p className="partner-about__empty">
            {tPages("partner_profile.no_description") ||
              (isGe ? "აღწერა არ არის დამატებული." : "No description available.")}
          </p>
        )}
      </div>
    </section>
  );
}
