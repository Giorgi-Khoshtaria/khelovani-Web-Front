"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import "./not-found.scss";

export default function NotFound() {
  const { lang } = useLanguage();

  const content = {
    ge: {
      title: "გვერდი ვერ მოიძებნა",
      description: "უკაცრავად, გვერდი რომელსაც ეძებთ არ არსებობს ან დროებით მიუწვდომელია.",
      button: "მთავარზე დაბრუნება",
    },
    en: {
      title: "Page Not Found",
      description: "Sorry, the page you are looking for does not exist or has been moved.",
      button: "Back to Home",
    },
  };

  const active = content[lang] || content.ge;

  return (
    <main className="nf-container">
      {/* Decorative background elements */}
      <div className="nf-background">
        <div className="nf-background__blob nf-background__blob--1" />
        <div className="nf-background__blob nf-background__blob--2" />
        <div className="nf-background__blob nf-background__blob--3" />
        <div className="nf-background__grid" />
      </div>

      <div className="nf-content">
        <div className="nf-visual">
          <span className="nf-visual__number">4</span>
          <div className="nf-visual__circle">
            <div className="nf-visual__circle-inner" />
          </div>
          <span className="nf-visual__number">4</span>
        </div>

        <div className="nf-card">
          <h1 className="nf-card__title">{active.title}</h1>
          <p className="nf-card__description">{active.description}</p>
          
          <Link href="/" className="nf-card__btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span>{active.button}</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
