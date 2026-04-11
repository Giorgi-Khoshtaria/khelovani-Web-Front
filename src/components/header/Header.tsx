"use client";
import Image from "next/image";

import "./header.scss";
import { useState, useEffect } from "react";
import Link from "next/link";
import Navigation from "./navigation-component/Navigation";
import AuthActions from "./auth-component/AuthActions";
import SideMenu from "./sideMenu/SideMenu";
import { useLanguage } from "@/contexts/LanguageContext";
import { MenuItem } from "@/apiCalls/menu/menu.req";

interface HeaderProps {
  menuItems?: MenuItem[];
}

function Header({ menuItems = [] }: HeaderProps) {
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
    window.addEventListener("scroll", handleScroll);
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
          <Navigation menuItems={menuItems} />
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
        menuItems={menuItems}
      />
    </>
  );
}

export default Header;
