"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import "./searchableSelect.scss";

export interface SearchableOption {
  value: string;
  label: string;
}

interface Props {
  id?: string;
  value: string;
  options: SearchableOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  error?: boolean;
  disabled?: boolean;
  className?: string;
  onChange: (value: string) => void;
}

const ChevronIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <polyline
      points="6 9 12 15 18 9"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle
      cx="11"
      cy="11"
      r="7"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path
      d="m20 20-4-4"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

export default function SearchableSelect({
  id,
  value,
  options,
  placeholder,
  searchPlaceholder,
  emptyText,
  error,
  disabled,
  className,
  onChange,
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selected = options.find((o) => o.value === value);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query]);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(-1);
      // focus the search input on open
      setTimeout(() => searchRef.current?.focus(), 0);
    }
  }, [open]);

  const choose = (val: string) => {
    onChange(val);
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(filtered.length - 1, i + 1));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(0, i - 1));
      return;
    }
    if (e.key === "Enter" && active >= 0 && filtered[active]) {
      e.preventDefault();
      choose(filtered[active].value);
    }
  };

  return (
    <div
      ref={wrapperRef}
      className={`searchable-select${open ? " searchable-select--open" : ""}${
        error ? " searchable-select--error" : ""
      }${disabled ? " searchable-select--disabled" : ""}${
        className ? ` ${className}` : ""
      }`}
    >
      <button
        id={id}
        type="button"
        className="searchable-select__trigger"
        onClick={() => !disabled && setOpen((o) => !o)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span
          className={`searchable-select__value${
            !selected ? " searchable-select__value--placeholder" : ""
          }`}
        >
          {selected ? selected.label : placeholder ?? ""}
        </span>
        <span className="searchable-select__chevron" aria-hidden="true">
          <ChevronIcon />
        </span>
      </button>

      {open && (
        <div className="searchable-select__panel" role="listbox">
          <div className="searchable-select__search">
            <SearchIcon />
            <input
              ref={searchRef}
              type="text"
              className="searchable-select__search-input"
              placeholder={searchPlaceholder}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
              onKeyDown={onKeyDown}
            />
          </div>

          <ul className="searchable-select__list">
            {filtered.length === 0 ? (
              <li className="searchable-select__empty">
                {emptyText ?? "—"}
              </li>
            ) : (
              filtered.map((opt, idx) => (
                <li key={opt.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={opt.value === value}
                    className={`searchable-select__option${
                      opt.value === value
                        ? " searchable-select__option--selected"
                        : ""
                    }${
                      idx === active
                        ? " searchable-select__option--active"
                        : ""
                    }`}
                    onMouseEnter={() => setActive(idx)}
                    onClick={() => choose(opt.value)}
                  >
                    {opt.label}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
