import React, { useState } from "react";

function Header() {
  const [lang, setLang] = useState<"GE" | "EN">("GE");

  const nav = [
    { title: "მთავარი", titleEn: "Home", path: "/" },
    { title: "ჩვენ შესახებ", titleEn: "About", path: "/about" },
    { title: "პროდუქტები", titleEn: "Products", path: "/products" },
    { title: "პარტნიორები", titleEn: "Partners", path: "/partners" },
    { title: "კონტაქტი", titleEn: "Contact", path: "/contact" },
  ];

  return (
    <header className="header">
      <a href="/" className="header-logo">
        <img src="/assets/logo.png" alt="logo" />
      </a>

      <nav className="header-nav">
        <ul>
          {nav.map((item) => (
            <li key={item.path}>
              <a href={item.path}>
                {lang === "GE" ? item.title : item.titleEn}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="header-actions">
        <div className="lang-toggle">
          <button
            className={`lang-btn ${lang === "GE" ? "active" : ""}`}
            onClick={() => setLang("GE")}
          >
            GE
          </button>
          <button
            className={`lang-btn ${lang === "EN" ? "active" : ""}`}
            onClick={() => setLang("EN")}
          >
            EN
          </button>
        </div>

        <button className="login-btn">
          {lang === "GE" ? "შესვლა" : "Sign In"}
        </button>
      </div>
    </header>
  );
}

export default Header;
