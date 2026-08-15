import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./partnerspage.scss";
import PartnersHero from "@/components/partnersPage/partnersHero/PartnersHero";
import PartnerListing from "@/components/partnersPage/partnerListing/PartnerListing";
import { getPartners } from "@/apiCalls/partnerRequests/partner.req";
import type { PartnersHeroStats } from "@/lib/types/partnerTypes";
import { getPageByPath } from "@/apiCalls/pageRequests/page.req";
import { Lang } from "@/lib/types/lang.types";
import { buildPageMetadata } from "@/lib/utils/seo";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value as Lang) || "ge";

  try {
    const page = await getPageByPath("/partners");
    return buildPageMetadata({
      path: "/partners",
      title: lang === "ge" ? page.title.ka : page.title.en,
      description: lang === "ge" ? page.description.ka : page.description.en,
      ogImage: page.ogImage,
      noindex: page.noindex,
    });
  } catch {
    return buildPageMetadata({
      path: "/partners",
      title: lang === "ge" ? "პარტნიორები" : "Partners",
      description:
        lang === "ge"
          ? "გაიცანით ჩვენი პარტნიორები — ქართველი ხელოსნები და ბრენდები."
          : "Meet our partners — Georgian artisans and brands.",
    });
  }
}

export default async function PartnersPage() {
  const emptyResponse = {
    data: [],
    meta: { totalPages: 1, totalCount: 0, currentPage: 1 },
  };

  const [initialData, statsResponse] = await Promise.all([
    getPartners({ page: 1, limit: 12 }).catch(() => emptyResponse),
    // Larger pull for hero stat aggregation
    getPartners({ page: 1, limit: 500 }).catch(() => emptyResponse),
  ]);

  const allForStats = statsResponse.data ?? [];

  const distinctCities = new Set(
    allForStats.map((p) => p.city).filter(Boolean),
  ).size;

  const distinctCategories = new Set(
    allForStats.flatMap((p) => p.categories ?? []),
  ).size;

  const years = allForStats
    .map((p) => p.establishedYear)
    .filter((y): y is number => typeof y === "number" && y > 1800);
  const oldestYear = years.length ? Math.min(...years) : undefined;

  const samplePhotos = allForStats
    .map((p) => p.profilePhoto)
    .filter((url): url is string => Boolean(url))
    .slice(0, 4);

  const stats: PartnersHeroStats = {
    totalMakers: statsResponse.meta?.totalCount ?? allForStats.length,
    regionCount: distinctCities,
    craftCount: distinctCategories,
    oldestYear,
    samplePhotos,
  };

  return (
    <div className="partners-page">
      <PartnersHero stats={stats} />
      <PartnerListing
        initialPartners={initialData.data}
        initialTotalPages={initialData.meta?.totalPages ?? 1}
        initialTotalCount={initialData.meta?.totalCount ?? 0}
      />
    </div>
  );
}
