import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import { Icons } from "../../constants";
import "./partnerSearch.scss";

interface PartnerSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function PartnerSearch({ value, onChange }: PartnerSearchProps) {
  const { t } = useClientTranslation("inputs");
  return (
    <div className="partner-search">
      <label className="partner-search__label">{t("search")}</label>
      <div className="partner-search__wrap">
        <span className="partner-search__icon" aria-hidden="true">
          {Icons.search}
        </span>
        <input
          className="partner-search__input"
          type="text"
          placeholder={t("partner_listing.search_placeholder")}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Search partners"
        />
        {value && (
          <button
            className="partner-search__clear"
            onClick={() => onChange("")}
            aria-label="Clear search"
          >
            {Icons.close}
          </button>
        )}
      </div>
    </div>
  );
}
