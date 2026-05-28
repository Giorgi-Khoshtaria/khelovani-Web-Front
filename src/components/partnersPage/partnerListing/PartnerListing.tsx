"use client";

import { useEffect, useState } from "react";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import { PartnerListingProps } from "@/lib/types/partnerTypes";
import { usePartners } from "@/lib/hooks/usePartners";
import { Icons } from "./constants";
import PartnerCard from "./PartnerCard/PartnerCard";
import PartnerFilters from "./PartnerFilters/PartnerFilters";
import PartnerPagination from "./PartnerPagination/PartnerPagination";
import Button from "@/components/ui/Button";
import "./partnerListing.scss";

export default function PartnerListing({
  initialPartners = [],
  initialTotalPages = 1,
  initialTotalCount = 0,
}: PartnerListingProps) {
  const { t: tCommon } = useClientTranslation("common");
  const { t: tPages } = useClientTranslation("pages");
  const { lang } = useLanguage();
  const isGe = lang === "ge";

  const {
    partners,
    page,
    totalPages,
    isLoading,
    error,
    filters,
    activeFiltersCount,
    setPage,
    updateFilter,
    clearFilters,
  } = usePartners(initialPartners, initialTotalPages);

  const [drawerOpen, setDrawerOpen] = useState(false);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const filtersLabel = isGe ? "ფილტრები" : "Filters";
  const makersLabel = tPages("partner_listing.makers") || (isGe ? "მწარმოებელი" : "makers");

  return (
    <section className="partner-listing">
      {/* Top row: Filters button + count */}
      <div className="partner-listing__topbar">
        <button
          type="button"
          className="partner-listing__filters-btn"
          onClick={() => setDrawerOpen(true)}
        >
          {Icons.filter}
          <span>{filtersLabel}</span>
          {activeFiltersCount > 0 && (
            <span className="partner-listing__filters-badge">{activeFiltersCount}</span>
          )}
        </button>

        <span className="partner-listing__count">
          <strong>{initialTotalCount || partners.length}</strong> {makersLabel}
        </span>
      </div>

      {/* Grid / States */}
      {isLoading ? (
        <div className="partner-listing__loading">
          <div className="partner-listing__spinner" />
          <span>{tCommon("loading")}</span>
        </div>
      ) : error ? (
        <div className="partner-listing__error">
          <p>{error}</p>
          <Button variant="secondary" size="sm" onClick={clearFilters}>
            {tCommon("try_again")}
          </Button>
        </div>
      ) : partners.length > 0 ? (
        <div className="partner-listing__grid">
          {partners.map((partner, i) => (
            <PartnerCard key={partner._id} partner={partner} index={i} />
          ))}
        </div>
      ) : (
        <div className="partner-listing__empty">
          <div className="partner-listing__empty-icon">{Icons.search}</div>
          <p className="partner-listing__empty-title">
            {tPages("partner_listing.no_partners_found") ||
              (isGe ? "პარტნიორები არ მოიძებნა" : "No partners found")}
          </p>
          {activeFiltersCount > 0 && (
            <Button variant="secondary" size="sm" onClick={clearFilters}>
              {tCommon("clear_all_filter")}
            </Button>
          )}
        </div>
      )}

      {/* Pagination */}
      <PartnerPagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        prevLabel={tCommon("listing.prev") || (isGe ? "წინა" : "Prev")}
        nextLabel={tCommon("listing.next") || (isGe ? "შემდეგი" : "Next")}
      />

      {/* Drawer */}
      <PartnerFilters
        isOpen={drawerOpen}
        filters={filters}
        onClose={() => setDrawerOpen(false)}
        onSearchChange={(v) => updateFilter("search", v)}
        onCityChange={(v) => updateFilter("city", v)}
        onRatingChange={(v) => updateFilter("minRating", v)}
        onPartnerTypeChange={(v) => updateFilter("partnerType", v)}
        onClearAll={clearFilters}
      />
    </section>
  );
}
