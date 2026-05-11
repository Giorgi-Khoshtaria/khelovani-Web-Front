import React from "react";
import "./Footer.scss";
import FooterLogo from "./footerLogo/FooterLogo";
import FooterNavigation from "./footerNavigation/FooterNavigation";
import FooterCategories from "./footerCategories/FooterCategories";
import FooterHelp from "./footerHelp/FooterHelp";
import FooterSocials from "./footerSocials/FooterSocials";
import FooterCopyright from "./footerCopyright/FooterCopyright";

export default async function Footer() {
  return (
    <footer className="khelovani-footer">
      <div className="khelovani-footer__container">
        <div className="khelovani-footer__top">
          <FooterLogo />
          <FooterNavigation />
          <FooterCategories />
          <FooterHelp />
        </div>
        <div className="khelovani-footer__bottom-row">
          <FooterCopyright />
          <FooterSocials />
        </div>
      </div>
    </footer>
  );
}
