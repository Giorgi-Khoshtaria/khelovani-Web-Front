"use client";

import type { Partner } from "@/lib/types/partnerTypes";
import "./partnerImage.scss";

interface Props {
  partner: Partner;
  name: string;
}

/** Large partner photo with the category badge (sticky column handled by parent). */
export default function PartnerImage({ partner, name }: Props) {
  const category = partner.categories?.[0];

  return (
    <div className="partner-image">
      {category && (
        <span className="partner-image__badge">{category.toUpperCase()}</span>
      )}
      {partner.profilePhoto ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={partner.profilePhoto}
          alt={name}
          className="partner-image__photo"
        />
      ) : (
        <div className="partner-image__placeholder">
          {name.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
}
