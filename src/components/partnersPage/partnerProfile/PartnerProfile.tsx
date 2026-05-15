"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getPartnerById } from "@/apiCalls/partnerRequests/partner.req";
import { getProducts } from "@/apiCalls/productRequests/product.req";
import { useLanguage } from "@/contexts/LanguageContext";
import { Partner } from "@/lib/types/partnerTypes";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import { Icon } from "@/lib/utils/icons";
import "./partnerProfile.scss";

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
        {message ||
          "გთხოვთ სცადოთ მოგვიანებით ან დაუბრუნდეთ პარტნიორების სიას."}
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
      title={SOCIAL_LABELS[type]}
      aria-label={`${SOCIAL_LABELS[type]} - ახალ ჩანართში გახსნა`}
    >
      {iconMap[type]}
    </a>
  );
}

export default function PartnerProfile({
  id,
  initialData = null,
  serverLang = "ge",
}: {
  id: string;
  initialData?: Partner | null;
  serverLang?: string;
}) {
  const { lang: clientLang } = useLanguage();
  const lang = serverLang || clientLang;
  const { t: tPages } = useClientTranslation("pages");
  const { t: tCommon } = useClientTranslation("common");

  const [partner, setPartner] = useState<Partner | null>(initialData);
  const [productCount, setProductCount] = useState<number>(
    initialData?.productCount || 0,
  );
  const [isLoading, setIsLoading] = useState(!initialData);
  const [error, setError] = useState("");

  useEffect(() => {
    // Skip the fetch on initial mount when SSR already provided data;
    // refetch only when `id` or `lang` actually change. The ref pattern
    // was Strict-mode unfriendly — comparing against initialData.* is.
    const haveServerData =
      initialData?._id === id &&
      partner?._id === id &&
      partner?.companyNameGe === initialData?.companyNameGe;
    if (haveServerData) return;

    const controller = new AbortController();

    const fetchPartner = async () => {
      setIsLoading(true);
      try {
        const data = await getPartnerById(id, controller.signal);
        if (controller.signal.aborted) return;
        setPartner(data);

        if (data.productCount !== undefined) {
          setProductCount(data.productCount);
        } else {
          try {
            const prodRes = await getProducts(
              { partnerId: id, limit: 1 },
              controller.signal,
            );
            if (!controller.signal.aborted) {
              setProductCount(prodRes.meta.totalCount);
            }
          } catch (pErr) {
            if (!controller.signal.aborted) {
              console.warn("Could not fetch fallback product count:", pErr);
            }
          }
        }
      } catch (err: unknown) {
        if (controller.signal.aborted) return;
        console.error("Failed to fetch partner details", err);
        setError(
          tPages("partner_profile.error_not_found") ||
            "პარტნიორი არ მოიძებნა ან წვდომა შეზღუდულია",
        );
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    if (id) fetchPartner();

    return () => controller.abort();
  }, [id, lang, initialData, partner?._id, partner?.companyNameGe]);

  if (isLoading) return <ProfileSkeleton />;
  if (error || !partner) return <ProfileError message={error} />;

  // ── Localised fields ──────────────────────────────────────
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

  const hasSocials =
    partner.website || partner.facebook || partner.instagram || partner.tiktok;

  return (
    <div className="partner-profile">
      <div className="partner-profile__container">
        {/* ── BREADCRUMB ───────────────────────────────────── */}
        <nav className="partner-profile__breadcrumb" aria-label="breadcrumb">
          <Link href="/partners">
            {Icon.arrowLeft}
            {tCommon("back") || "პარტნიორები"}
          </Link>
        </nav>

        <div className="partner-profile__layout">
          {/* ── LEFT: IMAGE ───────────────────────────────── */}
          <div className="partner-profile__image-side">
            <div className="partner-profile__main-photo-wrapper">
              {partner.profilePhoto ? (
                <img
                  src={partner.profilePhoto}
                  alt={name}
                  className="partner-profile__main-photo"
                />
              ) : (
                <div className="partner-profile__photo-placeholder">
                  {name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT: INFO CARD ───────────────────────────── */}
          <div className="partner-profile__info-side">
            <div className="partner-profile__card">
              <header className="partner-profile__header">
                <h1 className="partner-profile__name">{name}</h1>
              </header>

              <div className="partner-profile__meta-list">
                {(city || address) && (
                  <div className="partner-profile__meta-item">
                    <span className="meta-icon">{Icon.mapPin}</span>
                    <span className="meta-text">
                      {city && `${city}, `}
                      {address}
                    </span>
                  </div>
                )}

                {partner.email && (
                  <div className="partner-profile__meta-item">
                    <span className="meta-icon">{Icon.mail}</span>
                    <span className="meta-text">
                      <a href={`mailto:${partner.email}`}>{partner.email}</a>
                    </span>
                  </div>
                )}

                {partner.phone && (
                  <div className="partner-profile__meta-item">
                    <span className="meta-icon">{Icon.phone}</span>
                    <span className="meta-text">
                      <a href={`tel:${partner.phone}`}>
                        {partner.phone}
                      </a>
                    </span>
                  </div>
                )}

                <div className="partner-profile__meta-item">
                  <span className="meta-icon">{Icon.shoppingBag}</span>
                  <span className="meta-text">
                    {productCount} {tCommon("products.available")}
                  </span>
                </div>
              </div>

              <section className="partner-profile__section">
                <h2 className="partner-profile__section-title">
                  {tPages("partner_profile.about_us") || "About"}
                </h2>
                <div className="partner-profile__description-text">
                  {description ? (
                    <p>{description}</p>
                  ) : (
                    <p className="no-data">
                      {tPages("partner_profile.no_description") ||
                        "No description available."}
                    </p>
                  )}
                </div>
              </section>

              {hasSocials && (
                <section className="partner-profile__section">
                  <h2 className="partner-profile__section-title">
                    {tPages("socials_title")}
                  </h2>
                  <div className="partner-profile__socials">
                    {partner.website && (
                      <SocialLink url={partner.website} type="website" />
                    )}
                    {partner.facebook && (
                      <SocialLink url={partner.facebook} type="facebook" />
                    )}
                    {partner.instagram && (
                      <SocialLink url={partner.instagram} type="instagram" />
                    )}
                    {partner.tiktok && (
                      <SocialLink url={partner.tiktok} type="tiktok" />
                    )}
                  </div>
                </section>
              )}

              {/* <footer className="partner-profile__actions">
                <a
                  href={`mailto:${partner.email}`}
                  className="partner-profile__contact-btn"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  {tPages("partner_profile.contact_btn") || "Contact Artisan"}
                </a>
              </footer> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
