"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import Link from "next/link";
import "./partnerListing.scss";

interface Partner {
  _id: string;
  companyNameGe: string;
  companyNameEn: string;
  city: string;
  address: string;
  addressEn: string;
  profilePhoto?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  website?: string;
}

interface PaginatedResponse {
  data: Partner[];
  currentPage: number;
  totalPages: number;
  totalPartners: number;
}

const SVGS = {
  website: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  facebook: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
  instagram: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>,
  tiktok: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4h3.5c.8 2.7 3 4.5 5.5 4.5v3c-1.5 0-3-.5-4-1.5v6a8 8 0 1 1-8-8v3a5 5 0 0 0 4 4z"/></svg>
};

const SocialLink = ({ url, type }: { url?: string, type: keyof typeof SVGS }) => {
  if (!url) return null;
  const href = url.startsWith('http') ? url : `https://${url}`;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {SVGS[type]}
    </a>
  );
};

export default function PartnerListing() {
  const { lang } = useLanguage();
  const { t: tPages } = useClientTranslation("pages");
  const { t: tCommon } = useClientTranslation("common");
  const [partners, setPartners] = useState<Partner[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset page on new search
    }, 500);

    return () => clearTimeout(handler);
  }, [search]);

  // Fetch partners
  useEffect(() => {
    const fetchPartners = async () => {
      setIsLoading(true);
      try {
        const res = await api.get<PaginatedResponse>("/api/partner", {
          params: { search: debouncedSearch, page, limit: 12 },
        });
        setPartners(res.data.data);
        setTotalPages(res.data.totalPages);
      } catch (error) {
        console.error("Failed to fetch partners", error);
        setPartners([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPartners();
  }, [debouncedSearch, page]);

  return (
    <div className="partner-listing">
      <div className="partner-listing__header">
        <div className="partner-listing__search">
          <svg className="partner-listing__search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            className="partner-listing__search-input"
            type="text"
            placeholder={tPages("partner_listing.search_placeholder") || "მოძებნეთ პარტნიორი..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="partner-listing__loading">
          {tCommon("loading") || "იტვირთება..."}
        </div>
      ) : partners.length > 0 ? (
        <>
          <div className="partner-listing__grid">
            {partners.map((partner) => (
              <div key={partner._id} className="partner-listing__card">
                <div className="partner-listing__card-image">
                  {partner.profilePhoto ? (
                    <img src={partner.profilePhoto} alt={partner.companyNameGe} />
                  ) : (
                    <div className="partner-listing__card-placeholder">
                      {(lang === "ge" ? partner.companyNameGe : partner.companyNameEn).charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                
                <div className="partner-listing__card-content">
                  <h3 className="partner-listing__name">
                    {lang === "ge" ? partner.companyNameGe : partner.companyNameEn}
                  </h3>
                  
                  {(partner.city || partner.address) && (
                    <p className="partner-listing__location">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      {partner.city ? partner.city.charAt(0).toUpperCase() + partner.city.slice(1) + ", " : ""}
                      {lang === "ge" ? partner.address : (partner.addressEn || partner.address)}
                    </p>
                  )}
                  
                  <div className="partner-listing__socials">
                    <SocialLink url={partner.website} type="website" />
                    <SocialLink url={partner.facebook} type="facebook" />
                    <SocialLink url={partner.instagram} type="instagram" />
                    <SocialLink url={partner.tiktok} type="tiktok" />
                  </div>

                  <Link href={`/partners/${partner._id}`} className="partner-listing__link">
                    {tPages("partner_listing.view_profile") || "პროფილის ნახვა"}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="partner-listing__pagination">
              <button 
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                {tPages("partner_listing.prev") || "წინა"}
              </button>
              <span>{page} / {totalPages}</span>
              <button 
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                {tPages("partner_listing.next") || "შემდეგი"}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="partner-listing__empty">
          {tPages("partner_listing.no_partners_found") || "პარტნიორები არ მოიძებნა"}
        </div>
      )}
    </div>
  );
}
