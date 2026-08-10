"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAuth } from "@/contexts/AuthContext";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import { submitPartnerReview } from "@/apiCalls/partnerRequests/review.req";
import {
  REVIEW_COMMENT_MAX,
  REVIEW_COMMENT_MIN,
  validatePartnerReviewForm,
} from "@/lib/validations/partnerReviewValidations";
import type { MyReview } from "@/lib/types/reviewTypes";

export interface ReviewErrors {
  rating?: string;
  comment?: string;
}

interface Params {
  partnerId: string;
  initialReview?: MyReview | null;
  onClose: () => void;
  onSaved: () => void;
}

/**
 * Drives the "Rate artisan" modal: star + comment state, translated validation
 * and the submit call. Rating requires a logged-in user (the cookie carries the
 * identity) — guests are sent to login. Submitting again replaces the visitor's
 * previous review rather than adding a second one.
 */
export const useRatePartner = ({
  partnerId,
  initialReview = null,
  onClose,
  onSaved,
}: Params) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { t: tAlerts } = useClientTranslation("alerts");

  const [rating, setRatingState] = useState(initialReview?.rating ?? 0);
  const [comment, setCommentState] = useState(initialReview?.comment ?? "");
  const [errors, setErrors] = useState<ReviewErrors>({});
  const [saving, setSaving] = useState(false);

  const setRating = (value: number) => {
    setRatingState(value);
    if (errors.rating) setErrors((p) => ({ ...p, rating: undefined }));
  };

  const setComment = (value: string) => {
    setCommentState(value.slice(0, REVIEW_COMMENT_MAX));
    if (errors.comment) setErrors((p) => ({ ...p, comment: undefined }));
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      toast.info(tAlerts("login_required") || "გთხოვთ, გაიაროთ ავტორიზაცია");
      router.push("/login");
      return;
    }

    const found = validatePartnerReviewForm({ rating, comment: comment.trim() });
    if (Object.keys(found).length) {
      setErrors(found);
      return;
    }

    setSaving(true);
    try {
      await submitPartnerReview(partnerId, { rating, comment: comment.trim() });
      toast.success(tAlerts("review_saved") || "თქვენი შეფასება შენახულია");
      onSaved();
      onClose();
    } catch {
      setSaving(false);
      toast.error(tAlerts("review_failed") || "შეფასება ვერ შენახულია");
    }
  };

  return {
    rating,
    comment,
    errors,
    saving,
    isEditing: Boolean(initialReview),
    charCount: comment.length,
    maxChars: REVIEW_COMMENT_MAX,
    canSubmit: rating > 0 && comment.trim().length >= REVIEW_COMMENT_MIN,
    setRating,
    setComment,
    handleSubmit,
  };
};
