"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import "./FooterLogo.scss";

export default function FooterLogo() {
  const { t } = useClientTranslation("pages");

  const logoDesc = t("footer.logo_description");
  const finalLogoDesc =
    logoDesc === "footer.logo_description"
      ? "Celebrating Georgian artisan heritage through exceptional craftsmanship."
      : logoDesc;

  return (
    <div className="khelovani-footer__column khelovani-footer__column--logo">
      <div className="khelovani-footer__logo">
        <Link href="/">
          <Image
            src="/assets/logo.png"
            alt="Khelovani Logo"
            width={150}
            height={50}
            priority
          />
        </Link>
      </div>
      <p className="khelovani-footer__text">{finalLogoDesc}</p>
    </div>
  );
}
