"use client";

import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import { useFavoritesState } from "@/contexts/FavoritesStateContext";
import "./favoritesHero.scss";

export default function FavoritesHero() {
  const { stats } = useFavoritesState();
  const { t: tPages } = useClientTranslation("pages");
  const { t: tCommon } = useClientTranslation("common");

  return (
    <header className="fav-hero">
      <div className="fav-hero__left">
        <h1 className="fav-hero__title">
          {tPages("favorites.title_a") || "Your"}{" "}
          <em>{tPages("favorites.title_b") || "favorites"}</em>
        </h1>
        <p className="fav-hero__subtitle">
          {tPages("favorites.subtitle") ||
            "Pieces you've saved — set them aside, keep an eye on prices, or add them to your cart."}
        </p>
      </div>

      {/* <div className="fav-hero__stats">
        <div className="fav-hero__stat">
          <span className="fav-hero__stat-icon" aria-hidden>
            ♡
          </span>
          <div className="fav-hero__stat-text">
            <span className="fav-hero__stat-value">{stats.total}</span>
            <span className="fav-hero__stat-label">
              {tCommon("pieces_saved") || "Pieces saved"}
            </span>
          </div>
        </div>
        <span className="fav-hero__divider" />
        <div className="fav-hero__stat">
          <span className="fav-hero__stat-icon" aria-hidden>
            ₾
          </span>
          <div className="fav-hero__stat-text">
            <span className="fav-hero__stat-value">
              {stats.totalValue.toLocaleString()}
            </span>
            <span className="fav-hero__stat-label">
              {tCommon("total_value") || "Total value"}
            </span>
          </div>
        </div>
      </div> */}
    </header>
  );
}
