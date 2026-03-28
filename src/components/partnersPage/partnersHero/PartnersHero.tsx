"use client";
import "./partnersHero.scss";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import Link from "next/link";

function PartnersHero() {
  const { t: tPages } = useClientTranslation("pages");
  const { t: tNav } = useClientTranslation("navigation");

  return (
    <section className="partners-hero">
      <div className="partners-hero__bg-fx">
        <div className="partners-hero__gradient partners-hero__gradient--1"></div>
        <div className="partners-hero__gradient partners-hero__gradient--2"></div>
        <div className="partners-hero__noise"></div>
      </div>

      <div className="partners-hero__wrapper">
        <h1 className="partners-hero__title">
          {tPages("partnersPage.hero_title")}
        </h1>

        <p className="partners-hero__subtitle">
          {tPages("partnersPage.hero_description")}
        </p>

        <div className="partners-hero__actions">
          <Link href="/become-partner" className="partners-hero__btn-primary">
            {tNav("become_partner")}
          </Link>
        </div>
      </div>
    </section>
  );
}

export default PartnersHero;
