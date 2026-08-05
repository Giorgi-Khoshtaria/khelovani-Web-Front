"use client";

import { useRef, useState, useCallback } from "react";
import Image from "next/image";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import "./aboutTestimonials.scss";

interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  location: string;
  partnerSince: string;
  image: string;
}

// mock content — swap for real partner testimonials later
const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    quote:
      "Before Khelovani I sold at two fairs a year. Now work leaves the studio every week — and people write to ask how it was fired.",
    name: "Nino Ch.",
    role: "Ceramicist",
    location: "Tbilisi",
    partnerSince: "2023",
    image: "/assets/placeholder/embroidery.png",
  },
  {
    id: "2",
    quote:
      "I used to price things by guessing. Now I set my own prices and see exactly what sells — no middleman explaining my own craft back to me.",
    name: "Levan T.",
    role: "Woodworker",
    location: "Kutaisi",
    partnerSince: "2022",
    image: "/assets/placeholder/woodwork.png",
  },
  {
    id: "3",
    quote:
      "My grandmother wove felt her whole life and nobody outside our village knew her name. My work travels with mine attached to it now.",
    name: "Ketevan M.",
    role: "Felt maker",
    location: "Tusheti",
    partnerSince: "2023",
    image: "/assets/placeholder/feltwork.png",
  },
];

export default function AboutTestimonials() {
  const { t } = useClientTranslation("pages");
  const { t: tNav } = useClientTranslation("navigation");
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const maxIndex = TESTIMONIALS.length - 1;

  const applyTranslate = useCallback((i: number) => {
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(-${i * 100}%)`;
    }
  }, []);

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

  const touchStartX = useRef(0);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
  };

  if (TESTIMONIALS.length === 0) return null;

  return (
    <section className="about-testimonials">
      <button
        type="button"
        className="about-testimonials__arrow about-testimonials__arrow--prev"
        onClick={prev}
        disabled={index === 0}
        aria-label={tNav("previous")}
      >
        <svg width="16" height="16" viewBox="0 0 14 14" fill="none" aria-hidden="true">
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
        type="button"
        className="about-testimonials__arrow about-testimonials__arrow--next"
        onClick={next}
        disabled={index === maxIndex}
        aria-label={tNav("next")}
      >
        <svg width="16" height="16" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path
            d="M5 2 10 7l-5 5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div
        className="about-testimonials__viewport"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="about-testimonials__track" ref={trackRef}>
          {TESTIMONIALS.map((item) => (
            <div key={item.id} className="about-testimonials__slide">
              <div className="about-testimonials__text">
                <span className="about-testimonials__eyebrow">
                  {t("about.testimonials_eyebrow")}
                </span>
                <blockquote className="about-testimonials__quote">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
                <div className="about-testimonials__attribution">
                  <span className="about-testimonials__name">{item.name}</span>
                  <span className="about-testimonials__meta">
                    {item.role.toUpperCase()} · {item.location.toUpperCase()} ·{" "}
                    {t("about.testimonials_since")} {item.partnerSince}
                  </span>
                </div>
              </div>

              <div className="about-testimonials__media">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="about-testimonials__img"
                  sizes="(max-width: 900px) 100vw, 45vw"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
