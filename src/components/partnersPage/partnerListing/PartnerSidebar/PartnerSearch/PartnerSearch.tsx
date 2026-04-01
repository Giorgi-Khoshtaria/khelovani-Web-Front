import { Icons } from "../../constants";
import "./partnerSearch.scss";

interface PartnerSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function PartnerSearch({ value, onChange }: PartnerSearchProps) {
  return (
    <div className="partner-search">
      <label className="partner-search__label">ძიება</label>
      <div className="partner-search__wrap">
        <span className="partner-search__icon" aria-hidden="true">
          {Icons.search}
        </span>
        <input
          className="partner-search__input"
          type="text"
          placeholder="მოძებნეთ პარტნიორი..."
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
