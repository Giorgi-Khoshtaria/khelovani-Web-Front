"use client";
import "./partnersHero.scss";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import Link from "next/link";

function PartnersHero() {
  const { t: tPages } = useClientTranslation("pages");
  const { t: tNav } = useClientTranslation("navigation");

  return (
    <section className="ph">
      {/* ── Background ── */}
      <div className="ph__bg" aria-hidden="true">
        <div className="ph__orb ph__orb--1" />
        <div className="ph__orb ph__orb--2" />
        <div className="ph__grid" />
        <div className="ph__noise" />
      </div>

      {/* ── Decorative side lines ── */}
      <div className="ph__lines ph__lines--left" aria-hidden="true">
        <span /><span /><span />
      </div>
      <div className="ph__lines ph__lines--right" aria-hidden="true">
        <span /><span /><span />
      </div>

      {/* ── Corner accents ── */}
      <span className="ph__corner ph__corner--tl" aria-hidden="true" />
      <span className="ph__corner ph__corner--br" aria-hidden="true" />

      {/* ── Content ── */}
      <div className="ph__inner">
        <div className="ph__badge">
          <span className="ph__badge-dot" />
          <span className="ph__badge-label">Partners</span>
        </div>

        <h1 className="ph__title">
          {tPages("partnersPage.hero_title")}
        </h1>

        <p className="ph__subtitle">
          {tPages("partnersPage.hero_description")}
        </p>

        <Link href="/become-partner" className="ph__cta">
          <span>{tNav("become_partner")}</span>
          <svg
            className="ph__cta-icon"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M3.75 9h10.5M10.5 5.25 14.25 9l-3.75 3.75"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>

      {/* ── Bottom fade ── */}
      <div className="ph__bottom-fade" aria-hidden="true" />
    </section>
  );
}

export default PartnersHero;
