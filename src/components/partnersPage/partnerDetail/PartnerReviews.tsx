"use client";

import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import { Icon } from "@/lib/icons/icons";
import type { PartnerReview, PartnerReviewsProps } from "@/lib/types/reviewTypes";
import PartnerPagination from "../partnerListing/PartnerPagination/PartnerPagination";
import "./partnerReviews.scss";

const STARS = [1, 2, 3, 4, 5];

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

function ReviewStars({ rating }: { rating: number }) {
  return (
    <span className="partner-reviews__stars" aria-label={`${rating}/5`}>
      {STARS.map((s) => (
        <span
          key={s}
          className={`partner-reviews__star${s <= rating ? " partner-reviews__star--on" : ""}`}
          aria-hidden="true"
        >
          {s <= rating ? Icon.starFilled : Icon.star}
        </span>
      ))}
    </span>
  );
}

/** Public list of a partner's reviews, rendered under the "about" card. */
export default function PartnerReviews({
  reviews,
  summary,
  myReviewId,
  isLoading,
  page,
  totalPages,
  onPageChange,
}: PartnerReviewsProps) {
  const { t: tPages } = useClientTranslation("pages");
  const { t: tCommon } = useClientTranslation("common");
  const { lang } = useLanguage();
  const isGe = lang === "ge";

  const authorName = (review: PartnerReview) =>
    (isGe ? review.user?.nameGe : review.user?.nameEn) ||
    review.user?.nameEn ||
    review.user?.nameGe ||
    (isGe ? "მომხმარებელი" : "Customer");

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(isGe ? "ka-GE" : "en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <section className="partner-reviews">
      <div className="partner-reviews__head">
        <span className="partner-reviews__eyebrow">
          {tPages("partner_profile.reviews_title") ||
            (isGe ? "შეფასებები" : "Reviews")}
        </span>
        {summary.total > 0 && (
          <span className="partner-reviews__summary">
            <ReviewStars rating={Math.round(summary.average)} />
            <strong>
              {Math.round(summary.average)}
              <span className="partner-reviews__scale">/5</span>
            </strong>
            <span className="partner-reviews__count">({summary.total})</span>
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="partner-reviews__skeletons">
          {[0, 1].map((i) => (
            <div key={i} className="partner-reviews__skeleton" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <p className="partner-reviews__empty">
          {tPages("partner_profile.reviews_empty") ||
            (isGe ? "ჯერ შეფასება არ არის — იყავით პირველი" : "No reviews yet — be the first")}
        </p>
      ) : (
        <>
          <ul className="partner-reviews__list">
            {reviews.map((review) => (
              <li key={review._id} className="partner-reviews__item">
                <div className="partner-reviews__avatar" aria-hidden="true">
                  {initialsOf(authorName(review))}
                </div>
                <div className="partner-reviews__content">
                  <div className="partner-reviews__meta">
                    <span className="partner-reviews__author">
                      {authorName(review)}
                    </span>
                    {myReviewId === review._id && (
                      <span className="partner-reviews__badge">
                        {tPages("partner_profile.reviews_your_badge") ||
                          (isGe ? "თქვენი შეფასება" : "Your review")}
                      </span>
                    )}
                    <span className="partner-reviews__date">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                  <ReviewStars rating={review.rating} />
                  <p className="partner-reviews__comment">{review.comment}</p>
                </div>
              </li>
            ))}
          </ul>

          <PartnerPagination
            page={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
            prevLabel={tCommon("listing.prev") || (isGe ? "წინა" : "Prev")}
            nextLabel={tCommon("listing.next") || (isGe ? "შემდეგი" : "Next")}
          />
        </>
      )}
    </section>
  );
}
