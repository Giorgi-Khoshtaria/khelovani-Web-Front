import "./partnerspage.scss";
import PartnersHero from "@/components/partnersPage/partnersHero/PartnersHero";
import PartnerListing from "@/components/partnersPage/partnerListing/PartnerListing";

export default function PartnersPage() {
  return (
    <div className="partners-page">
      <PartnersHero />
      <PartnerListing />
    </div>
  );
}
