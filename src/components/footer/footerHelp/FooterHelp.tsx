"use client";

import Link from "next/link";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import "./FooterHelp.scss";

export default function FooterHelp() {
  const { t } = useClientTranslation("pages");
  const { t: tNav } = useClientTranslation("navigation");

  const title = t("footer.help_title") || "Help";

  return (
    <div className="khelovani-footer__column">
      <h4 className="khelovani-footer__title">{title}</h4>
      <ul className="khelovani-footer__list">
        <li>
          <Link href="/become-partner">{tNav("become_partner")}</Link>
        </li>
        <li>
          <Link href="/terms">{t("footer.help.terms") || "Terms"}</Link>
        </li>
        <li>
          <Link href="/privacy">
            {t("footer.help.privacy_policy") || "Privacy policy"}
          </Link>
        </li>
      </ul>
    </div>
  );
}
