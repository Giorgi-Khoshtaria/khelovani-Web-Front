import { CATEGORIES, CITIES, Icons } from "../../constants";
import "./partnerFilters.scss";

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
  return (
    <div className="partner-filters">
      {/* ── Category ── */}
      <div className="partner-filters__group">
        <span className="partner-filters__label">კატეგორია</span>
        <div className="partner-filters__chips">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              className={`partner-filters__chip${
                category === cat.value ? " partner-filters__chip--active" : ""
              }`}
              onClick={() =>
                onCategoryChange(category === cat.value ? "" : cat.value)
              }
            >
              {cat.labelGe}
            </button>
          ))}
        </div>
      </div>

      {/* ── City ── */}
      <div className="partner-filters__group">
        <span className="partner-filters__label">
          <span className="partner-filters__label-icon">{Icons.location}</span>
          მდებარეობა
        </span>
        <div className="partner-filters__select-wrap">
          <select
            className="partner-filters__select"
            value={city}
            onChange={(e) => onCityChange(e.target.value)}
            aria-label="Filter by city"
          >
            <option value="">ყველა ქალაქი</option>
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
        <span className="partner-filters__label">მინიმალური რეიტინგი</span>
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
