import { ReactNode } from "react";

// ── Icons (single source of truth for the detail page) ───────────────────────
type IconProps = { size?: number; className?: string };

const baseSvg = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export const ChevronLeftIcon = ({ size = 16, className }: IconProps) => (
  <svg {...baseSvg(size)} className={className}>
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

export const ChevronRightIcon = ({ size = 16, className }: IconProps) => (
  <svg {...baseSvg(size)} className={className}>
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export const HeartIcon = ({ size = 20, className }: IconProps) => (
  <svg {...baseSvg(size)} className={className}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

export const CartIcon = ({ size = 18, className }: IconProps) => (
  <svg {...baseSvg(size)} className={className}>
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

export const ZoomIcon = ({ size = 16, className }: IconProps) => (
  <svg {...baseSvg(size)} className={className}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
    <line x1="11" y1="8" x2="11" y2="14" />
    <line x1="8" y1="11" x2="14" y2="11" />
  </svg>
);

export const PlusIcon = ({ size = 16, className }: IconProps) => (
  <svg {...baseSvg(size)} className={className}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export const MinusIcon = ({ size = 16, className }: IconProps) => (
  <svg {...baseSvg(size)} className={className}>
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export const ChevronDownIcon = ({ size = 18, className }: IconProps) => (
  <svg {...baseSvg(size)} className={className}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

// Spec-row icons
export const MaterialIcon = ({ size = 16, className }: IconProps) => (
  <svg {...baseSvg(size)} className={className}>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
  </svg>
);

export const DimensionsIcon = ({ size = 16, className }: IconProps) => (
  <svg {...baseSvg(size)} className={className}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 9h18M9 3v18" />
  </svg>
);

export const WeightIcon = ({ size = 16, className }: IconProps) => (
  <svg {...baseSvg(size)} className={className}>
    <path d="M6.5 6.5h11l1.4 12.5a2 2 0 0 1-2 2.2H7.1a2 2 0 0 1-2-2.2L6.5 6.5z" />
    <path d="M9 6.5a3 3 0 0 1 6 0" />
  </svg>
);

export const ConditionIcon = ({ size = 16, className }: IconProps) => (
  <svg {...baseSvg(size)} className={className}>
    <path d="M9 12l2 2 4-4" />
    <circle cx="12" cy="12" r="10" />
  </svg>
);

export const LocationIcon = ({ size = 16, className }: IconProps) => (
  <svg {...baseSvg(size)} className={className}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export const ShippingIcon = ({ size = 16, className }: IconProps) => (
  <svg {...baseSvg(size)} className={className}>
    <rect x="1" y="3" width="15" height="13" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

export const SparkleIcon = ({ size = 16, className }: IconProps) => (
  <svg {...baseSvg(size)} className={className}>
    <path d="M12 2l1.6 4.8L18 8l-4.4 1.2L12 14l-1.6-4.8L6 8l4.4-1.2L12 2z" />
  </svg>
);

export const ShareIcon = ({ size = 18, className }: IconProps) => (
  <svg {...baseSvg(size)} className={className}>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

// ── Spec field config ────────────────────────────────────────────────────────
export interface SpecRow {
  key: string;
  /** translation key inside `pages` namespace */
  labelKey: string;
  icon: ReactNode;
}

export const SPEC_ROWS: SpecRow[] = [
  { key: "material", labelKey: "products.material", icon: <MaterialIcon /> },
  { key: "dimensions", labelKey: "products.dimensions", icon: <DimensionsIcon /> },
  { key: "weight", labelKey: "products.weight", icon: <WeightIcon /> },
  { key: "condition", labelKey: "products.condition", icon: <ConditionIcon /> },
  { key: "location", labelKey: "products.location", icon: <LocationIcon /> },
  { key: "shipping", labelKey: "products.shipping", icon: <ShippingIcon /> },
  { key: "oneOfAKind", labelKey: "products.one_of_a_kind", icon: <SparkleIcon /> },
];
