// ─── Partner reviews ──────────────────────────────────────────────────────────

/** The author as returned by the public list — never carries an email. */
export interface ReviewAuthor {
  _id: string;
  nameGe?: string;
  nameEn?: string;
  profileImage?: string | null;
}

export interface PartnerReview {
  _id: string;
  user: ReviewAuthor;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

/** The logged-in visitor's own review, used to prefill the modal for editing. */
export interface MyReview {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewSummary {
  average: number;
  total: number;
  /** Visible review count per star value, keyed "1".."5". */
  breakdown: Record<string, number>;
}

export interface ReviewPayload {
  rating: number;
  comment: string;
}

export interface PaginatedReviewResponse {
  data: PartnerReview[];
  meta: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    summary: ReviewSummary;
    myReview: MyReview | null;
  };
}

// ─── Component props ──────────────────────────────────────────────────────────

export interface StarRatingInputProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  /** Rendered as the radiogroup's accessible name. */
  label: string;
}

export interface RatePartnerModalProps {
  partnerId: string;
  name: string;
  initials: string;
  /** Present when the visitor already rated this partner — switches to edit. */
  initialReview?: MyReview | null;
  onClose: () => void;
  onSaved: () => void;
}

export interface PartnerReviewsProps {
  reviews: PartnerReview[];
  summary: ReviewSummary;
  myReviewId?: string;
  isLoading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
