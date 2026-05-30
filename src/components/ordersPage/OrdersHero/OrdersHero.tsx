"use client";

import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import "./ordersHero.scss";

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
}

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

/** Orders page heading + subtitle + search (no breadcrumbs). */
export default function OrdersHero({ search, onSearchChange }: Props) {
  const { t: tPages } = useClientTranslation("pages");
  const { lang } = useLanguage();
  const isGe = lang.toLowerCase() === "ge";

  const placeholder =
    tPages("orders.search_placeholder") ||
    (isGe ? "მოძებნე შეკვეთის # ან ნივთი..." : "Search by order # or item...");

  return (
    <header className="orders-hero">
      <div className="orders-hero__text">
        <h1 className="orders-hero__title">
          {tPages("orders.title_prefix") || (isGe ? "თქვენი" : "Your")}{" "}
          <em className="orders-hero__title-em">
            {tPages("orders.title_word") || (isGe ? "შეკვეთები" : "orders")}
          </em>
        </h1>
        <p className="orders-hero__subtitle">
          {tPages("orders.subtitle") ||
            (isGe
              ? "თვალი ადევნე მიმდინარე შეკვეთებს და ხელახლა შეუკვეთე საყვარელი ნივთები."
              : "Track current orders, download invoices, and re-order pieces you loved.")}
        </p>
      </div>

      <div className="orders-hero__search">
        <SearchIcon />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
        />
      </div>
    </header>
  );
}
