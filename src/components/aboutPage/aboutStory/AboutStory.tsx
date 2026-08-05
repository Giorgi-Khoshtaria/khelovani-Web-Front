"use client";

import Image from "next/image";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import "./aboutStory.scss";

export default function AboutStory() {
  const { t } = useClientTranslation("pages");

  return (
    <section className="about-story">
      <div className="about-story__text">
        <span className="about-story__eyebrow">{t("about.story_eyebrow")}</span>
        <h2 className="about-story__title">{t("about.story_title")}</h2>
        <div className="about-story__body">
          <p>{t("about.story_paragraph_1")}</p>
          <p>{t("about.story_paragraph_2")}</p>
        </div>
      </div>

      <div className="about-story__media">
        <Image
          src="/assets/placeholder/ceramics.png"
          alt={t("about.story_image_alt")}
          fill
          className="about-story__img"
          sizes="(max-width: 860px) 100vw, 50vw"
        />
      </div>
    </section>
  );
}
