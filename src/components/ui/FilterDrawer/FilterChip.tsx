"use client";

interface Props {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

/** Pill toggle used for single-select chip rows inside {@link FilterDrawer}. */
export default function FilterChip({ active, onClick, children }: Props) {
  return (
    <button
      type="button"
      className={`fd-chip${active ? " fd-chip--active" : ""}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
