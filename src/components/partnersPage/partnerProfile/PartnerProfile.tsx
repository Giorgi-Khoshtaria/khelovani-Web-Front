"use client";

import { useState, useEffect, useRef } from "react";
import { getPartnerById } from "@/apiCalls/partnerRequests/partner.req";
import { useLanguage } from "@/contexts/LanguageContext";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import "./partnerProfile.scss";

export interface Partner {
  _id: string;
  companyNameGe: string;
  companyNameEn: string;
  city?: string;
  address?: string;
  addressEn?: string;
  description?: string;
  descriptionEn?: string;
  profilePhoto?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  website?: string;
  email?: string;
  phone?: string;
}

const SVGS = {
  website: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  facebook: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  ),
  instagram: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
  tiktok: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 12a4 4 0 1 0 4 4V4h3.5c.8 2.7 3 4.5 5.5 4.5v3c-1.5 0-3-.5-4-1.5v6a8 8 0 1 1-8-8v3a5 5 0 0 0 4 4z" />
    </svg>
  ),
};

const SocialLink = ({
  url,
  type,
}: {
  url?: string;
  type: keyof typeof SVGS;
}) => {
  if (!url) return null;
  const href = url.startsWith("http") ? url : `https://${url}`;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {SVGS[type]}
    </a>
  );
};

export default function PartnerProfile({
  id,
  initialData = null,
}: {
  id: string;
  initialData?: Partner | null;
}) {
  const { lang } = useLanguage();
  const { t: tPages } = useClientTranslation("pages");
  const { t: tInputs } = useClientTranslation("inputs");
  const { t: tCommon } = useClientTranslation("common");
  const [partner, setPartner] = useState<Partner | null>(initialData);
  const [isLoading, setIsLoading] = useState(!initialData);
  const [error, setError] = useState("");
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current && initialData) {
      isFirstMount.current = false;
      return;
    }

    const fetchPartner = async () => {
      setIsLoading(true);
      try {
        const data = await getPartnerById(id);
        setPartner(data);
      } catch (err: any) {
        console.error("Failed to fetch partner details", err);
        setError(
          tPages("partner_profile.error_not_found") ||
            "პარტნიორი არ მოიძებნა ან წვდომა შეზღუდულია",
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchPartner();
  }, [id, lang]);

  if (isLoading) {
    return (
      <div className="partner-profile__loading">
        {tCommon("loading") || "იტვირთება..."}
      </div>
    );
  }

  if (error || !partner) {
    return <div className="partner-profile__error">{error}</div>;
  }

  const name = lang === "ge" ? partner.companyNameGe : partner.companyNameEn;
  const description =
    lang === "ge"
      ? partner.description
      : partner.descriptionEn || partner.description;
  const address =
    lang === "ge" ? partner.address : partner.addressEn || partner.address;
  const city = partner.city
    ? partner.city.charAt(0).toUpperCase() + partner.city.slice(1)
    : "";

  return (
    <div className="partner-profile">
      {/* LEFT SIDE - IMAGE ONLY */}
      <aside className="partner-profile__left">
        {partner.profilePhoto ? (
          <img
            src={partner.profilePhoto}
            alt={name}
            className="partner-profile__photo"
          />
        ) : (
          <div className="partner-profile__photo-placeholder">
            {name.charAt(0).toUpperCase()}
          </div>
        )}
      </aside>

      {/* RIGHT SIDE - SINGLE CARD */}
      <main className="partner-profile__right">
        <div className="partner-profile__card">
          <h1 className="partner-profile__name">{name}</h1>

          <div className="partner-profile__metadata">
            {(city || address) && (
              <div className="partner-profile__meta-item">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>
                  {city ? `${city}, ` : ""} {address}
                </span>
              </div>
            )}

            {partner.email && (
              <div className="partner-profile__meta-item">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <a href={`mailto:${partner.email}`}>{partner.email}</a>
              </div>
            )}

            {partner.phone && (
              <div className="partner-profile__meta-item">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <a href={`tel:${partner.phone}`}>{partner.phone}</a>
              </div>
            )}
          </div>

          <div className="partner-profile__about">
            <h2 className="partner-profile__section-title">
              {tPages("partner_profile.about_us") || "ჩვენს შესახებ"}
            </h2>
            <p className="partner-profile__description">
              {description
                ? description
                : tPages("partner_profile.no_description") ||
                  "აღწერა არ არის მითითებული."}
            </p>
          </div>

          {(partner.website ||
            partner.facebook ||
            partner.instagram ||
            partner.tiktok) && (
            <div className="partner-profile__socials-section">
              <div className="partner-profile__socials">
                <SocialLink url={partner.website} type="website" />
                <SocialLink url={partner.facebook} type="facebook" />
                <SocialLink url={partner.instagram} type="instagram" />
                <SocialLink url={partner.tiktok} type="tiktok" />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
