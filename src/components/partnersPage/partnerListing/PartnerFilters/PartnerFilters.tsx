"use client";

import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import { PartnerFilterState, PartnerType } from "@/lib/types/partnerTypes";
import { FilterDrawer, FilterSearch } from "@/components/ui/FilterDrawer";
import PartnerTypeSection from "./sections/PartnerTypeSection";
import PartnerRegionSection from "./sections/PartnerRegionSection";
import PartnerRatingSection from "./sections/PartnerRatingSection";

interface Props {
  isOpen: boolean;
  filters: PartnerFilterState;
  onClose: () => void;
  onSearchChange: (v: string) => void;
  onCityChange: (city: string) => void;
  onRatingChange: (r: number) => void;
  onPartnerTypeChange: (type: PartnerType | "") => void;
  onClearAll: () => void;
}

export default function PartnerFilters({
  isOpen,
  filters,
  onClose,
  onSearchChange,
  onCityChange,
  onRatingChange,
  onPartnerTypeChange,
  onClearAll,
}: Props) {
  const { t: tCommon } = useClientTranslation("common");
  const { t: tInputs } = useClientTranslation("inputs");
  const { lang } = useLanguage();
  const isGe = lang === "ge";

  const labels = {
    refineEyebrow: tCommon("partner_listing.refine") || (isGe ? "დახვეწა" : "Refine"),
    filtersTitle: isGe ? "ფილტრები" : "Filters",
    searchPlaceholder:
      tInputs("partner_listing.search_placeholder") ||
      (isGe ? "მოძებნე პარტნიორი..." : "Search partners..."),
    clearAll: tCommon("clear_all_filter") || (isGe ? "ფილტრების გასუფთავება" : "Clear all"),
  };

  return (
    <FilterDrawer
      isOpen={isOpen}
      eyebrow={labels.refineEyebrow}
      title={labels.filtersTitle}
      clearLabel={labels.clearAll}
      onClose={onClose}
      onClearAll={onClearAll}
      search={
        <FilterSearch
          value={filters.search}
          placeholder={labels.searchPlaceholder}
          onChange={onSearchChange}
        />
      }
    >
      <PartnerTypeSection value={filters.partnerType} onChange={onPartnerTypeChange} />
      <PartnerRegionSection value={filters.city} onChange={onCityChange} />
      <PartnerRatingSection value={filters.minRating} onChange={onRatingChange} />
    </FilterDrawer>
  );
}
