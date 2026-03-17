"use client";

import "./header.scss";
import { useState, useEffect } from "react";
import Link from "next/link";
import Navigation from "./navigation-component/Navigation";
import AuthActions from "./auth-component/AuthActions";
import SideMenu from "./sideMenu/SideMenu";

function Header() {
  const [lang, setLang] = useState<"GE" | "EN">("GE");
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
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const nav = [
    { title: "მთავარი", titleEn: "Home", path: "/" },
    { title: "ჩვენ შესახებ", titleEn: "About", path: "/about" },
    { title: "პროდუქტები", titleEn: "Products", path: "/products" },
    { title: "პარტნიორები", titleEn: "Partners", path: "/partners" },
    { title: "კონტაქტი", titleEn: "Contact", path: "/contact" },
  ];

  return (
    <>
      <header className={`header${scrolled ? " header--scrolled" : ""}`}>
        <Link href="/" className="header-logo">
          <img className="logo" src="/assets/logo.png" alt="logo" />
        </Link>

        <nav className="nav">
          <Navigation nav={nav} lang={lang} />
        </nav>

        <div className="header-actions">
          <div className="favorites-action">
            <img src="/assets/favorite-icon.svg" alt="favoriteIcon" />
          </div>

          <div className="lang-toggle">
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as "GE" | "EN")}
            >
              <option value="GE">GE</option>
              <option value="EN">EN</option>
            </select>
          </div>

          <div className="auth-action-section">
            <AuthActions lang={lang} />
          </div>

          <button
            className="burger-menu"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            <img src="/assets/burger-icon.svg" alt="Open menu" />
          </button>
        </div>
      </header>

      {/* Overlay */}
      <div
        className={`menu-overlay ${menuOpen ? "menu-overlay--visible" : ""}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Side Menu */}
      <SideMenu
        closeIcon="/assets/close-icon.svg"
        nav={nav}
        lang={lang}
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
      />
    </>
  );
}

export default Header;
