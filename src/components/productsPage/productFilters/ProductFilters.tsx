"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCategories } from "@/contexts/CategoriesContext";
import { getPartners } from "@/apiCalls/partnerRequests/partner.req";
import { Partner } from "@/lib/types/partnerTypes";
import "./productFilters.scss";

export interface ProductFiltersState {
  search: string;
  category: string;
  partnerIds: string[];
  minPrice: number;
  maxPrice: number;
}

interface Props {
  isOpen: boolean;
  filters: ProductFiltersState;
  onClose: () => void;
  onSearchChange: (v: string) => void;
  onCategoryChange: (slug: string) => void;
  onPartnerToggle: (id: string) => void;
  onPriceChange: (min: number, max: number) => void;
  onClearAll: () => void;
}

const PRICE_MIN = 0;
const PRICE_MAX = 10000;
const PRICE_STEP = 100;

type SectionKey = "category" | "organization" | "price";

export default function ProductFilters({
  isOpen,
  filters,
  onClose,
  onSearchChange,
  onCategoryChange,
  onPartnerToggle,
  onPriceChange,
  onClearAll,
}: Props) {
  const { t: tCommon } = useClientTranslation("common");
  const { lang } = useLanguage();
  const isGe = lang === "ge";
  const langLower = lang.toLowerCase() as "ge" | "en";

  const { categories, getLabel } = useCategories();

  const [openSections, setOpenSections] = useState<Record<SectionKey, boolean>>(
    {
      category: true,
      organization: true,
      price: true,
    },
  );
  const toggleSection = (key: SectionKey) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const [partners, setPartners] = useState<Partner[]>([]);
  const [partnerSearch, setPartnerSearch] = useState("");
  const [partnersLoading, setPartnersLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || partners.length > 0) return;
    const controller = new AbortController();
    setPartnersLoading(true);
    getPartners({ page: 1, limit: 50 }, controller.signal)
      .then((res) => setPartners(res.data ?? []))
      .catch(() => undefined)
      .finally(() => setPartnersLoading(false));
    return () => controller.abort();
  }, [isOpen, partners.length]);

  const visiblePartners = useMemo(() => {
    if (!partnerSearch) return partners;
    const q = partnerSearch.toLowerCase();
    return partners.filter((p) => {
      const a = p.companyNameEn?.toLowerCase() ?? "";
      const b = p.companyNameGe?.toLowerCase() ?? "";
      return a.includes(q) || b.includes(q);
    });
  }, [partners, partnerSearch]);

  const partnerName = (p: Partner) =>
    (isGe ? p.companyNameGe : p.companyNameEn) || p.companyNameGe;

  // Slider spans [PRICE_MIN, PRICE_MAX]; parent's "no upper bound" sentinel
  // can be larger, so we clamp incoming values and emit MAX_SAFE_INTEGER when
  // the user sits at the visual ceiling.
  const clampLocal = (v: number) => Math.max(PRICE_MIN, Math.min(PRICE_MAX, v));
  const [localMin, setLocalMin] = useState(clampLocal(filters.minPrice));
  const [localMax, setLocalMax] = useState(clampLocal(filters.maxPrice));

  useEffect(() => {
    setLocalMin(clampLocal(filters.minPrice));
    setLocalMax(clampLocal(filters.maxPrice));
  }, [filters.minPrice, filters.maxPrice]);

  const commitPrice = (min: number, max: number) => {
    const safeMin = Math.max(PRICE_MIN, Math.min(min, max - PRICE_STEP));
    const safeMax = Math.min(PRICE_MAX, Math.max(max, min + PRICE_STEP));
    const outMax = safeMax >= PRICE_MAX ? Number.MAX_SAFE_INTEGER : safeMax;
    onPriceChange(safeMin, outMax);
  };

  const pctMin = ((localMin - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;
  const pctMax = ((localMax - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;

  const labels = {
    refineEyebrow:
      tCommon("partner_listing.refine") || (isGe ? "დახვეწა" : "Refine"),
    filtersTitle: isGe ? "ფილტრები" : "Filters",
    searchPlaceholder: isGe
      ? "მოძებნე პროდუქტი ან ხელოსანი..."
      : "Search products or artisans...",
    category: tCommon("category") || (isGe ? "კატეგორია" : "Category"),
    allCategories: isGe ? "ყველა კატეგორია" : "All categories",
    organization: isGe ? "ორგანიზაცია" : "Organization",
    findArtisan: isGe ? "მოძებნე ხელოსანი..." : "Find an artisan...",
    priceRange: isGe ? "ფასი" : "Price range",
    clearAll:
      tCommon("clear_all_filter") ||
      (isGe ? "ფილტრების გასუფთავება" : "Clear all"),
    noArtisans: isGe ? "ხელოსანი ვერ მოიძებნა" : "No artisans found",
    loading: tCommon("loading") || (isGe ? "იტვირთება..." : "Loading..."),
  };

  // Render via portal so the drawer escapes any animated/transformed ancestor.
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
            {/* <span className="fd__eyebrow">{labels.refineEyebrow}</span> */}
            <h2 className="fd__title">{labels.filtersTitle}</h2>
          </div>
          <button
            className="fd__close"
            onClick={onClose}
            aria-label="Close filters"
            type="button"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body (scroll) */}
        <div className="fd__body">
          {/* Search */}
          <div className="fd__search">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
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

          {/* Price Range */}
          <Section
            label={labels.priceRange}
            open={openSections.price}
            onToggle={() => toggleSection("price")}
          >
            <div className="pf-price">
              <div className="pf-price__legend">
                <span>₾{localMin}</span>
                <span>
                  ₾{localMax}
                  {localMax >= PRICE_MAX ? "+" : ""}
                </span>
              </div>
              <div
                className="pf-price__track"
                style={{
                  ["--pf-pct-min" as never]: `${pctMin}%`,
                  ["--pf-pct-max" as never]: `${pctMax}%`,
                }}
              >
                <span className="pf-price__range" />
                <input
                  type="range"
                  min={PRICE_MIN}
                  max={PRICE_MAX}
                  step={PRICE_STEP}
                  value={localMin}
                  onChange={(e) => setLocalMin(Number(e.target.value))}
                  onMouseUp={() => commitPrice(localMin, localMax)}
                  onTouchEnd={() => commitPrice(localMin, localMax)}
                  onKeyUp={() => commitPrice(localMin, localMax)}
                  aria-label="Minimum price"
                />
                <input
                  type="range"
                  min={PRICE_MIN}
                  max={PRICE_MAX}
                  step={PRICE_STEP}
                  value={localMax}
                  onChange={(e) => setLocalMax(Number(e.target.value))}
                  onMouseUp={() => commitPrice(localMin, localMax)}
                  onTouchEnd={() => commitPrice(localMin, localMax)}
                  onKeyUp={() => commitPrice(localMin, localMax)}
                  aria-label="Maximum price"
                />
              </div>
            </div>
          </Section>

          {/* Category */}
          <Section
            label={labels.category}
            open={openSections.category}
            onToggle={() => toggleSection("category")}
          >
            <ul className="fd-list">
              <li>
                <button
                  type="button"
                  className={`fd-list__row${filters.category === "all" ? " fd-list__row--active" : ""}`}
                  onClick={() => onCategoryChange("all")}
                >
                  <span>{labels.allCategories}</span>
                </button>
              </li>
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <button
                    type="button"
                    className={`fd-list__row${filters.category === cat.slug ? " fd-list__row--active" : ""}`}
                    onClick={() => onCategoryChange(cat.slug)}
                  >
                    <span>{getLabel(cat.slug, langLower)}</span>
                    {typeof cat.productCount === "number" && (
                      <span className="fd-list__count">{cat.productCount}</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </Section>

          {/* Organization */}
          <Section
            label={labels.organization}
            open={openSections.organization}
            onToggle={() => toggleSection("organization")}
          >
            <div className="fd__sub-search">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                value={partnerSearch}
                onChange={(e) => setPartnerSearch(e.target.value)}
                placeholder={labels.findArtisan}
                aria-label={labels.findArtisan}
              />
            </div>

            {partnersLoading ? (
              <p className="fd__hint">{labels.loading}</p>
            ) : visiblePartners.length === 0 ? (
              <p className="fd__hint">{labels.noArtisans}</p>
            ) : (
              <ul className="fd-checks">
                {visiblePartners.map((p) => {
                  const id = p._id ?? "";
                  if (!id) return null;
                  const checked = filters.partnerIds.includes(id);
                  return (
                    <li key={id}>
                      <label className="fd-check">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => onPartnerToggle(id)}
                        />
                        <span className="fd-check__box" aria-hidden="true">
                          {checked && (
                            <svg
                              width="10"
                              height="10"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </span>
                        <span className="fd-check__label">
                          {partnerName(p)}
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            )}
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
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && <div className="fd-section__body">{children}</div>}
    </section>
  );
}
