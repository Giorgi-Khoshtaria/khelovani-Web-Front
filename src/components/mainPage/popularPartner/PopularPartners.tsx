"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import "./popularPartners.scss";
import Link from "next/link";
import { Partner } from "@/lib/types/partnerTypes";
import PartnerCard from "@/components/partnersPage/partnerListing/PartnerCard/PartnerCard";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import { useRevealOnScroll } from "@/lib/hooks/useRevealOnScroll";

const GAP = 12;

function getVisibleCount(width: number): number {
  if (width <= 540) return 1;
  if (width <= 860) return 2;
  if (width <= 1200) return 3;
  return 4;
}

function PopularPartners({
  PinnedPartners,
}: {
  PinnedPartners: { data?: Partner[] } | Partner[];
}) {
  const { t } = useClientTranslation("pages");
  const { t: tNav } = useClientTranslation("navigation");
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(4);

  useRevealOnScroll({ ref: sectionRef });

  useEffect(() => {
    const update = () => setVisible(getVisibleCount(window.innerWidth));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const partnersArray = Array.isArray(PinnedPartners)
    ? PinnedPartners
    : PinnedPartners?.data || [];

  if (partnersArray.length === 0) return null;

  const maxIndex = Math.max(0, partnersArray.length - visible);

  const getSlideWidth = useCallback(() => {
    const firstSlide = trackRef.current?.children[0] as HTMLElement | undefined;
    return firstSlide ? firstSlide.offsetWidth + GAP : 364;
  }, []);

  const applyTranslate = useCallback(
    (i: number) => {
      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(-${i * getSlideWidth()}px)`;
      }
    },
    [getSlideWidth],
  );

  const prev = useCallback(() => {
    setIndex((i) => {
      const n = Math.max(0, i - 1);
      applyTranslate(n);
      return n;
    });
  }, [applyTranslate]);

  const next = useCallback(() => {
    setIndex((i) => {
      const n = Math.min(maxIndex, i + 1);
      applyTranslate(n);
      return n;
    });
  }, [maxIndex, applyTranslate]);

  useEffect(() => {
    const clamped = Math.min(index, maxIndex);
    if (clamped !== index) setIndex(clamped);
    applyTranslate(clamped);
  }, [index, maxIndex, applyTranslate]);

  const touchStartX = useRef(0);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
  };

  return (
    <section className="pop-partners" ref={sectionRef}>
      <div className="pop-partners__container">
        <div className="pop-partners__header">
          <div className="pop-partners__heading">
            <h2 className="pop-partners__title">
              {t("home.popular-Partners_title")}
            </h2>
            <p className="pop-partners__subtitle">
              {t("home.popularPartners._subtitle")}
            </p>
          </div>

          <div className="pop-partners__controls">
            <button
              className="pop-partners__arrow"
              onClick={prev}
              disabled={index === 0}
              aria-label={tNav("previous")}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M9 2 4 7l5 5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              className="pop-partners__arrow"
              onClick={next}
              disabled={index >= maxIndex}
              aria-label={tNav("next")}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M5 2 10 7l-5 5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <Link href="/partners" className="pop-partners__view-all">
              {tNav("view_all")}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>

      <div
        className="pop-partners__viewport"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="pop-partners__track" ref={trackRef}>
          {partnersArray.map((partner, i) => (
            <div key={partner._id} className="pop-partners__slide">
              <PartnerCard partner={partner} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PopularPartners;
