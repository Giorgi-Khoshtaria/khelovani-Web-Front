import { memo } from "react";
import Link from "next/link";
import { PartnerCardProps } from "@/lib/types/partnerTypes";
import { Icons } from "../constants";
import { SocialLinks } from "./SocialLinks";
import "./partnerCard.scss";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import { useLanguage } from "@/contexts/LanguageContext";

function PartnerCardImpl({ partner, index = 0 }: PartnerCardProps) {
  const { lang: ctxLang } = useLanguage();
  const activeLang = (ctxLang || "ge") as "ge" | "en";
  const name = (activeLang === "ge" ? partner.companyNameGe : partner.companyNameEn) ?? partner.companyNameGe ?? "";
  const address =
    activeLang === "ge" ? partner.address : partner.addressEn || partner.address;

  const cityLabel = partner.city
    ? partner.city.charAt(0).toUpperCase() + partner.city.slice(1)
    : null;
  const { t: tNav } = useClientTranslation("navigation");

  return (
    <article
      className="partner-card"
      style={{ animationDelay: `${(index % 6) * 60}ms` }}
    >
      {/* ── Image / placeholder ── */}
      <div className="partner-card__image">
        {partner.profilePhoto ? (
          <img src={partner.profilePhoto} alt={name} loading="lazy" />
        ) : (
          <div className="partner-card__placeholder" aria-hidden="true">
            {name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div className="partner-card__body">
        <div className="partner-card__header">
          <h3 className="partner-card__name" title={name}>
            {name.length > 50 ? name.slice(0, 50) + "…" : name}
          </h3>
          <div className="partner-card__rating">
            <span className="partner-card__stars">
              {[1, 2, 3, 4, 5].map((s) => (
                <span
                  key={s}
                  className={`partner-card__star${
                    s <= Math.round(partner.rating || 0)
                      ? " partner-card__star--on"
                      : ""
                  }`}
                >
                  ★
                </span>
              ))}
            </span>
            <span className="partner-card__rating-count">
              ({partner.reviewCount || 0})
            </span>
          </div>
        </div>

        {(cityLabel || address) && (
          <p className="partner-card__location">
            <span className="partner-card__location-icon">
              {Icons.location}
            </span>
            <span>
              {cityLabel}
              {cityLabel && address ? ", " : ""}
              {address}
            </span>
          </p>
        )}

        <SocialLinks
          website={partner.website}
          facebook={partner.facebook}
          instagram={partner.instagram}
          tiktok={partner.tiktok}
        />

        <Link href={`/partners/${partner._id}`} className="partner-card__cta">
          <span>{tNav("view_profile")}</span>
          {Icons.arrowRight}
        </Link>
      </div>
    </article>
  );
}

const PartnerCard = memo(PartnerCardImpl);
export default PartnerCard;
