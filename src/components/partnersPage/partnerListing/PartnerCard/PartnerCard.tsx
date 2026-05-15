import { memo } from "react";
import Link from "next/link";
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
    <article
      className="partner-card"
      style={{ animationDelay: `${(index % 6) * 60}ms` }}
    >
      {/* ── Image ── */}
      <div className="partner-card__image">
        {partner.profilePhoto ? (
          <img src={partner.profilePhoto} alt={name} loading="lazy" />
        ) : (
          <div className="partner-card__placeholder" aria-hidden="true">
            {name.charAt(0).toUpperCase()}
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
        <span className="partner-card__avatar" aria-hidden="true">
          {getInitials(name)}
        </span>
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

          <Link
            href={`/partners/${partner._id}`}
            className="partner-card__cta"
          >
            <span>{tNav("view_profile")}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

const PartnerCard = memo(PartnerCardImpl);
export default PartnerCard;
