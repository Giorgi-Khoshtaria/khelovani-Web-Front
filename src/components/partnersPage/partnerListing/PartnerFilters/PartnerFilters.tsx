"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  PartnerFilterState,
  PartnerType,
  PartnerTypeEnum,
} from "@/lib/types/partnerTypes";
import { CITIES } from "../constants";
import "@/styles/filterDrawer.scss";
import "./partnerFilters.scss";

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

type SectionKey = "city" | "type" | "rating";
const STAR_RATINGS = [5, 4, 3, 2, 1] as const;

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

  const [openSections, setOpenSections] = useState<Record<SectionKey, boolean>>({
    city: true,
    type: true,
    rating: true,
  });
  const toggleSection = (key: SectionKey) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const labels = {
    refineEyebrow: tCommon("partner_listing.refine") || (isGe ? "დახვეწა" : "Refine"),
    filtersTitle: isGe ? "ფილტრები" : "Filters",
    searchPlaceholder:
      tInputs("partner_listing.search_placeholder") ||
      (isGe ? "მოძებნე პარტნიორი..." : "Search partners..."),
    region: tCommon("location") || (isGe ? "რეგიონი" : "Region"),
    allCities: tCommon("all_cities") || (isGe ? "ყველა ქალაქი" : "All cities"),
    type: tCommon("type") || (isGe ? "ტიპი" : "Type"),
    allPartners: tCommon("all_partners") || (isGe ? "ყველა" : "All"),
    company: tInputs("label.partner_type_organization") || (isGe ? "კომპანია" : "Company"),
    brand: tInputs("label.partner_type_individual") || (isGe ? "ბრენდი" : "Brand"),
    rating: tCommon("minimum_rating") || (isGe ? "რეიტინგი" : "Rating"),
    anyRating: tCommon("any_rating") || (isGe ? "ნებისმიერი" : "Any rating"),
    andUp: isGe ? "და მეტი" : "& up",
    clearAll: tCommon("clear_all_filter") || (isGe ? "ფილტრების გასუფთავება" : "Clear all"),
  };

  // Portal — escape any animated/transformed ancestor.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const drawer = (
    <>
      <div
        className={`fd-overlay${isOpen ? " fd-overlay--open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`fd${isOpen ? " fd--open" : ""}`}
        aria-label="Filters"
        aria-hidden={!isOpen}
      >
        {/* Header */}
        <div className="fd__header">
          <div>
            <span className="fd__eyebrow">{labels.refineEyebrow}</span>
            <h2 className="fd__title">{labels.filtersTitle}</h2>
          </div>
          <button
            className="fd__close"
            onClick={onClose}
            aria-label="Close filters"
            type="button"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="fd__body">
          {/* Search */}
          <div className="fd__search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={labels.searchPlaceholder}
              aria-label={labels.searchPlaceholder}
            />
          </div>

          {/* Type */}
          <Section label={labels.type} open={openSections.type} onToggle={() => toggleSection("type")}>
            <div className="fd-chips">
              <Chip active={filters.partnerType === ""} onClick={() => onPartnerTypeChange("")}>
                {labels.allPartners}
              </Chip>
              <Chip
                active={filters.partnerType === PartnerTypeEnum.ORGANIZATION}
                onClick={() => onPartnerTypeChange(PartnerTypeEnum.ORGANIZATION)}
              >
                {labels.company}
              </Chip>
              <Chip
                active={filters.partnerType === PartnerTypeEnum.INDIVIDUAL}
                onClick={() => onPartnerTypeChange(PartnerTypeEnum.INDIVIDUAL)}
              >
                {labels.brand}
              </Chip>
            </div>
          </Section>

          {/* Region */}
          <Section label={labels.region} open={openSections.city} onToggle={() => toggleSection("city")}>
            <ul className="fd-list">
              <li>
                <button
                  type="button"
                  className={`fd-list__row${filters.city === "" ? " fd-list__row--active" : ""}`}
                  onClick={() => onCityChange("")}
                >
                  <span>{labels.allCities}</span>
                </button>
              </li>
              {CITIES.map((c) => (
                <li key={c.value}>
                  <button
                    type="button"
                    className={`fd-list__row${filters.city === c.value ? " fd-list__row--active" : ""}`}
                    onClick={() => onCityChange(c.value)}
                  >
                    <span>{isGe ? c.labelGe : c.labelEn}</span>
                  </button>
                </li>
              ))}
            </ul>
          </Section>

          {/* Rating */}
          <Section label={labels.rating} open={openSections.rating} onToggle={() => toggleSection("rating")}>
            <ul className="fd-list">
              <li>
                <button
                  type="button"
                  className={`fd-list__row${filters.minRating === 0 ? " fd-list__row--active" : ""}`}
                  onClick={() => onRatingChange(0)}
                >
                  <span>{labels.anyRating}</span>
                </button>
              </li>
              {STAR_RATINGS.map((r) => (
                <li key={r}>
                  <button
                    type="button"
                    className={`fd-list__row${filters.minRating === r ? " fd-list__row--active" : ""}`}
                    onClick={() => onRatingChange(filters.minRating === r ? 0 : r)}
                  >
                    <span className="pf-stars" aria-hidden="true">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <span key={s} className={`pf-star${s <= r ? " pf-star--on" : ""}`}>★</span>
                      ))}
                    </span>
                    <span className="pf-rating-label">{r} {labels.andUp}</span>
                  </button>
                </li>
              ))}
            </ul>
          </Section>
        </div>

        {/* Footer */}
        <div className="fd__footer">
          <button type="button" className="fd__clear" onClick={onClearAll}>
            {labels.clearAll}
          </button>
        </div>
      </aside>
    </>
  );

  return createPortal(drawer, document.body);
}

// ─────────────────────────────────────────────────────────────

function Section({
  label,
  open,
  onToggle,
  children,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="fd-section">
      <button
        type="button"
        className="fd-section__head"
        onClick={onToggle}
        aria-expanded={open}
      >
        <span>{label}</span>
        <svg
          className={`fd-section__chevron${open ? " fd-section__chevron--open" : ""}`}
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && <div className="fd-section__body">{children}</div>}
    </section>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className={`fd-chip${active ? " fd-chip--active" : ""}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
