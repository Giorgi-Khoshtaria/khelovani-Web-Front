import { z } from "zod";
import { parseForm, type FormErrors } from "./shared/zodHelpers";

export const REVIEW_COMMENT_MIN = 10;
export const REVIEW_COMMENT_MAX = 600;

/**
 * Mirrors the backend schema at
 * src/validations/schemas/review/review.schema.ts — same rules, same keys.
 */
export const partnerReviewSchema = z
  .object({
    rating: z
      .number()
      .int("rating_invalid")
      .min(1, "rating_required")
      .max(5, "rating_invalid"),
    comment: z
      .string()
      .trim()
      .min(REVIEW_COMMENT_MIN, "review_comment_too_short")
      .max(REVIEW_COMMENT_MAX, "review_comment_too_long"),
  })
  .strict();

export type PartnerReviewFormData = z.infer<typeof partnerReviewSchema>;

export const validatePartnerReviewForm = (
  data: PartnerReviewFormData,
): FormErrors => parseForm(partnerReviewSchema, data);
