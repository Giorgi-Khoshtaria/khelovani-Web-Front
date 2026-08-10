"use client";

import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import { Icon } from "@/lib/icons/icons";
import "./partnerRating.scss";

interface Props {
  rating?: number;
  reviewCount?: number;
}

/** Star rating + numeric score + review count. */
export default function PartnerRating({ rating, reviewCount }: Props) {
  const { t: tPages } = useClientTranslation("pages");
  const { lang } = useLanguage();
  const isGe = lang === "ge";

  if (!rating) return null;
  const rounded = Math.round(rating);

  return (
    <div className="partner-rating">
      <span className="partner-rating__stars" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((s) => (
          <span
            key={s}
            className={`partner-rating__star${s <= rounded ? " partner-rating__star--on" : ""}`}
          >
            {Icon.star}
          </span>
        ))}
      </span>
      <span className="partner-rating__score">
        {rounded}
        <span className="partner-rating__scale">/5</span>
      </span>
      {typeof reviewCount === "number" && (
        <span className="partner-rating__reviews">
          {reviewCount}{" "}
          {tPages("partner_profile.reviews") || (isGe ? "შეფასება" : "reviews")}
        </span>
      )}
    </div>
  );
}
