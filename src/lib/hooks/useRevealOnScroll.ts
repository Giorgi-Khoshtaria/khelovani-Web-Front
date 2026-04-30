"use client";

import { RefObject, useEffect } from "react";

type UseRevealOnScrollProps = {
  ref: RefObject<HTMLElement | HTMLDivElement | null>;
  className?: string;
  threshold?: number;
  rootMargin?: string;
};

export function useRevealOnScroll({
  ref,
  className = "is-visible",
  threshold = 0.25,
  rootMargin = "0px 0px -120px 0px",
}: UseRevealOnScrollProps) {
  useEffect(() => {
    const el = ref.current;

    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add(className);
          observer.unobserve(el);
        }
      },
      {
        threshold,
        rootMargin,
      },
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [ref, className, threshold, rootMargin]);
}
