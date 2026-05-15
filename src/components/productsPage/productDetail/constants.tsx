import { ReactNode } from "react";
import {
  MaterialIcon,
  DimensionsIcon,
  WeightIcon,
  ConditionIcon,
  LocationIcon,
  ShippingIcon,
  SparkleIcon,
} from "@/lib/icons";

// Re-export the icons that callers of this module already import.
// New code should import directly from "@/lib/icons" instead.
export {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  HeartIcon,
  CartIcon,
  ZoomIcon,
  PlusIcon,
  MinusIcon,
  ShareIcon,
  SparkleIcon,
  MaterialIcon,
  DimensionsIcon,
  WeightIcon,
  ConditionIcon,
  LocationIcon,
  ShippingIcon,
} from "@/lib/icons";

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
