import "./partnerspage.scss";
import PartnersHero from "@/components/partnersPage/partnersHero/PartnersHero";
import PartnerListing from "@/components/partnersPage/partnerListing/PartnerListing";

async function getInitialPartners() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/partner?page=1&limit=12`, {
      cache: "no-store",
    });
    if (!res.ok) return { data: [], totalPages: 1 };
    return res.json();
  } catch (error) {
    console.error("Failed SSR to fetch partners", error);
    return { data: [], totalPages: 1 };
  }
}

export default async function PartnersPage() {
  const initialData = await getInitialPartners();

  return (
    <div className="partners-page">
      <PartnersHero />
      <PartnerListing 
        initialPartners={initialData.data} 
        initialTotalPages={initialData.totalPages} 
      />
    </div>
  );
}
