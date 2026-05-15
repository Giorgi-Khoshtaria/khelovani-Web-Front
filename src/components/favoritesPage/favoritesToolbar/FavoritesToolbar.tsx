"use client";

import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import { useCategories } from "@/contexts/CategoriesContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFavoritesState } from "@/contexts/FavoritesStateContext";
import type { FavoriteSort } from "@/apiCalls/favoriteRequests/favorite.req";
import "./favoritesToolbar.scss";

const SORT_OPTIONS: { value: FavoriteSort; key: string }[] = [
  { value: "recent", key: "sort.recent" },
  { value: "oldest", key: "sort.oldest" },
  { value: "priceAsc", key: "sort.price_asc" },
  { value: "priceDesc", key: "sort.price_desc" },
];

export default function FavoritesToolbar() {
  const {
    stats,
    category,
    sort,
    sortOpen,
    setCategory,
    setSort,
    toggleSortOpen,
    closeSortMenu,
  } = useFavoritesState();
  const { handleClear } = useFavoritesState();
  const { getLabel } = useCategories();
  const { lang } = useLanguage();
  const { t: tCommon } = useClientTranslation("common");

  const sortLabel = (key: string) => tCommon(key) || key;
  const activeLabel = SORT_OPTIONS.find((o) => o.value === sort);

  return (
    <div className="fav-toolbar">
      <div className="fav-toolbar__chips">
        <button
          type="button"
          className={`fav-chip${category === "all" ? " fav-chip--active" : ""}`}
          onClick={() => setCategory("all")}
        >
          {tCommon("all") || "All"}
          <span className="fav-chip__count">{stats.total}</span>
        </button>

        {Object.entries(stats.categories)
          .sort((a, b) => b[1] - a[1])
          .map(([slug, count]) => (
            <button
              key={slug}
              type="button"
              className={`fav-chip${category === slug ? " fav-chip--active" : ""}`}
              onClick={() => setCategory(slug)}
            >
              {getLabel(slug, lang as "ge" | "en")}
              <span className="fav-chip__count">{count}</span>
            </button>
          ))}
      </div>

      <div className="fav-toolbar__right">
        <div className="fav-sort">
          <button
            type="button"
            className="fav-sort__trigger"
            onClick={toggleSortOpen}
            aria-haspopup="listbox"
            aria-expanded={sortOpen}
          >
            <span className="fav-sort__label">{tCommon("sort") || "Sort"}</span>
            <span className="fav-sort__value">
              {activeLabel ? sortLabel(activeLabel.key) : ""}
            </span>
            <span className="fav-sort__caret" aria-hidden>
              ⌄
            </span>
          </button>

          {sortOpen && (
            <ul className="fav-sort__menu" role="listbox">
              {SORT_OPTIONS.map((opt) => (
                <li key={opt.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={sort === opt.value}
                    className={`fav-sort__option${sort === opt.value ? " fav-sort__option--active" : ""}`}
                    onClick={() => {
                      setSort(opt.value);
                      closeSortMenu();
                    }}
                  >
                    {sortLabel(opt.key)}
                    {sort === opt.value && <span aria-hidden>✓</span>}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button type="button" className="fav-clear-btn" onClick={handleClear}>
          <span aria-hidden>⌫</span> {tCommon("clear_all") || "Clear all"}
        </button>
      </div>
    </div>
  );
}
