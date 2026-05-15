"use client";

import Link from "next/link";
import Image from "next/image";
import "./mainPageHero.scss";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import type { PublicStats } from "@/apiCalls/common.req";

function formatCompact(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
  return String(n);
}

interface MainPageHeroProps {
  stats: PublicStats;
}

function MainPageHero({ stats }: MainPageHeroProps) {
  const { t } = useClientTranslation("pages");
  const { t: tNav } = useClientTranslation("navigation");

  return (
    <section className="hero">
      {/* ── Background image ── */}
      <div className="hero__bg" aria-hidden="true">
        <Image
          src="/assets/placeholder/ceramics.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="hero__bg-img"
        />
        <div className="hero__bg-overlay" />
      </div>

      <div className="hero__inner">
        <p className="hero__eyebrow">
          <span className="hero__eyebrow-dash">—</span>
          {t("home.eyebrow")}
        </p>

        <h1 className="hero__title">
          <span className="hero__title-regular">khelo</span>
          <span className="hero__title-italic">vani</span>
        </h1>

        <p className="hero__description">{t("home.hero_description")}</p>

        <div className="hero__actions">
          <Link href="/products" className="hero__btn hero__btn--primary">
            <span>{t("home.discover_collection")}</span>
            <svg
              className="hero__btn-icon"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
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

          <Link href="/partners" className="hero__btn hero__btn--ghost">
            {t("home.discover_partners")}
          </Link>

          <Link href="/become-partner" className="hero__btn hero__btn--text">
            {tNav("become_partner")}
          </Link>
        </div>

        {/* ── Stats row at the bottom of hero ── */}
        <div className="hero__stats" aria-label="Marketplace statistics">
          <div className="hero__stat">
            <span className="hero__stat-value">
              {stats.makers > 0 ? formatCompact(stats.makers) : "—"}
            </span>
            <span className="hero__stat-label">{t("home.stats.makers")}</span>
          </div>
          <div className="hero__stat">
            <span className="hero__stat-value">
              {stats.pieces > 0 ? formatCompact(stats.pieces) : "—"}
            </span>
            <span className="hero__stat-label">{t("home.stats.pieces")}</span>
          </div>
          <div className="hero__stat">
            <span className="hero__stat-value">
              {formatCompact(stats.regions)}
            </span>
            <span className="hero__stat-label">{t("home.stats.regions")}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MainPageHero;
