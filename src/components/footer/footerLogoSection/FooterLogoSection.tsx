import React from "react";
import Image from "next/image";
import "./FooterLogoSection.scss";

function FooterLogoSection() {
  return (
    <div className="footer-logo-section">
      <div className="footer-logo-section__logo">
        <Image
          src="/assets/logo.svg" // ← Change this to your actual logo path
          alt="Khelovani Logo"
          width={180}
          height={60}
          priority
        />
      </div>

      <p className="footer-logo-section__text">
        Celebrating Georgia’s rich artisan heritage through exceptional
        craftsmanship.
      </p>
    </div>
  );
}

export default FooterLogoSection;
