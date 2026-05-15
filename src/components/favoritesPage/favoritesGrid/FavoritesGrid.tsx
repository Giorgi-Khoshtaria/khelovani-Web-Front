"use client";

import Link from "next/link";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import { useFavoritesState } from "@/contexts/FavoritesStateContext";
import ProductCard from "@/components/productsPage/productCard/ProductCard";
import "./favoritesGrid.scss";

export default function FavoritesGrid() {
  const { items, loading } = useFavoritesState();
  const { t: tPages } = useClientTranslation("pages");
  const { t: tCommon } = useClientTranslation("common");

  if (loading && items.length === 0) {
    return (
      <section className="fav-grid">
        <p className="fav-grid__empty">{tCommon("loading") || "Loading…"}</p>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="fav-grid">
        <div className="fav-grid__empty">
          <p>
            {tPages("favorites.empty") || "You haven't saved anything yet."}
          </p>
          <Link href="/products" className="fav-grid__cta">
            {tPages("favorites.browse") || "Browse products"}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="fav-grid">
      <div className="fav-grid__items">
        {items.map((item) => (
          <div key={item._id} className="fav-grid__cell">
            <ProductCard product={item.product} />
            <div className="fav-grid__meta">
              <span className="fav-grid__saved">
                {tCommon("saved") || "Saved"} {formatRelative(item.savedAt)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function formatRelative(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const day = 24 * 60 * 60 * 1000;
  const days = Math.floor(diffMs / day);
  if (days < 1) return "today";
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months === 1 ? "" : "s"} ago`;
}
