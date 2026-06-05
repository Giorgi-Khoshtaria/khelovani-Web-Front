"use client";

import Link from "next/link";
import type { IProduct } from "@/lib/types/productTypes";
import type { Partner } from "@/lib/types/partnerTypes";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import { Icon } from "@/lib/icons/icons";
import { usePartnerDetail, localizePartner } from "./usePartnerDetail";
import BackToPartners from "./BackToPartners";
import PartnerImage from "./PartnerImage";
import PartnerHeroCard from "./PartnerHeroCard";
import PartnerAbout from "./PartnerAbout";
import PartnerPieces from "./PartnerPieces";
import "./partnerDetail.scss";

interface Props {
  id: string;
  initialData?: Partner | null;
  products: IProduct[];
  /** Total visible product count from the server (preferred over the hook's). */
  productCount?: number;
  serverLang?: string;
}

function DetailSkeleton() {
  return (
    <div className="partner-detail">
      <div className="partner-detail__inner">
        <div className="partner-detail__layout">
          <div className="partner-detail__skel partner-detail__skel--media" />
          <div className="partner-detail__content">
            <div className="partner-detail__skel partner-detail__skel--card" />
            <div className="partner-detail__skel partner-detail__skel--card" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PartnerDetail({
  id,
  initialData = null,
  products,
  productCount: ssrProductCount,
  serverLang = "ge",
}: Props) {
  const {
    partner,
    productCount: hookProductCount,
    isLoading,
    error,
    lang,
  } = usePartnerDetail(id, initialData, serverLang);
  const productCount = ssrProductCount ?? hookProductCount;
  const { t: tPages } = useClientTranslation("pages");
  const { lang: clientLang } = useLanguage();
  const isGe = (serverLang || clientLang) === "ge";

  if (isLoading) return <DetailSkeleton />;

  if (error || !partner) {
    return (
      <div className="partner-detail">
        <div className="partner-detail__inner">
          <div className="partner-detail__error">
            <span className="partner-detail__error-icon">
              {Icon.alertCircle}
            </span>
            <p className="partner-detail__error-title">
              {tPages("partner_profile.error_not_found") ||
                (isGe ? "პარტნიორი არ მოიძებნა" : "Partner not found")}
            </p>
            <Link href="/partners" className="partner-detail__error-back">
              {Icon.arrowLeft}
              {isGe ? "პარტნიორებზე დაბრუნება" : "Back to partners"}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { name, description, address, city } = localizePartner(partner, lang);

  return (
    <div className="partner-detail">
      <div className="partner-detail__inner">
        <BackToPartners />

        <div className="partner-detail__layout">
          <aside className="partner-detail__media">
            <PartnerImage partner={partner} name={name} />
          </aside>

          <div className="partner-detail__content">
            <PartnerHeroCard
              partner={partner}
              partnerId={id}
              name={name}
              city={city}
              address={address}
              productCount={productCount}
            />
            <PartnerAbout description={description} />
          </div>
        </div>

        <PartnerPieces
          products={products}
          name={name}
          partnerId={id}
          productCount={productCount}
        />
      </div>
    </div>
  );
}
