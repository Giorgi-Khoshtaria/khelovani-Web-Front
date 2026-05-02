"use client";

import React from "react";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import "./contactInfo.scss";

export default function ContactInfo() {
  const { t: Pages } = useClientTranslation("pages");
  const { t: Inputs } = useClientTranslation("inputs");
  const { t: Common } = useClientTranslation("common");

  return (
    <div className="contact-info-card">
      <h2 className="contact-info-card__title">{Pages("contact_title")}</h2>

      <div className="contact-info-list">
        {/* Email */}
        <div className="contact-info-item">
          <div className="contact-info-item__icon-box" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <div className="contact-info-item__content">
            <span className="contact-info-item__label">
              {Inputs("label.email")}
            </span>
            <span className="contact-info-item__value">
              info@georgianarts.ge
            </span>
          </div>
        </div>

        {/* Phone */}
        <div className="contact-info-item">
          <div className="contact-info-item__icon-box" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </div>
          <div className="contact-info-item__content">
            <span className="contact-info-item__label">
              {Inputs("label.phone")}
            </span>
            <span className="contact-info-item__value">+995 322 12 34 56</span>
          </div>
        </div>

        {/* Location */}
        <div className="contact-info-item">
          <div className="contact-info-item__icon-box" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <div className="contact-info-item__content">
            <span className="contact-info-item__label">
              {Common("location")}
            </span>
            <span className="contact-info-item__value">
              12 Rustaveli Avenue
              <br />
              Tbilisi, 0108 Georgia
            </span>
          </div>
        </div>
      </div>

      <div className="social-links">
        <h3 className="social-links__title">{Pages("socials_title")}</h3>
        <div className="social-links__list">
          <a href="#" className="social-links__link" aria-label="Facebook">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
            </svg>
          </a>
          <a href="#" className="social-links__link" aria-label="Instagram">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>
          <a href="#" className="social-links__link" aria-label="X (Twitter)">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
            </svg>
          </a>
          <a href="#" className="social-links__link" aria-label="Pinterest">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8 12a4 4 0 1 0 8 0 4 4 0 0 0-8 0"></path>
              <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"></path>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
