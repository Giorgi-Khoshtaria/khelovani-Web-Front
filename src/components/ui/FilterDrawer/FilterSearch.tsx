"use client";

interface Props {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}

/** Primary search input rendered at the top of a {@link FilterDrawer} body. */
export default function FilterSearch({ value, placeholder, onChange }: Props) {
  return (
    <div className="fd__search">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
      />
    </div>
  );
}
