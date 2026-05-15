"use client";

import { useEffect, useMemo, useRef, useState } from "react";

interface Option {
  value: string;
  label: string;
}

interface CategoryMultiSelectProps {
  id: string;
  label: string;
  options: Option[];
  selected: string[];
  onToggle: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  searchPlaceholder?: string;
  selectedSuffix?: string;
  emptyText?: string;
  clearLabel?: string;
  error?: string;
}

export default function CategoryMultiSelect({
  id,
  label,
  options,
  selected,
  onToggle,
  onClear,
  placeholder,
  searchPlaceholder,
  selectedSuffix,
  emptyText,
  clearLabel,
  error,
}: CategoryMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setQuery("");
      }
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      // focus search after render
      requestAnimationFrame(() => searchRef.current?.focus());
    }
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((opt) => opt.label.toLowerCase().includes(q));
  }, [options, query]);

  const selectedOptions = useMemo(
    () => options.filter((opt) => selected.includes(opt.value)),
    [options, selected],
  );

  const triggerText =
    selected.length === 0
      ? placeholder
      : `${selected.length} ${selectedSuffix ?? "selected"}`;

  return (
    <div className="form-group form-group--full" ref={wrapperRef}>
      <label htmlFor={id} className="ms-label-text">
        {label}
      </label>

      <div className={`ms-wrapper${open ? " open" : ""}`}>
        <button
          id={id}
          type="button"
          className={`ms-trigger${error ? " input-error" : ""}`}
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span
            className={`ms-trigger__text${selected.length === 0 ? " placeholder" : ""}`}
          >
            {triggerText}
          </span>
          <svg
            className="ms-trigger__chevron"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {open && (
          <div className="ms-panel" role="listbox">
            <div className="ms-search-wrap">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                ref={searchRef}
                type="text"
                className="ms-search"
                placeholder={searchPlaceholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <div className="ms-list">
              {filtered.length === 0 ? (
                <p className="ms-empty">{emptyText}</p>
              ) : (
                filtered.map((opt) => {
                  const checked = selected.includes(opt.value);
                  return (
                    <label
                      key={opt.value}
                      className={`ms-option${checked ? " active" : ""}`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => onToggle(opt.value)}
                      />
                      <span className="ms-check" aria-hidden="true">
                        {checked && (
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </span>
                      <span className="ms-option__label">{opt.label}</span>
                    </label>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {selectedOptions.length > 0 && (
        <div className="ms-chips">
          {selectedOptions.map((opt) => (
            <span key={opt.value} className="ms-chip">
              {opt.label}
              <button
                type="button"
                className="ms-chip__remove"
                onClick={() => onToggle(opt.value)}
                aria-label={`Remove ${opt.label}`}
              >
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </span>
          ))}
          {onClear && selectedOptions.length > 1 && (
            <button type="button" className="ms-clear" onClick={onClear}>
              {clearLabel ?? "Clear all"}
            </button>
          )}
        </div>
      )}

      {error && <span className="error-text">{error}</span>}
    </div>
  );
}
