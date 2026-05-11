"use client";

import { ReactNode, useState } from "react";
import { ChevronDownIcon, MinusIcon } from "./constants";
import "./productAccordion.scss";

interface ProductAccordionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export default function ProductAccordion({
  title,
  children,
  defaultOpen = true,
}: ProductAccordionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className={`pd-accordion${open ? " pd-accordion--open" : ""}`}>
      <button
        type="button"
        className="pd-accordion__head"
        aria-expanded={open}
        onClick={() => setOpen((p) => !p)}
      >
        <h2 className="pd-accordion__title">{title}</h2>
        <span className="pd-accordion__icon" aria-hidden>
          {open ? <MinusIcon size={16} /> : <ChevronDownIcon size={18} />}
        </span>
      </button>

      {open && <div className="pd-accordion__body">{children}</div>}
    </section>
  );
}
