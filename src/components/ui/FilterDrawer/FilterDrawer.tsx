"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import "@/styles/filterDrawer.scss";

interface Props {
  isOpen: boolean;
  eyebrow: string;
  title: string;
  clearLabel: string;
  onClose: () => void;
  onClearAll: () => void;
  /** Optional search field rendered at the top of the body. */
  search?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Shared slide-over drawer chrome (overlay, header, scroll body, footer).
 * Rendered through a portal so it escapes any animated/transformed ancestor.
 * Feature-specific content is passed as `children`.
 */
export default function FilterDrawer({
  isOpen,
  eyebrow,
  title,
  clearLabel,
  onClose,
  onClearAll,
  search,
  children,
}: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const drawer = (
    <>
      <div
        className={`fd-overlay${isOpen ? " fd-overlay--open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`fd${isOpen ? " fd--open" : ""}`}
        aria-label="Filters"
        aria-hidden={!isOpen}
      >
        {/* Header */}
        <div className="fd__header">
          <div>
            <span className="fd__eyebrow">{eyebrow}</span>
            <h2 className="fd__title">{title}</h2>
          </div>
          <button
            className="fd__close"
            onClick={onClose}
            aria-label="Close filters"
            type="button"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body (scroll) */}
        <div className="fd__body">
          {search}
          {children}
        </div>

        {/* Footer */}
        <div className="fd__footer">
          <button type="button" className="fd__clear" onClick={onClearAll}>
            {clearLabel}
          </button>
        </div>
      </aside>
    </>
  );

  return createPortal(drawer, document.body);
}
