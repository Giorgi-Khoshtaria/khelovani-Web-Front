import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import { PartnerType, PartnerTypeEnum } from "@/lib/types/partnerTypes";
import { CITIES } from "../../constants";
import "./partnerFilters.scss";

const STAR_RATINGS = [5, 4, 3, 2, 1] as const;

interface PartnerFiltersProps {
  city: string;
  minRating: number;
  partnerType: PartnerType | "";
  onCityChange: (city: string) => void;
  onRatingChange: (r: number) => void;
  onPartnerTypeChange: (type: PartnerType | "") => void;
}

export default function PartnerFilters({
  city,
  minRating,
  partnerType,
  onCityChange,
  onRatingChange,
  onPartnerTypeChange,
}: PartnerFiltersProps) {
  const { t: tCommon } = useClientTranslation("common");
  const { t: tInputs } = useClientTranslation("inputs");
  const { lang } = useLanguage();

  const isGe = lang === "ge";

  return (
    <div className="partner-filters">
      {/* ── Region ── */}
      <div className="partner-filters__group">
        <span className="partner-filters__label">
          {tCommon("location") || (isGe ? "რეგიონი" : "REGION")}
        </span>
        <div className="partner-filters__list">
          <button
            type="button"
            className={`partner-filters__row${city === "" ? " partner-filters__row--active" : ""}`}
            onClick={() => onCityChange("")}
          >
            {tCommon("all_cities") || (isGe ? "ყველა ქალაქი" : "All cities")}
          </button>
          {CITIES.map((c) => (
            <button
              key={c.value}
              type="button"
              className={`partner-filters__row${city === c.value ? " partner-filters__row--active" : ""}`}
              onClick={() => onCityChange(c.value)}
            >
              {isGe ? c.labelGe : c.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* ── Type ── */}
      <div className="partner-filters__group">
        <span className="partner-filters__label">
          {tCommon("type") || (isGe ? "ტიპი" : "TYPE")}
        </span>
        <div className="partner-filters__chips">
          <button
            type="button"
            className={`partner-filters__chip${partnerType === "" ? " partner-filters__chip--active" : ""}`}
            onClick={() => onPartnerTypeChange("")}
          >
            {tCommon("all_partners") ||
              (isGe ? "ყველა პარტნიორი" : "All partners")}
          </button>
          <button
            type="button"
            className={`partner-filters__chip${partnerType === PartnerTypeEnum.ORGANIZATION ? " partner-filters__chip--active" : ""}`}
            onClick={() => onPartnerTypeChange(PartnerTypeEnum.ORGANIZATION)}
          >
            {tInputs("label.partner_type_organization") ||
              (isGe ? "კომპანია" : "Company")}
          </button>
          <button
            type="button"
            className={`partner-filters__chip${partnerType === PartnerTypeEnum.INDIVIDUAL ? " partner-filters__chip--active" : ""}`}
            onClick={() => onPartnerTypeChange(PartnerTypeEnum.INDIVIDUAL)}
          >
            {tInputs("label.partner_type_individual") ||
              (isGe ? "ბრენდი" : "Brand")}
          </button>
        </div>
      </div>

      {/* ── Rating ── */}
      <div className="partner-filters__group">
        <span className="partner-filters__label">
          {tCommon("minimum_rating") || (isGe ? "რეიტინგი" : "RATING")}
        </span>
        <div className="partner-filters__list">
          <button
            type="button"
            className={`partner-filters__row${minRating === 0 ? " partner-filters__row--active" : ""}`}
            onClick={() => onRatingChange(0)}
          >
            {tCommon("any_rating") ||
              (isGe ? "ნებისმიერი რეიტინგი" : "Any rating")}
          </button>
          {STAR_RATINGS.map((r) => (
            <button
              key={r}
              type="button"
              className={`partner-filters__row partner-filters__row--rating${
                minRating === r ? " partner-filters__row--active" : ""
              }`}
              onClick={() => onRatingChange(minRating === r ? 0 : r)}
            >
              <span className="partner-filters__stars" aria-hidden="true">
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
              <span className="partner-filters__rating-label">
                {r} {isGe ? "და მეტი" : "& up"}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
