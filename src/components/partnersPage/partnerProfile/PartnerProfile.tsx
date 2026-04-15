"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
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

// ─── Icon Library ──────────────────────────────────────────
const Icon = {
  arrowLeft: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
  ),
  mapPin: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  mail: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  phone: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  alertCircle: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  globe: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12a4 4 0 1 0 4 4V4h3.5c.8 2.7 3 4.5 5.5 4.5v3c-1.5 0-3-.5-4-1.5v6a8 8 0 1 1-8-8v3a5 5 0 0 0 4 4z" />
    </svg>
  ),
};

// ─── Skeleton Loader ───────────────────────────────────────
function ProfileSkeleton() {
  return (
    <div className="partner-profile-skeleton">
      <div className="partner-profile-skeleton__left">
        <div className="skel skel--photo" />
      </div>
      <div className="partner-profile-skeleton__right">
        <div className="skel skel--title" />
        <div className="skel skel--sub" />
        <div className="skel skel--meta" />
        <div className="skel skel--meta" style={{ width: "40%" }} />
        <div className="skel skel--block" />
      </div>
    </div>
  );
}

// ─── Error State ───────────────────────────────────────────
function ProfileError({ message }: { message: string }) {
  return (
    <div className="partner-profile-error">
      <div className="partner-profile-error__icon">{Icon.alertCircle}</div>
      <p className="partner-profile-error__title">პარტნიორი არ მოიძებნა</p>
      <p className="partner-profile-error__message">
        {message || "გთხოვთ სცადოთ მოგვიანებით ან დაუბრუნდეთ პარტნიორების სიას."}
      </p>
      <Link href="/partners" className="partner-profile-error__back">
        {Icon.arrowLeft}
        პარტნიორების სიაზე დაბრუნება
      </Link>
    </div>
  );
}

// ─── Social Link Button ────────────────────────────────────
const SOCIAL_LABELS: Record<string, string> = {
  website: "ვებ-გვერდი",
  facebook: "Facebook",
  instagram: "Instagram",
  tiktok: "TikTok",
};

function SocialLink({
  url,
  type,
}: {
  url?: string;
  type: "website" | "facebook" | "instagram" | "tiktok";
}) {
  if (!url) return null;
  const href = url.startsWith("http") ? url : `https://${url}`;
  const iconMap = {
    website: Icon.globe,
    facebook: Icon.facebook,
    instagram: Icon.instagram,
    tiktok: Icon.tiktok,
  };
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`partner-profile__social-link partner-profile__social-link--${type}`}
      aria-label={`${SOCIAL_LABELS[type]} - ახალ ჩანართში გახსნა`}
    >
      {iconMap[type]}
      {SOCIAL_LABELS[type]}
    </a>
  );
}

// ─── Main Component ────────────────────────────────────────
export default function PartnerProfile({
  id,
  initialData = null,
}: {
  id: string;
  initialData?: Partner | null;
}) {
  const { lang } = useLanguage();
  const { t: tPages } = useClientTranslation("pages");
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
            "პარტნიორი არ მოიძებნა ან წვდომა შეზღუდულია"
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchPartner();
  }, [id, lang]);

  if (isLoading) return <ProfileSkeleton />;
  if (error || !partner) return <ProfileError message={error} />;

  // ── Localised fields ──────────────────────────────────────
  const name =
    lang === "ge" ? partner.companyNameGe : partner.companyNameEn;
  const description =
    lang === "ge"
      ? partner.description
      : partner.descriptionEn || partner.description;
  const address =
    lang === "ge" ? partner.address : partner.addressEn || partner.address;
  const city = partner.city
    ? partner.city.charAt(0).toUpperCase() + partner.city.slice(1)
    : "";

  const hasSocials =
    partner.website || partner.facebook || partner.instagram || partner.tiktok;
  const hasContact = partner.email || partner.phone;

  return (
    <div className="partner-profile">
      {/* ── BREADCRUMB ───────────────────────────────────── */}
      <nav className="partner-profile__breadcrumb" aria-label="breadcrumb">
        <Link href="/partners">
          {Icon.arrowLeft}
          {tCommon("back") || "პარტნიორები"}
        </Link>
        <span className="partner-profile__breadcrumb-separator">/</span>
        <span className="partner-profile__breadcrumb-current">{name}</span>
      </nav>

      {/* ── BODY ─────────────────────────────────────────── */}
      <div className="partner-profile__body">

        {/* ── LEFT SIDEBAR ─────────────────────────────── */}
        <aside className="partner-profile__left" aria-label="პარტნიორის ფოტო">
          {/* Photo */}
          <div className="partner-profile__photo-frame">
            {partner.profilePhoto ? (
              <img
                src={partner.profilePhoto}
                alt={`${name} - კომპანიის ფოტო`}
                className="partner-profile__photo"
                loading="eager"
              />
            ) : (
              <div
                className="partner-profile__photo-placeholder"
                aria-hidden="true"
              >
                {name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Contact Card */}
          {(hasContact || (city || address)) && (
            <div className="partner-profile__contact-card">
              <p className="partner-profile__contact-title">
                {tPages("partner_profile.contact") || "საკონტაქტო"}
              </p>

              {(city || address) && (
                <div className="partner-profile__contact-item">
                  <span className="ci-icon">{Icon.mapPin}</span>
                  <span className="ci-text">
                    {city ? `${city}` : ""}
                    {city && address ? ", " : ""}
                    {address}
                  </span>
                </div>
              )}

              {partner.email && (
                <div className="partner-profile__contact-item">
                  <span className="ci-icon">{Icon.mail}</span>
                  <span className="ci-text">
                    <a href={`mailto:${partner.email}`}>{partner.email}</a>
                  </span>
                </div>
              )}

              {partner.phone && (
                <div className="partner-profile__contact-item">
                  <span className="ci-icon">{Icon.phone}</span>
                  <span className="ci-text">
                    <a href={`tel:${partner.phone}`}>{partner.phone}</a>
                  </span>
                </div>
              )}
            </div>
          )}
        </aside>

        {/* ── RIGHT CONTENT ────────────────────────────── */}
        <main className="partner-profile__right">

          {/* Header Card */}
          <div className="partner-profile__header-card">
            <h1 className="partner-profile__name">{name}</h1>

            {(city || address) && (
              <span className="partner-profile__location-badge">
                {Icon.mapPin}
                {city ? `${city}` : ""}
                {city && address ? " · " : ""}
                {address}
              </span>
            )}

            <div className="partner-profile__status-row">
              <span className="partner-profile__status-dot" aria-hidden="true" />
              <span className="partner-profile__status-label">
                {tPages("partner_profile.active_partner") || "აქტიური პარტნიორი"}
              </span>
            </div>
          </div>

          {/* Divider */}
          <hr className="partner-profile__divider" />

          {/* About Card */}
          <section className="partner-profile__about-card" aria-labelledby="about-heading">
            <h2 className="partner-profile__section-label" id="about-heading">
              {tPages("partner_profile.about_us") || "ჩვენს შესახებ"}
            </h2>
            {description ? (
              <p className="partner-profile__description">{description}</p>
            ) : (
              <p className="partner-profile__no-description">
                {tPages("partner_profile.no_description") ||
                  "აღწერა ჯერ არ არის მითითებული."}
              </p>
            )}
          </section>

          {/* Socials Card */}
          {hasSocials && (
            <section className="partner-profile__socials-card" aria-labelledby="socials-heading">
              <h2 className="partner-profile__section-label" id="socials-heading">
                {tPages("partner_profile.follow_us") || "გამოგვყევით"}
              </h2>
              <div className="partner-profile__socials-grid">
                <SocialLink url={partner.website}   type="website" />
                <SocialLink url={partner.facebook}  type="facebook" />
                <SocialLink url={partner.instagram} type="instagram" />
                <SocialLink url={partner.tiktok}    type="tiktok" />
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
