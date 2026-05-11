"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import "./popularPartners.scss";
import Image from "next/image";
import Link from "next/link";
import { Partner } from "@/lib/types/partnerTypes";
import PartnerCard from "@/components/partnersPage/partnerListing/PartnerCard/PartnerCard";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import { useRevealOnScroll } from "@/lib/hooks/useRevealOnScroll";

const GAP = 24;

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

  // compute slide width from actual DOM so it works on all screen sizes
  const getSlideWidth = useCallback(() => {
    const firstSlide = trackRef.current?.children[0] as HTMLElement | undefined;
    return firstSlide ? firstSlide.offsetWidth + GAP : 364;
  }, []);

  const applyTranslate = useCallback((i: number) => {
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(-${i * getSlideWidth()}px)`;
    }
  }, [getSlideWidth]);

  const prev = useCallback(() => {
    setIndex((i) => {
      const next = Math.max(0, i - 1);
      applyTranslate(next);
      return next;
    });
  }, [applyTranslate]);

  const next = useCallback(() => {
    setIndex((i) => {
      const next = Math.min(maxIndex, i + 1);
      applyTranslate(next);
      return next;
    });
  }, [maxIndex, applyTranslate]);

  // re-apply translate on resize, clamp index when visible count shrinks
  useEffect(() => {
    const clamped = Math.min(index, maxIndex);
    if (clamped !== index) setIndex(clamped);
    applyTranslate(clamped);
  }, [index, maxIndex, applyTranslate]);

  // touch swipe
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
      <div className="pop-partners__header">
        <h2 className="pop-partners__title">
          {t("home.popular-Partners_title")}
        </h2>

        <div className="pop-partners__controls">
          <button
            className="pop-partners__arrow"
            onClick={prev}
            disabled={index === 0}
            aria-label={tNav("previous")}
          >
            <Image
              src="/assets/arrow-left-solid-full.svg"
              width={16}
              height={16}
              alt=""
              aria-hidden="true"
            />
          </button>
          <button
            className="pop-partners__arrow"
            onClick={next}
            disabled={index >= maxIndex}
            aria-label={tNav("next")}
          >
            <Image
              src="/assets/arrow-left-solid-full.svg"
              width={16}
              height={16}
              alt=""
              aria-hidden="true"
              style={{ transform: "rotate(180deg)" }}
            />
          </button>
          <Link href="/partners" className="pop-partners__view-all">
            {tNav("view_all")} →
          </Link>
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
