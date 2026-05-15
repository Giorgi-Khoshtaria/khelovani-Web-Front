import { PartnerSidebarProps } from "@/lib/types/partnerTypes";
import { Icons } from "../constants";
import PartnerSearch from "./PartnerSearch/PartnerSearch";
import PartnerFilters from "./PartnerFilters/PartnerFilters";
import "./partnerSidebar.scss";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import { useLanguage } from "@/contexts/LanguageContext";

export default function PartnerSidebar({
  filters,
  isOpen,
  activeCount,
  onSearchChange,
  onCityChange,
  onRatingChange,
  onPartnerTypeChange,
  onClearAll,
  onClose,
}: PartnerSidebarProps) {
  const { t: tCommon } = useClientTranslation("common");
  const { lang } = useLanguage();
  const isGe = lang === "ge";

  return (
    <>
      {isOpen && (
        <div className="ps-overlay" onClick={onClose} aria-hidden="true" />
      )}

      <aside
        className={`ps${isOpen ? " ps--open" : ""}`}
        aria-label="Filter sidebar"
      >
        {/* Header */}
        <div className="ps__header">
          <h2 className="ps__title">
            {tCommon("refine") || (isGe ? "გაფილტრე" : "Refine")}
            {activeCount > 0 && (
              <span className="ps__badge">{activeCount}</span>
            )}
          </h2>

          <div className="ps__header-actions">
            {activeCount > 0 && (
              <button className="ps__clear" onClick={onClearAll}>
                {tCommon("clear_all_filter") ||
                  (isGe ? "გასუფთავება" : "Clear all")}
              </button>
            )}
            <button
              className="ps__close"
              onClick={onClose}
              aria-label="Close filters"
            >
              {Icons.close}
            </button>
          </div>
        </div>

        {/* Divider */}
        <hr className="ps__divider" />

        {/* Search */}
        <PartnerSearch value={filters.search} onChange={onSearchChange} />

        {/* Divider */}
        <hr className="ps__divider" />

        {/* Filters */}
        <PartnerFilters
          city={filters.city}
          minRating={filters.minRating}
          partnerType={filters.partnerType}
          onCityChange={onCityChange}
          onRatingChange={onRatingChange}
          onPartnerTypeChange={onPartnerTypeChange}
        />
      </aside>
    </>
  );
}
