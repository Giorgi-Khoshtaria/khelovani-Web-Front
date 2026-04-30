"use client";

import { useRef } from "react";
import "./popularPartners.scss";
import Link from "next/link";
import { Partner } from "@/lib/types/partnerTypes";
import PartnerCard from "@/components/partnersPage/partnerListing/PartnerCard/PartnerCard";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import { useRevealOnScroll } from "@/lib/hooks/useRevealOnScroll";

function PopularPartners({
  PinnedPartners,
}: {
  PinnedPartners: { data?: Partner[] } | Partner[];
}) {
  const { t: Pages } = useClientTranslation("pages");
  const { t: Nav } = useClientTranslation("navigation");

  const sectionRef = useRef<HTMLElement>(null);

  useRevealOnScroll({
    ref: sectionRef,
  });

  const partnersArray = Array.isArray(PinnedPartners)
    ? PinnedPartners
    : PinnedPartners?.data || [];

  if (partnersArray.length === 0) {
    return null;
  }

  return (
    <section className="popular-partners" ref={sectionRef}>
      <div className="popular-partners__header">
        <h2 className="popular-partners__title">
          {Pages("home.popular-Partners_title")}
        </h2>

        <Link href="/partners" className="popular-partners__view-all">
          {Nav("view_all")}
        </Link>
      </div>

      <div className="popular-partners__grid">
        {partnersArray.map((partner) => (
          <div key={partner._id} className="popular-partners__item">
            <PartnerCard partner={partner} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default PopularPartners;
