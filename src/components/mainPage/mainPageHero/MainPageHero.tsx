"use client";

import Link from "next/link";
import "./mainPageHero.scss";
import Image from "next/image";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";

function MainPageHero() {
  const { t: tPages } = useClientTranslation("pages");
  const { t: tNav } = useClientTranslation("navigation");

  return (
    <section className="hero">
      <div className="hero__bg-fx">
        <div className="hero__gradient hero__gradient--1"></div>
        <div className="hero__gradient hero__gradient--2"></div>
        <div className="hero__noise"></div>
      </div>
      <span
        className="hero__bg-element hero__bg-element--1"
        aria-hidden="true"
      ></span>
      <span
        className="hero__bg-element hero__bg-element--2"
        aria-hidden="true"
      ></span>
      <div className="hero__inner">
        <div className="hero__content">
          <Image
            className="hero__logo"
            src="/assets/logo.png"
            width={150}
            height={150}
            alt="logo"
          />
          <p className="hero__text">{tPages("home.hero_description")}</p>
        </div>

        <div className="hero__actions">
          <Link href="/products" className="hero__btn hero__btn--primary">
            {tPages("home.discover_collection")}
          </Link>
          <Link href="/partners" className="hero__btn hero__btn--secondary">
            {tPages("home.discover_partners")}
          </Link>
          <Link href="/become-partner" className="hero__btn hero__btn--ghost">
            {tNav("become_partner")}
          </Link>
        </div>
      </div>
    </section>
  );
}

export default MainPageHero;
