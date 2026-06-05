"use client";

import Link from "next/link";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import { Icon } from "@/lib/icons/icons";
import "./backToPartners.scss";

/** Pill link back to the partners listing. */
export default function BackToPartners() {
  const { t: tPages } = useClientTranslation("pages");
  const { lang } = useLanguage();
  const isGe = lang === "ge";

  return (
    <Link href="/partners" className="back-to-partners">
      {Icon.arrowLeft}
      <span>
        {tPages("partner_profile.back_to_partners") ||
          (isGe ? "უკან" : "Back to partners")}
      </span>
    </Link>
  );
}
