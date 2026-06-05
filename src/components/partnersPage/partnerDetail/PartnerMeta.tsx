"use client";

import type { ReactNode } from "react";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import { Icon } from "@/lib/icons/icons";
import type { Partner } from "@/lib/types/partnerTypes";
import "./partnerMeta.scss";

interface Props {
  partner: Partner;
  city: string;
  address: string;
  productCount: number;
}

/** Contact / location / product-count rows shown in the hero card. */
export default function PartnerMeta({
  partner,
  city,
  address,
  productCount,
}: Props) {
  const { t: tCommon } = useClientTranslation("common");
  const { lang } = useLanguage();
  const isGe = lang === "ge";

  const created = (partner as { createdAt?: string }).createdAt;
  const sinceYear = created ? new Date(created).getFullYear() : null;
  const locationText = [city, address].filter(Boolean).join(", ");

  const rows: { icon: ReactNode; content: ReactNode }[] = [];

  if (locationText) {
    rows.push({
      icon: Icon.mapPin,
      content: (
        <>
          {locationText}
          {sinceYear ? ` · ${isGe ? "დაარსდა" : "since"} ${sinceYear}` : ""}
        </>
      ),
    });
  }
  if (partner.email) {
    rows.push({
      icon: Icon.mail,
      content: <a href={`mailto:${partner.email}`}>{partner.email}</a>,
    });
  }
  if (partner.phone) {
    rows.push({
      icon: Icon.phone,
      content: <a href={`tel:${partner.phone}`}>{partner.phone}</a>,
    });
  }
  rows.push({
    icon: Icon.shoppingBag,
    content: (
      <>
        <strong>{productCount}</strong>{" "}
        {tCommon("products.available") ||
          (isGe ? "პროდუქტი ხელმისაწვდომია" : "products available")}
      </>
    ),
  });

  return (
    <ul className="partner-meta">
      {rows.map((row, i) => (
        <li key={i} className="partner-meta__row">
          <span className="partner-meta__icon">{row.icon}</span>
          <span className="partner-meta__text">{row.content}</span>
        </li>
      ))}
    </ul>
  );
}
