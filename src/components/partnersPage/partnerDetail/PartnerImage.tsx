"use client";

import type { Partner } from "@/lib/types/partnerTypes";
import "./partnerImage.scss";

interface Props {
  partner: Partner;
  name: string;
}

/** Modest-sized partner portrait (sticky column handled by parent). */
export default function PartnerImage({ partner, name }: Props) {
  return (
    <div className="partner-image">
      {partner.profilePhoto ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={partner.profilePhoto}
          alt={name}
          className="partner-image__photo"
        />
      ) : (
        <div className="partner-image__placeholder" aria-hidden="true">
          {name.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
}
