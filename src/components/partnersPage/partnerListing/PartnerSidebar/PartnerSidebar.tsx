import { PartnerSidebarProps } from "@/lib/types/partnerTypes";
import { Icons } from "../constants";
import PartnerSearch from "./PartnerSearch/PartnerSearch";
import PartnerFilters from "./PartnerFilters/PartnerFilters";
import "./partnerSidebar.scss";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";

export default function PartnerSidebar({
  filters,
  isOpen,
  activeCount,
  onSearchChange,
  onCategoryChange,
  onCityChange,
  onRatingChange,
  onClearAll,
  onClose,
}: PartnerSidebarProps) {
  const { t: tCommon } = useClientTranslation("common");

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
            {Icons.filter}
            {tCommon("filter")}
            {activeCount > 0 && (
              <span className="ps__badge">{activeCount}</span>
            )}
          </h2>

          <div className="ps__header-actions">
            {activeCount > 0 && (
              <button className="ps__clear" onClick={onClearAll}>
                გასუფთავება
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
          category={filters.category}
          city={filters.city}
          minRating={filters.minRating}
          onCategoryChange={onCategoryChange}
          onCityChange={onCityChange}
          onRatingChange={onRatingChange}
        />
      </aside>
    </>
  );
}
