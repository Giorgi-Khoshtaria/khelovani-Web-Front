import "./partnerspage.scss";
import PartnersHero from "@/components/partnersPage/partnersHero/PartnersHero";
import PartnerListing from "@/components/partnersPage/partnerListing/PartnerListing";
import { getPartners } from "@/apiCalls/partnerRequests/partner.req";
import type { PartnersHeroStats } from "@/lib/types/partnerTypes";

export const revalidate = 300;

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
