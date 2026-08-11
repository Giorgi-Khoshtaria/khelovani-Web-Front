"use client";

import { useCallback, useEffect, useState } from "react";

// Matches the sticky TOC's `top` offset in policyContent.scss, plus a
// little breathing room so a scrolled-to heading isn't flush to the edge.
const SCROLL_OFFSET = 120;

/**
 * Tracks which section is currently in view on the page (no inner scroll
 * container — the left TOC is sticky and rides the page's own scroll), and
 * exposes a scrollToSection that smooth-scrolls the window to it.
 */
export function usePolicyScrollSpy(sectionIds: string[]) {
  const [activeId, setActiveId] = useState<string>(sectionIds[0] ?? "");
  const idsKey = sectionIds.join("|");

  useEffect(() => {
    if (sectionIds.length === 0) return;
    setActiveId(sectionIds[0]);

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { threshold: 0, rootMargin: `-${SCROLL_OFFSET}px 0px -65% 0px` },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey]);

  const scrollToSection = useCallback((id: string) => {
    const target = document.getElementById(id);
    if (!target) return;

    const top = target.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
    window.scrollTo({ top: Math.max(top, 0), behavior: "smooth" });
    setActiveId(id);
  }, []);

  return { activeId, scrollToSection };
}
