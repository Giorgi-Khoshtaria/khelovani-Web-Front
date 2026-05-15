"use client";

import { useState } from "react";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import { PartnerListingProps } from "@/lib/types/partnerTypes";
import { usePartners } from "@/lib/hooks/usePartners";
import { Icons } from "./constants";
import PartnerCard from "./PartnerCard/PartnerCard";
import PartnerSidebar from "./PartnerSidebar/PartnerSidebar";
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

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ── Render ───────────────────────────────────────────────────

  return (
    <section className="partner-listing">
      {/* Mobile bar */}
      <div className="partner-listing__mobile-bar">
        <button
          className="partner-listing__filter-btn"
          onClick={() => setSidebarOpen(true)}
        >
          {Icons.filter}
          {tCommon("filter")}
          {activeFiltersCount > 0 && (
            <span className="partner-listing__filter-count">
              {activeFiltersCount}
            </span>
          )}
        </button>
        <span className="partner-listing__count">
          {partners.length} {tCommon("partners")}
        </span>
      </div>

      <div className="partner-listing__layout">
        {/* Sidebar */}
        <PartnerSidebar
          filters={filters}
          isOpen={sidebarOpen}
          activeCount={activeFiltersCount}
          onSearchChange={(v) => updateFilter("search", v)}
          onCityChange={(v) => updateFilter("city", v)}
          onRatingChange={(v) => updateFilter("minRating", v)}
          onPartnerTypeChange={(v) => updateFilter("partnerType", v)}
          onClearAll={clearFilters}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main content */}
        <main className="partner-listing__main">
          {/* Results bar */}
          <div className="partner-listing__results-bar">
            <p className="partner-listing__results-text">
              <strong>{partners.length}</strong>{" "}
              {tPages("partner_listing.makers_of")}{" "}
              <strong>{initialTotalCount || partners.length}</strong>{" "}
              {tPages("partner_listing.makers")}
              {filters.search && (
                <>
                  {" "}
                  — &ldquo;<strong>{filters.search}</strong>&rdquo;
                </>
              )}
            </p>
            {activeFiltersCount > 0 && (
              <button
                className="partner-listing__clear-all"
                onClick={clearFilters}
              >
                {tCommon("clear_all_filter")}
              </button>
            )}
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
                  "პარტნიორები არ მოიძებნა"}
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
            prevLabel={tCommon("listing.prev") || "წინა"}
            nextLabel={tCommon("listing.next") || "შემდეგი"}
          />
        </main>
      </div>
    </section>
  );
}
