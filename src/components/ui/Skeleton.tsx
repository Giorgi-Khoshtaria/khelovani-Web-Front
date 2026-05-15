"use client";

import { CSSProperties } from "react";
import "./Skeleton.scss";

interface SkeletonProps {
  /** CSS width — number = px, string passed through. Default 100%. */
  width?: number | string;
  /** CSS height — number = px, string passed through. Default 16. */
  height?: number | string;
  /** Border radius in px. Default 8. Use 999 for pills, 50% for circle. */
  radius?: number | string;
  /** Render N stacked rows with the same dimensions (e.g. for paragraphs). */
  rows?: number;
  className?: string;
  style?: CSSProperties;
}

const toCss = (v: number | string | undefined, fallback: string): string =>
  v === undefined ? fallback : typeof v === "number" ? `${v}px` : v;

/**
 * Skeleton — animated placeholder while data is loading.
 *
 *   <Skeleton width={120} height={20} />
 *   <Skeleton rows={3} />            // three stacked lines
 *   <Skeleton width={48} height={48} radius="50%" />  // avatar
 */
export default function Skeleton({
  width,
  height = 16,
  radius = 8,
  rows = 1,
  className,
  style,
}: SkeletonProps) {
  const itemStyle: CSSProperties = {
    width: toCss(width, "100%"),
    height: toCss(height, "16px"),
    borderRadius: toCss(radius, "8px"),
    ...style,
  };

  if (rows <= 1) {
    return (
      <span
        className={`skeleton${className ? ` ${className}` : ""}`}
        style={itemStyle}
        aria-hidden="true"
      />
    );
  }

  return (
    <span
      className={`skeleton-group${className ? ` ${className}` : ""}`}
      aria-hidden="true"
    >
      {Array.from({ length: rows }).map((_, i) => (
        <span key={i} className="skeleton" style={itemStyle} />
      ))}
    </span>
  );
}
