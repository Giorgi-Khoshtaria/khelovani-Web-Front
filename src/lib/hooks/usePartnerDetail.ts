"use client";

import { useEffect, useState } from "react";
import { getPartnerById } from "@/apiCalls/partnerRequests/partner.req";
import { getProducts } from "@/apiCalls/productRequests/product.req";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Partner } from "@/lib/types/partnerTypes";

export interface PartnerDetailState {
  partner: Partner | null;
  productCount: number;
  isLoading: boolean;
  error: boolean;
  lang: string;
}

/**
 * Loads a single partner (skips the fetch when SSR already provided the data)
 * and resolves a product count for the "N products available" line.
 */
export const usePartnerDetail = (
  id: string,
  initialData: Partner | null,
  serverLang?: string,
): PartnerDetailState => {
  const { lang: clientLang } = useLanguage();
  const lang = serverLang || clientLang;

  const [partner, setPartner] = useState<Partner | null>(initialData);
  const [productCount, setProductCount] = useState<number>(
    initialData?.productCount || 0,
  );
  const [isLoading, setIsLoading] = useState(!initialData);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (initialData?._id === id && partner?._id === id) return;

    const controller = new AbortController();

    (async () => {
      setIsLoading(true);
      try {
        const data = await getPartnerById(id, controller.signal);
        if (controller.signal.aborted) return;
        setPartner(data);
        if (data.productCount !== undefined) {
          setProductCount(data.productCount);
        } else {
          try {
            const res = await getProducts(
              { partnerId: id, limit: 1 },
              controller.signal,
            );
            if (!controller.signal.aborted) setProductCount(res.meta.totalCount);
          } catch {
            /* non-fatal */
          }
        }
      } catch {
        if (!controller.signal.aborted) setError(true);
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    })();

    return () => controller.abort();
  }, [id, initialData, partner?._id]);

  return { partner, productCount, isLoading, error, lang };
};

/** Localised partner fields for the active language. */
export const localizePartner = (partner: Partner, lang: string) => {
  const isGe = lang === "ge";
  return {
    name: isGe ? partner.companyNameGe : partner.companyNameEn,
    description: isGe
      ? partner.description
      : partner.descriptionEn || partner.description,
    address: isGe ? partner.address : partner.addressEn || partner.address,
    city: partner.city
      ? partner.city.charAt(0).toUpperCase() + partner.city.slice(1)
      : "",
  };
};
