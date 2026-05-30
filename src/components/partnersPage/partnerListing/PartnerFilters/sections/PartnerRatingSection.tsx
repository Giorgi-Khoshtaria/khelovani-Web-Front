"use client";

import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import { FilterSection } from "@/components/ui/FilterDrawer";

interface Props {
  value: number;
  onChange: (rating: number) => void;
}

const STAR_RATINGS = [5, 4, 3, 2, 1] as const;

export default function PartnerRatingSection({ value, onChange }: Props) {
  const { t: tCommon } = useClientTranslation("common");
  const { lang } = useLanguage();
  const isGe = lang === "ge";

  const labels = {
    rating: tCommon("minimum_rating") || (isGe ? "რეიტინგი" : "Rating"),
    anyRating: tCommon("any_rating") || (isGe ? "ნებისმიერი" : "Any rating"),
    andUp: isGe ? "და მეტი" : "& up",
  };

  return (
    <FilterSection label={labels.rating}>
      <ul className="fd-list">
        <li>
          <button
            type="button"
            className={`fd-list__row${value === 0 ? " fd-list__row--active" : ""}`}
            onClick={() => onChange(0)}
          >
            <span>{labels.anyRating}</span>
          </button>
        </li>
        {STAR_RATINGS.map((r) => (
          <li key={r}>
            <button
              type="button"
              className={`fd-list__row${value === r ? " fd-list__row--active" : ""}`}
              onClick={() => onChange(value === r ? 0 : r)}
            >
              <span className="pf-stars" aria-hidden="true">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span
                    key={s}
                    className={`pf-star${s <= r ? " pf-star--on" : ""}`}
                  >
                    ★
                  </span>
                ))}
              </span>
              <span className="pf-rating-label">
                {r} {labels.andUp}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </FilterSection>
  );
}
