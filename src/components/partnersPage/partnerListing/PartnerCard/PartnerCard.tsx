import { memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { PartnerCardProps } from "@/lib/types/partnerTypes";
import { Icons } from "../constants";
import { SocialLinks } from "./SocialLinks";
import "./partnerCard.scss";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCategories } from "@/contexts/CategoriesContext";

function getInitials(name: string): string {
  if (!name) return "·";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p.charAt(0).toUpperCase()).join("");
}

function ArrowIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M3.5 10.5 10.5 3.5M5 3.5h5.5V9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PartnerCardImpl({ partner, index = 0 }: PartnerCardProps) {
  const { lang: ctxLang } = useLanguage();
  const activeLang = (ctxLang || "ge") as "ge" | "en";
  const { t: tNav } = useClientTranslation("navigation");
  const { t: tPages } = useClientTranslation("pages");
  const { getLabel } = useCategories();

  const name =
    (activeLang === "ge" ? partner.companyNameGe : partner.companyNameEn) ??
    partner.companyNameGe ??
    "";

  const cityLabel = partner.city
    ? partner.city.charAt(0).toUpperCase() + partner.city.slice(1)
    : null;

  const rating = partner.rating ?? 0;
  const reviewCount = partner.reviewCount ?? 0;

  const firstCategory = partner.categories?.[0];
  const categoryLabel = firstCategory
    ? getLabel(firstCategory, activeLang)
    : null;

  const hasAnySocial =
    !!partner.website ||
    !!partner.facebook ||
    !!partner.instagram ||
    !!partner.tiktok;

  return (
    <Link
      href={`/partners/${partner._id}`}
      className="partner-card"
      style={{ animationDelay: `${(index % 6) * 60}ms` }}
    >
      {/* ── Image ── */}
      <div className="partner-card__image">
        {partner.profilePhoto ? (
          <Image
            src={partner.profilePhoto}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={index < 4}
          />
        ) : (
          <div className="partner-card__placeholder" aria-hidden="true">
            {getInitials(name)}
          </div>
        )}

        {categoryLabel && (
          <span className="partner-card__category" title={categoryLabel}>
            {categoryLabel}
          </span>
        )}
      </div>

      {/* ── Body ── */}
      <div className="partner-card__body">
        <h3 className="partner-card__name" title={name}>
          {name.length > 50 ? name.slice(0, 50) + "…" : name}
        </h3>

        <p className="partner-card__location">
          <span className="partner-card__location-icon">{Icons.location}</span>
          <span className="partner-card__location-text">
            {cityLabel}
            {partner.establishedYear && (
              <>
                <span className="partner-card__location-sep">·</span>
                <span>
                  {tPages("partner_card.since")} {partner.establishedYear}
                </span>
              </>
            )}
          </span>
        </p>

        {hasAnySocial && (
          <SocialLinks
            website={partner.website}
            facebook={partner.facebook}
            instagram={partner.instagram}
            tiktok={partner.tiktok}
          />
        )}

        <div className="partner-card__footer">
          <div className="partner-card__rating">
            <span className="partner-card__stars" aria-hidden="true">
              {[1, 2, 3, 4, 5].map((s) => (
                <span
                  key={s}
                  className={`partner-card__star${
                    s <= Math.round(rating) ? " partner-card__star--on" : ""
                  }`}
                >
                  ★
                </span>
              ))}
            </span>
            <span className="partner-card__rating-value">
              {rating.toFixed(1)}
            </span>
            <span className="partner-card__rating-count">({reviewCount})</span>
          </div>

          <span className="partner-card__cta">
            {tNav("view_profile")}
            <ArrowIcon />
          </span>
        </div>
      </div>
    </Link>
  );
}

const PartnerCard = memo(PartnerCardImpl);
export default PartnerCard;
