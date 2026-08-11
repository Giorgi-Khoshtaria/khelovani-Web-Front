"use client";
import "./partnersHero.scss";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import { PartnersHeroProps } from "@/lib/types/partnerTypes";
import Link from "next/link";

function PartnersHero({ stats }: PartnersHeroProps) {
  const { t: tPages } = useClientTranslation("pages");
  const { t: tNav } = useClientTranslation("navigation");

  const { totalMakers, regionCount, craftCount } = stats;

  const titleText = tPages("partnersPage.hero_title");
  const titleWords = titleText.split(" ");
  const lastWord = titleWords.pop() ?? "";
  const titleLead = titleWords.join(" ");

  const description = tPages("partnersPage.hero_description")
    .replace("{makers}", String(totalMakers))
    .replace("{regions}", String(regionCount))
    .replace("{crafts}", String(craftCount));

  const currentYear = new Date().getFullYear();

  return (
    <section className="ph">
      <div className="ph__inner">
        <div className="ph__eyebrow">
          <span className="ph__eyebrow-dash" aria-hidden="true" />
          <span>{tPages("partnersPage.eyebrow")}</span>
          <span className="ph__eyebrow-dot" aria-hidden="true">
            ·
          </span>
          <span>{currentYear}</span>
        </div>

        <h1 className="ph__title">
          {titleLead}
          {titleLead && " "}
          <span className="ph__title-em">{lastWord}</span>
          <span className="ph__title-period">.</span>
        </h1>

        <div className="ph__divider" aria-hidden="true" />

        <div className="ph__row">
          <p className="ph__summary">{description}</p>

          <div className="ph__actions">
            <Link href="/become-partner" className="ph__cta ph__cta--primary">
              <span>{tNav("become_partner")}</span>
              <svg
                className="ph__cta-icon"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
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

            <Link
              href="/become-partner#how-it-works"
              className="ph__cta ph__cta--ghost"
            >
              <span>{tPages("partnersPage.how_partnership_works")}</span>
            </Link>
          </div>
        </div>

        {/* <div className="ph__divider" aria-hidden="true" /> */}

        {/* <div className="ph__stats">
          <div className="ph__stat">
            <span className="ph__stat-value">{totalMakers}</span>
            <span className="ph__stat-label">{tPages("stats.makers")}</span>
          </div>
          <div className="ph__stat">
            <span className="ph__stat-value">{regionCount}</span>
            <span className="ph__stat-label">{tPages("stats.regions")}</span>
          </div>
          <div className="ph__stat">
            <span className="ph__stat-value">{craftCount}</span>
            <span className="ph__stat-label">{tPages("stats.pieces")}</span>
          </div>
        </div> */}
      </div>
    </section>
  );
}

export default PartnersHero;
