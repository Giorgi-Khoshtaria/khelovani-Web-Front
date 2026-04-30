import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import { CITIES, Icons } from "../../constants";
import "./partnerFilters.scss";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCategories } from "@/contexts/CategoriesContext";

const STAR_RATINGS = [5, 4, 3, 2, 1] as const;

interface PartnerFiltersProps {
  category: string;
  city: string;
  minRating: number;
  onCategoryChange: (cat: string) => void;
  onCityChange: (city: string) => void;
  onRatingChange: (r: number) => void;
}

export default function PartnerFilters({
  category,
  city,
  minRating,
  onCategoryChange,
  onCityChange,
  onRatingChange,
}: PartnerFiltersProps) {
  const { t: tInputs } = useClientTranslation("inputs");
  const { t: tCommon } = useClientTranslation("common");
  const { lang } = useLanguage();
  const { categories, getLabel } = useCategories();
  return (
    <div className="partner-filters">
      {/* ── Category ── */}
      <div className="partner-filters__group">
        <span className="partner-filters__label">{tInputs("category")}</span>
        <div className="partner-filters__chips">
          {categories.map((cat) => (
            <button
              key={cat.slug}
              className={`partner-filters__chip${
                category === cat.slug ? " partner-filters__chip--active" : ""
              }`}
              onClick={() => onCategoryChange(category === cat.slug ? "" : cat.slug)}
            >
              {getLabel(cat.slug, lang as "ge" | "en")}
            </button>
          ))}
        </div>
      </div>

      {/* ── City ── */}
      <div className="partner-filters__group">
        <span className="partner-filters__label">
          <span className="partner-filters__label-icon">{Icons.location}</span>
          {tCommon("location")}
        </span>
        <div className="partner-filters__select-wrap">
          <select
            className="partner-filters__select"
            value={city}
            onChange={(e) => onCityChange(e.target.value)}
            aria-label="Filter by city"
          >
            <option value="">{tCommon("all_cities")}</option>
            {CITIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.labelGe}
              </option>
            ))}
          </select>
          <span className="partner-filters__select-arrow" aria-hidden="true">
            {Icons.chevronDown}
          </span>
        </div>
      </div>

      {/* ── Rating ── */}
      <div className="partner-filters__group">
        <span className="partner-filters__label">
          {tCommon("minimum_rating")}
        </span>
        <div className="partner-filters__ratings">
          {STAR_RATINGS.map((r) => (
            <button
              key={r}
              className={`partner-filters__rating${
                minRating === r ? " partner-filters__rating--active" : ""
              }`}
              onClick={() => onRatingChange(minRating === r ? 0 : r)}
            >
              <span className="partner-filters__stars">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span
                    key={s}
                    className={`partner-filters__star${
                      s <= r ? " partner-filters__star--on" : ""
                    }`}
                  >
                    ★
                  </span>
                ))}
              </span>
              <span className="partner-filters__rating-label">{r}+</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
