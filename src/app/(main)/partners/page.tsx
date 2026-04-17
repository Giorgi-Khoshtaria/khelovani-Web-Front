import "./partnerspage.scss";
import PartnersHero from "@/components/partnersPage/partnersHero/PartnersHero";
import PartnerListing from "@/components/partnersPage/partnerListing/PartnerListing";
import { getPartners } from "@/apiCalls/partnerRequests/partner.req";

export const dynamic = "force-dynamic";

export default async function PartnersPage() {
  const initialData = await getPartners({ page: 1, limit: 12 }).catch(() => ({
    data: [],
    meta: { totalPages: 1, totalCount: 0, currentPage: 1 },
  }));

  return (
    <div className="partners-page">
      <PartnersHero />
      <PartnerListing
        initialPartners={initialData.data}
        initialTotalPages={initialData.meta?.totalPages ?? 1}
      />
    </div>
  );
}
