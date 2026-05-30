"use client";

import { useState } from "react";

interface Props {
  label: string;
  /** Whether the section starts expanded. Defaults to open. */
  defaultOpen?: boolean;
  children: React.ReactNode;
}

/** Collapsible labelled section used inside {@link FilterDrawer}. */
export default function FilterSection({
  label,
  defaultOpen = true,
  children,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="fd-section">
      <button
        type="button"
        className="fd-section__head"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        <span>{label}</span>
        <svg
          className={`fd-section__chevron${open ? " fd-section__chevron--open" : ""}`}
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && <div className="fd-section__body">{children}</div>}
    </section>
  );
}
