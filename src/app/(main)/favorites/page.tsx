import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  getFavorites,
  type FavoriteItem,
  type FavoriteStats,
} from "@/apiCalls/favoriteRequests/favorite.req";
import { FavoritesStateProvider } from "@/contexts/FavoritesStateContext";
import FavoritesHero from "@/components/favoritesPage/favoritesHero/FavoritesHero";
import FavoritesToolbar from "@/components/favoritesPage/favoritesToolbar/FavoritesToolbar";
import FavoritesGrid from "@/components/favoritesPage/favoritesGrid/FavoritesGrid";
import "./favorites.scss";

export const dynamic = "force-dynamic";

export default async function FavoritesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access-token")?.value;

  if (!token) redirect("/login?next=/favorites");

  let items: FavoriteItem[] = [];
  let stats: FavoriteStats = {
    total: 0,
    priceDrops: 0,
    totalValue: 0,
    categories: {},
  };
  try {
    const res = await getFavorites({ sort: "recent" }, token);
    items = res.items;
    stats = res.stats;
  } catch {
    // SSR fetch failed — render empty state; components will refetch on interaction.
  }

  return (
    <div className="favorites-page">
      <div className="favorites-page__container">
        <FavoritesStateProvider initialItems={items} initialStats={stats}>
          <FavoritesHero />
          <FavoritesToolbar />
          <FavoritesGrid />
        </FavoritesStateProvider>
      </div>
    </div>
  );
}
