"use client";

import { Icon } from "@/lib/icons/icons";
import type { Partner } from "@/lib/types/partnerTypes";
import "./partnerSocials.scss";

const SOCIALS = [
  { key: "website", icon: Icon.globe },
  { key: "instagram", icon: Icon.instagram },
  { key: "facebook", icon: Icon.facebook },
  { key: "tiktok", icon: Icon.tiktok },
] as const;

/** Row of social icon links (only renders the ones the partner has). */
export default function PartnerSocials({ partner }: { partner: Partner }) {
  const links = SOCIALS.map((s) => ({
    ...s,
    url: partner[s.key as keyof Partner] as string | undefined,
  })).filter((s) => s.url);

  if (links.length === 0) return null;

  return (
    <div className="partner-socials">
      {links.map((s) => {
        const href = s.url!.startsWith("http") ? s.url! : `https://${s.url}`;
        return (
          <a
            key={s.key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="partner-socials__link"
            aria-label={s.key}
          >
            {s.icon}
          </a>
        );
      })}
    </div>
  );
}
