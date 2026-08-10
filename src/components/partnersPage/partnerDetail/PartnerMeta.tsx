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
  /** First category, localised — was shown as an eyebrow above the name. */
  categoryLabel?: string | null;
}

/**
 * The spec grid — a label:value list (category, location, founded, pieces,
 * email, phone), like a maker's credentials card, instead of a flowing
 * sentence of facts. Contact rows only render the fields the partner filled
 * in from their admin profile.
 */
export default function PartnerMeta({
  partner,
  city,
  productCount,
  categoryLabel,
}: Props) {
  const { t: tCommon } = useClientTranslation("common");
  const { lang } = useLanguage();
  const isGe = lang === "ge";

  const created = (partner as { createdAt?: string }).createdAt;
  const sinceYear = created ? new Date(created).getFullYear() : null;
  const email = partner.email?.trim();
  const phone = partner.phone?.trim();

  return (
    <dl className="partner-spec">
      {categoryLabel && (
        <div className="partner-spec__row">
          <dt>{isGe ? "კატეგორია" : "Category"}</dt>
          <dd>{categoryLabel}</dd>
        </div>
      )}
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
      {email && (
        <div className="partner-spec__row">
          <dt>{isGe ? "ელ-ფოსტა" : "Email"}</dt>
          <dd>
            <a href={`mailto:${email}`} className="partner-spec__link">
              {email}
            </a>
          </dd>
        </div>
      )}
      {phone && (
        <div className="partner-spec__row">
          <dt>{isGe ? "ტელეფონი" : "Phone"}</dt>
          <dd>
            <a
              href={`tel:${phone.replace(/\s+/g, "")}`}
              className="partner-spec__link"
            >
              {phone}
            </a>
          </dd>
        </div>
      )}
    </dl>
  );
}
