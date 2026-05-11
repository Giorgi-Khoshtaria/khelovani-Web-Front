"use client";
import Image from "next/image";

import "./header.scss";
import { useState, useEffect } from "react";
import Link from "next/link";
import Navigation from "./navigation-component/Navigation";
import AuthActions from "./auth-component/AuthActions";
import SideMenu from "./sideMenu/SideMenu";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMenu } from "@/contexts/MenuContext";

function Header() {
  const { menuItems } = useMenu();
  const { lang, setLang } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Add shadow on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className={`header${scrolled ? " header--scrolled" : ""}`}>
        <Link href="/" className="header-logo">
          <Image
            className="logo"
            src="/assets/logo.png"
            width={150}
            height={50}
            alt="logo"
          />
        </Link>

        <nav className="nav">
          <Navigation />
        </nav>

        <div className="header-actions">
          <div className="favorites-action">
            <Image
              src="/assets/favorite-icon.svg"
              width={24}
              height={24}
              alt="favoriteIcon"
            />
          </div>

          <Link href="/cart" className="cart-action" aria-label="cart">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          </Link>

          <div className="lang-toggle">
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as "ge" | "en")}
            >
              <option value="ge">GE</option>
              <option value="en">EN</option>
            </select>
          </div>

          <div className="auth-action-section">
            <AuthActions />
          </div>

          <button
            className="burger-menu"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            <Image
              src="/assets/burger-icon.svg"
              width={24}
              height={24}
              alt="Open menu"
            />
          </button>
        </div>
      </header>

      {/* Overlay */}
      <div
        className={`menu-overlay ${menuOpen ? "menu-overlay--visible" : ""}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      <SideMenu
        closeIcon="/assets/close-icon.svg"
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
      />
    </>
  );
}

export default Header;
