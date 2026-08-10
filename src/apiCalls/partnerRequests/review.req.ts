import api from "@/apiCalls/api";
import type {
  PaginatedReviewResponse,
  ReviewPayload,
} from "@/lib/types/reviewTypes";

export interface GetPartnerReviewsParams {
  page?: number;
  limit?: number;
}

/**
 * Public, paginated list of a partner's visible reviews. When the visitor is
 * logged in the cookie travels with the request and `meta.myReview` comes back
 * populated, so the rate modal can prefill for editing without a second call.
 */
export const getPartnerReviews = async (
  id: string,
  params?: GetPartnerReviewsParams,
  signal?: AbortSignal,
): Promise<PaginatedReviewResponse> => {
  const response = await api.get(`/api/partner/${id}/reviews`, {
    params,
    signal,
  });
  return { data: response.data.data, meta: response.data.meta };
};

/**
 * Create or edit the logged-in user's review of a partner — one per user, so
 * re-submitting replaces the previous one. Throws so the caller can toast.
 */
export const submitPartnerReview = async (
  id: string,
  payload: ReviewPayload,
): Promise<void> => {
  await api.post(`/api/partner/${id}/reviews`, payload);
};
