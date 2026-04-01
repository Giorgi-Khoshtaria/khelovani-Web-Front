"use client";

import Link from "next/link";
import "./mainPageHero.scss";
import Image from "next/image";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";

function MainPageHero() {
  const { t: tPages } = useClientTranslation("pages");
  const { t: tNav } = useClientTranslation("navigation");

  return (
    <section className="hero">
      {/* ── Background layer ── */}
      <div className="hero__bg" aria-hidden="true">
        <div className="hero__orb hero__orb--1" />
        <div className="hero__orb hero__orb--2" />
        <div className="hero__orb hero__orb--3" />
        <div className="hero__grid" />
        <div className="hero__noise" />
      </div>

      {/* ── Floating rings decoration ── */}
      <span className="hero__ring hero__ring--1" aria-hidden="true" />
      <span className="hero__ring hero__ring--2" aria-hidden="true" />

      {/* ── Main content ── */}
      <div className="hero__inner">
        <Image
          className="hero__logo"
          src="/assets/logo.png"
          width={200}
          height={200}
          alt="logo"
          priority
        />

        <p className="hero__description">{tPages("home.hero_description")}</p>

        <div className="hero__divider" aria-hidden="true">
          <span />
          <span className="hero__divider-gem" />
          <span />
        </div>

        <div className="hero__actions">
          <Link href="/products" className="hero__btn hero__btn--primary">
            <span>{tPages("home.discover_collection")}</span>
            <svg
              className="hero__btn-icon"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
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

          <Link href="/partners" className="hero__btn hero__btn--secondary">
            {tPages("home.discover_partners")}
          </Link>

          <Link href="/become-partner" className="hero__btn hero__btn--ghost">
            {tNav("become_partner")}
          </Link>
        </div>
      </div>

      {/* ── Scroll hint ── */}
      <div className="hero__scroll" aria-hidden="true">
        <div className="hero__scroll-track">
          <div className="hero__scroll-thumb" />
        </div>
      </div>
    </section>
  );
}

export default MainPageHero;
