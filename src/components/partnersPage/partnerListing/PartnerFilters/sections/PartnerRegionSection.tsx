"use client";

import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import { FilterSection } from "@/components/ui/FilterDrawer";
import { CITIES } from "../../constants";

interface Props {
  value: string;
  onChange: (city: string) => void;
}

export default function PartnerRegionSection({ value, onChange }: Props) {
  const { t: tCommon } = useClientTranslation("common");
  const { lang } = useLanguage();
  const isGe = lang === "ge";

  const labels = {
    region: tCommon("location") || (isGe ? "რეგიონი" : "Region"),
    allCities: tCommon("all_cities") || (isGe ? "ყველა ქალაქი" : "All cities"),
  };

  return (
    <FilterSection label={labels.region}>
      <ul className="fd-list">
        <li>
          <button
            type="button"
            className={`fd-list__row${value === "" ? " fd-list__row--active" : ""}`}
            onClick={() => onChange("")}
          >
            <span>{labels.allCities}</span>
          </button>
        </li>
        {CITIES.map((c) => (
          <li key={c.value}>
            <button
              type="button"
              className={`fd-list__row${value === c.value ? " fd-list__row--active" : ""}`}
              onClick={() => onChange(c.value)}
            >
              <span>{isGe ? c.labelGe : c.labelEn}</span>
            </button>
          </li>
        ))}
      </ul>
    </FilterSection>
  );
}
