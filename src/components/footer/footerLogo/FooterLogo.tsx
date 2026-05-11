"use client";

import Image from "next/image";
import Link from "next/link";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import "./FooterLogo.scss";

export default function FooterLogo() {
  const { t } = useClientTranslation("pages");

  const tagline = t("footer.logo_description");
  const finalTagline =
    tagline === "footer.logo_description"
      ? "A marketplace for independent Georgian craft. Connecting makers with people who care where their things come from."
      : tagline;

  return (
    <div className="khelovani-footer__column khelovani-footer__column--logo">
      <Link href="/" className="khelovani-footer__logo-link" aria-label="Khelovani">
        <Image
          src="/assets/logo.png"
          alt="Khelovani"
          width={150}
          height={50}
          className="khelovani-footer__logo-mark"
          priority
        />
      </Link>
      <p className="khelovani-footer__tagline">{finalTagline}</p>
    </div>
  );
}
