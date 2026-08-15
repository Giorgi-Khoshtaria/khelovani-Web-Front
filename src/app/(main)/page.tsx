import type { Metadata } from "next";
import { cookies } from "next/headers";
import MainPageHero from "@/components/mainPage/mainPageHero/MainPageHero";
import PopularCategory from "@/components/mainPage/popularCategory/PopularCategory";
import {
  getPinnedCategories,
  type PublicCategory,
} from "@/apiCalls/categoryRequests/category.req";
import { getPinnedProducts, type PinnedProductsGrouped } from "@/apiCalls/productRequests/product.req";
import PopularProduct from "@/components/mainPage/popularProducts/PopularProduct";
import PopularPartners from "@/components/mainPage/popularPartner/PopularPartners";
import { Partner } from "@/lib/types/partnerTypes";
import { getPinnedPartners } from "@/apiCalls/partnerRequests/partner.req";
import { getPublicStats, type PublicStats } from "@/apiCalls/common.req";
import { getPageByPath } from "@/apiCalls/pageRequests/page.req";
import { Lang } from "@/lib/types/lang.types";
import { buildPageMetadata } from "@/lib/utils/seo";

export const revalidate = 600;

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value as Lang) || "ge";

  try {
    const page = await getPageByPath("/");
    return buildPageMetadata({
      path: "/",
      title: lang === "ge" ? page.title.ka : page.title.en,
      description: lang === "ge" ? page.description.ka : page.description.en,
      ogImage: page.ogImage,
      noindex: page.noindex,
    });
  } catch {
    return buildPageMetadata({
      path: "/",
      title:
        lang === "ge"
          ? "Khelovani — ქართული ხელნაკეთი ნივთები"
          : "Khelovani — Georgian Handmade Goods",
      description:
        lang === "ge"
          ? "Khelovani — ქართველი ხელოსნებისა და ბრენდების ონლაინ მარკეტი: ხელნაკეთი კერამიკა, სამკაული, ტექსტილი და სხვა."
          : "Khelovani — an online marketplace for Georgian artisans and brands: handmade ceramics, jewelry, textiles, and more.",
    });
  }
}

const EMPTY_GROUPED: PinnedProductsGrouped = {
  handmade: [], made_to_order: [], limited_edition: [],
  one_of_a_kind: [], restored: [], upcycled: [],
};

export default async function HomePage() {
  const [pinnedCategories, pinnedProducts, PinnedPartners, stats] =
    await Promise.all([
      getPinnedCategories().catch((): PublicCategory[] => []),
      getPinnedProducts().catch((): PinnedProductsGrouped => EMPTY_GROUPED),
      getPinnedPartners().catch((): Partner[] => []),
      getPublicStats().catch((): PublicStats => ({ makers: 0, pieces: 0, regions: 12 })),
    ]);

  const hasAnyProducts = Object.values(pinnedProducts).some((arr) => arr.length > 0);

  return (
    <div className="main-page">
      <MainPageHero stats={stats} />
      {pinnedCategories.length > 0 && (
        <PopularCategory pinnedCategories={pinnedCategories} />
      )}
      {hasAnyProducts && (
        <PopularProduct grouped={pinnedProducts} />
      )}
      {PinnedPartners.length > 0 && (
        <PopularPartners PinnedPartners={PinnedPartners} />
      )}
    </div>
  );
}
