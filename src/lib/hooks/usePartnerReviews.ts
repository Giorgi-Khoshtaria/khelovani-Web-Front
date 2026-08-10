"use client";

import { useCallback, useEffect, useState } from "react";
import { getPartnerReviews } from "@/apiCalls/partnerRequests/review.req";
import type {
  MyReview,
  PartnerReview,
  ReviewSummary,
} from "@/lib/types/reviewTypes";

const PAGE_SIZE = 3;

const EMPTY_SUMMARY: ReviewSummary = {
  average: 0,
  total: 0,
  breakdown: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 },
};

/**
 * Loads a partner's public reviews one page at a time — each page replaces the
 * previous one rather than appending.
 *
 * The same request returns `meta.myReview` when the visitor is logged in, so
 * the hero button and the rate modal know whether this is a create or an edit
 * without a second round trip.
 */
export const usePartnerReviews = (partnerId: string) => {
  const [reviews, setReviews] = useState<PartnerReview[]>([]);
  const [summary, setSummary] = useState<ReviewSummary>(EMPTY_SUMMARY);
  const [myReview, setMyReview] = useState<MyReview | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(
    async (targetPage: number, signal?: AbortSignal) => {
      setIsLoading(true);
      try {
        const res = await getPartnerReviews(
          partnerId,
          { page: targetPage, limit: PAGE_SIZE },
          signal,
        );
        if (signal?.aborted) return;

        setReviews(res.data);
        setSummary(res.meta.summary ?? EMPTY_SUMMARY);
        setMyReview(res.meta.myReview ?? null);
        setTotalPages(res.meta.totalPages || 1);
        setPage(res.meta.currentPage || targetPage);
      } catch {
        // Non-fatal — the partner page still renders without its reviews.
        if (!signal?.aborted) setReviews([]);
      } finally {
        if (!signal?.aborted) setIsLoading(false);
      }
    },
    [partnerId],
  );

  useEffect(() => {
    const controller = new AbortController();
    void load(1, controller.signal);
    return () => controller.abort();
  }, [load]);

  const goToPage = (target: number) => {
    const next = Math.min(Math.max(1, target), totalPages);
    if (next !== page) void load(next);
  };

  return {
    reviews,
    summary,
    myReview,
    isLoading,
    page,
    totalPages,
    goToPage,
    /** Back to page 1 after the visitor saves their own review. */
    refresh: () => load(1),
  };
};
