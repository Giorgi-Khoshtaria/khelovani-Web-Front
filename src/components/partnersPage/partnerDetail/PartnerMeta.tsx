"use client";

import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Partner } from "@/lib/types/partnerTypes";
import "./partnerMeta.scss";

interface Props {
  partner: Partner;
  city: string;
  address: string;
  productCount: number;
}

/**
 * The spec grid — a label:value list (location, founded, pieces), like a
 * maker's credentials card, instead of a flowing sentence of facts.
 */
export default function PartnerMeta({ partner, city, productCount }: Props) {
  const { t: tCommon } = useClientTranslation("common");
  const { lang } = useLanguage();
  const isGe = lang === "ge";

  const created = (partner as { createdAt?: string }).createdAt;
  const sinceYear = created ? new Date(created).getFullYear() : null;

  return (
    <dl className="partner-spec">
      {city && (
        <div className="partner-spec__row">
          <dt>{isGe ? "ლოკაცია" : "Location"}</dt>
          <dd>{city}</dd>
        </div>
      )}
      {sinceYear && (
        <div className="partner-spec__row">
          <dt>{isGe ? "დაარსდა" : "Founded"}</dt>
          <dd>{sinceYear}</dd>
        </div>
      )}
      <div className="partner-spec__row">
        <dt>{isGe ? "ნამუშევარი" : "Pieces"}</dt>
        <dd>
          {productCount} {tCommon("products.available") || (isGe ? "ხელმისაწვდომი" : "available")}
        </dd>
      </div>
    </dl>
  );
}
