"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import "./partnerAbout.scss";

interface Props {
  description?: string;
}

/** "About the workshop" card — splits the description into paragraphs. */
export default function PartnerAbout({ description }: Props) {
  const { lang } = useLanguage();
  const isGe = lang === "ge";

  const paragraphs = (description || "")
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <section className="partner-about">
      <span className="partner-about__eyebrow">
        {isGe ? "სახელოსნოს შესახებ" : "The workshop"}
      </span>
      <div className="partner-about__body">
        {paragraphs.length ? (
          paragraphs.map((p, i) => <p key={i}>{p}</p>)
        ) : (
          <p className="partner-about__empty">
            {isGe ? "აღწერა არ არის დამატებული." : "No description available."}
          </p>
        )}
      </div>
    </section>
  );
}
