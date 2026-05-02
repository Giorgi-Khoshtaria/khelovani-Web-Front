"use client";

import React from "react";
import Link from "next/link";
import { useMenu } from "@/contexts/MenuContext";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import "./FooterNavigation.scss";

export default function FooterNavigation() {
  const { menuItems } = useMenu();
  const { lang } = useLanguage();
  const { t } = useClientTranslation("pages");

  const title = t("footer.navigation_title") || "Quick Links";
  const currentLang = lang.toLowerCase() as "ge" | "en";
  const langKey = currentLang === "ge" ? "ka" : "en";
  
  // Sort menu items by order
  const sortedItems = [...menuItems].sort((a, b) => a.order - b.order);

  return (
    <div className="khelovani-footer__column">
      <h4 className="khelovani-footer__title">{title}</h4>
      <ul className="khelovani-footer__list">
        {sortedItems.map((item) => (
          <li key={item._id}>
            <Link href={item.href}>
              {item.label?.[langKey] || item.label?.ka || item.href}
            </Link>
          </li>
        ))}
        {menuItems.length === 0 && (
          <>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/products">Shop</Link></li>
            <li><Link href="/artisans">Artisans</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </>
        )}
      </ul>
    </div>
  );
}
