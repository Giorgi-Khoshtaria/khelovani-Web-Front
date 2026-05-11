"use client";

import Link from "next/link";
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
      <div className="hero__bg" aria-hidden="true">
        <div className="hero__orb hero__orb--1" />
        <div className="hero__orb hero__orb--2" />
        <div className="hero__grid" />
      </div>

      <div className="hero__inner">
        {/* ── Left column ── */}
        <div className="hero__copy">
          <p className="hero__eyebrow">
            <span className="hero__eyebrow-dash">—</span>
            {t("home.eyebrow")}
          </p>

          <h1 className="hero__title">
            <span className="hero__title-regular">khelo</span>
            <span className="hero__title-italic">vani</span>
          </h1>

          <p className="hero__description">{t("home.hero_description")}</p>

          <div className="hero__divider" aria-hidden="true">
            <span />
            <span className="hero__divider-gem" />
            <span />
          </div>

          <div className="hero__actions">
            <Link href="/products" className="hero__btn hero__btn--primary">
              <span>{t("home.discover_collection")}</span>
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
              {t("home.discover_partners")}
            </Link>

            <Link href="/become-partner" className="hero__btn hero__btn--ghost">
              {tNav("become_partner")}
            </Link>
          </div>

          <div className="hero__stats">
            <div className="hero__stat">
              <span className="hero__stat-value">
                {stats.makers > 0 ? formatCompact(stats.makers) : "—"}
              </span>
              <span className="hero__stat-label">{t("home.stats.makers")}</span>
            </div>
            <div className="hero__stat-sep" aria-hidden="true" />
            <div className="hero__stat">
              <span className="hero__stat-value">
                {stats.pieces > 0 ? formatCompact(stats.pieces) : "—"}
              </span>
              <span className="hero__stat-label">{t("home.stats.pieces")}</span>
            </div>
            <div className="hero__stat-sep" aria-hidden="true" />
            <div className="hero__stat">
              <span className="hero__stat-value">
                {formatCompact(stats.regions)}
              </span>
              <span className="hero__stat-label">
                {t("home.stats.regions")}
              </span>
            </div>
          </div>
        </div>

        {/* ── Right column — CSS artwork ── */}
        <div className="hero__art" aria-hidden="true">
          <div className="hero__art-card hero__art-card--main">
            <span className="hero__art-caption">
              [ Hero image — artisan at work ]
            </span>
          </div>
          <div className="hero__art-card hero__art-card--detail">
            <span className="hero__art-caption">[ Detail — 200×260 ]</span>
          </div>
        </div>
      </div>

      <div className="hero__scroll" aria-hidden="true">
        <div className="hero__scroll-track">
          <div className="hero__scroll-thumb" />
        </div>
      </div>
    </section>
  );
}

export default MainPageHero;
