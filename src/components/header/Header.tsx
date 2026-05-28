"use client";

import "./header.scss";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Navigation from "./navigation-component/Navigation";
import AuthActions from "./auth-component/AuthActions";
import SideMenu from "./sideMenu/SideMenu";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useCart } from "@/contexts/CartContext";
import { CartIcon } from "@/lib/icons";

const TRANSPARENT_ROUTES = ["/"];

function Header() {
  const pathname = usePathname();
  const { ids: favoriteIds } = useFavorites();
  const favCount = favoriteIds.size;
  const { totalItems: cartCount } = useCart();
  const { lang, setLang } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isOverHero = TRANSPARENT_ROUTES.includes(pathname ?? "");
  const transparent = isOverHero && !scrolled;

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const headerClass = [
    "header",
    transparent ? "header--transparent" : "header--solid",
    scrolled ? "header--scrolled" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <header className={headerClass}>
        <Link href="/" className="header__brand" aria-label="Khelovani — home">
          <span className="header__logo-mark" aria-hidden="true">K</span>
          <span className="header__logo-word">Khelovani</span>
        </Link>

        <nav className="header__nav">
          <Navigation />
        </nav>

        <div className="header__actions">
          <Link
            href="/favorites"
            className="header__icon-btn"
            aria-label="favorites"
          >
            <svg width="18" height="17" viewBox="0 0 18 17" fill="none" aria-hidden="true">
              <path
                d="M13.125 1.5c-1.628 0-3.03.916-4.125 2.244C7.905 2.416 6.503 1.5 4.875 1.5 2.182 1.5 0 3.682 0 6.375 0 10.336 9 15.75 9 15.75s9-5.414 9-9.375C18 3.682 15.818 1.5 13.125 1.5Z"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
            </svg>
            {favCount > 0 && (
              <span className="header__icon-badge" aria-label={`${favCount} saved`}>
                {favCount > 99 ? "99+" : favCount}
              </span>
            )}
          </Link>

          <Link href="/cart" className="header__icon-btn" aria-label="cart">
            <CartIcon size={20} />
            {cartCount > 0 && (
              <span
                className="header__icon-badge"
                aria-label={`${cartCount} in cart`}
              >
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          <div className="header__lang">
            <button
              type="button"
              className={`header__lang-btn${lang === "en" ? " is-active" : ""}`}
              onClick={() => setLang("en")}
              aria-pressed={lang === "en"}
            >
              EN
            </button>
            <span className="header__lang-sep" aria-hidden="true">·</span>
            <button
              type="button"
              className={`header__lang-btn${lang === "ge" ? " is-active" : ""}`}
              onClick={() => setLang("ge")}
              aria-pressed={lang === "ge"}
            >
              GE
            </button>
          </div>

          <div className="header__auth">
            <AuthActions />
          </div>

          <button
            className="header__burger"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {!isOverHero && <div className="header-spacer" aria-hidden="true" />}

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
