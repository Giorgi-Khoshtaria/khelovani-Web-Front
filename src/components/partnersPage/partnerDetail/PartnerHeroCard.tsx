"use client";

import { useState } from "react";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCategories } from "@/contexts/CategoriesContext";
import { Icon } from "@/lib/icons/icons";
import type { Partner } from "@/lib/types/partnerTypes";
import type { MyReview, ReviewSummary } from "@/lib/types/reviewTypes";
import PartnerRating from "./PartnerRating";
import PartnerMeta from "./PartnerMeta";
import PartnerSocials from "./PartnerSocials";
import ContactArtisanModal from "./ContactArtisanModal";
import RatePartnerModal from "./RatePartnerModal";
import "./partnerHeroCard.scss";

interface Props {
  partner: Partner;
  partnerId: string;
  name: string;
  city: string;
  address: string;
  productCount: number;
  /** Live aggregate — preferred over the partner doc so it updates on save. */
  reviewSummary?: ReviewSummary;
  /** The visitor's own review, when they already rated this partner. */
  myReview?: MyReview | null;
  onReviewSaved?: () => void;
}

const VerifiedIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 3 5 6v5c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
    <path
      d="m9 12 2 2 4-4"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** The spec panel: identity, credentials grid, contact — bordered, beside the photo. */
export default function PartnerHeroCard({
  partner,
  partnerId,
  name,
  city,
  address,
  productCount,
  reviewSummary,
  myReview = null,
  onReviewSaved,
}: Props) {
  const { t: tPages } = useClientTranslation("pages");
  const { lang } = useLanguage();
  const { getLabel } = useCategories();
  const isGe = lang === "ge";
  const [contactOpen, setContactOpen] = useState(false);
  const [rateOpen, setRateOpen] = useState(false);

  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const firstCategory = partner.categories?.[0];
  const categoryLabel = firstCategory ? getLabel(firstCategory, lang) : null;

  return (
    <div className="partner-hero">
      <div className="partner-hero__head">
        <h1 className="partner-hero__name">{name}</h1>
        {partner.verified && (
          <span className="partner-hero__verified">
            <VerifiedIcon />
            {tPages("partner_profile.verified") ||
              (isGe ? "ვერიფიცირებული" : "Verified")}
          </span>
        )}
      </div>

      <PartnerRating
        rating={reviewSummary?.total ? reviewSummary.average : partner.rating}
        reviewCount={
          reviewSummary?.total ? reviewSummary.total : partner.reviewCount
        }
      />

      <div className="partner-hero__divider" />

      <PartnerMeta
        partner={partner}
        city={city}
        address={address}
        productCount={productCount}
        categoryLabel={categoryLabel}
      />

      <div className="partner-hero__divider" />

      <div className="partner-hero__actions">
        {partner.email && (
          <button
            type="button"
            className="partner-hero__contact"
            onClick={() => setContactOpen(true)}
          >
            {Icon.mail}
            {tPages("partner_profile.contact_btn") ||
              (isGe ? "დაკავშირება" : "Contact artisan")}
          </button>
        )}
        <button
          type="button"
          className="partner-hero__rate"
          onClick={() => setRateOpen(true)}
        >
          {Icon.starFilled}
          {myReview
            ? tPages("partner_profile.rate_edit_btn") ||
              (isGe ? "შეფასების რედაქტირება" : "Edit your rating")
            : tPages("partner_profile.rate_btn") ||
              (isGe ? "შეფასება" : "Rate artisan")}
        </button>
        <PartnerSocials partner={partner} />
      </div>

      {contactOpen && partner.email && (
        <ContactArtisanModal
          partnerId={partnerId}
          name={name}
          initials={initials}
          email={partner.email}
          phone={partner.phone}
          onClose={() => setContactOpen(false)}
        />
      )}

      {rateOpen && (
        <RatePartnerModal
          partnerId={partnerId}
          name={name}
          initials={initials}
          initialReview={myReview}
          onClose={() => setRateOpen(false)}
          onSaved={() => onReviewSaved?.()}
        />
      )}
    </div>
  );
}
