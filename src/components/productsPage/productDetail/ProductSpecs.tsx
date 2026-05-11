"use client";

import { ReactNode } from "react";
import { IProduct, CONDITION_LABELS } from "@/lib/types/productTypes";
import { useLanguage } from "@/contexts/LanguageContext";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import { SPEC_ROWS } from "./constants";
import "./productSpecs.scss";

interface ProductSpecsProps {
  product: IProduct;
}

interface ResolvedRow {
  key: string;
  label: string;
  value: string;
  icon: ReactNode;
}

export default function ProductSpecs({ product }: ProductSpecsProps) {
  const { lang } = useLanguage();
  const { t: tPages } = useClientTranslation("pages");
  const isEn = lang.toLowerCase() === "en";

  const materials =
    isEn && product.materialsEn?.length
      ? product.materialsEn
      : product.materialsGe;
  const location = isEn && product.locationEn ? product.locationEn : product.locationGe;
  const conditionLabel = product.condition
    ? CONDITION_LABELS[product.condition]?.[isEn ? "en" : "ge"]
    : "";

  const valueMap: Record<string, string | undefined> = {
    material: materials?.length ? materials.join(", ") : undefined,
    dimensions: product.dimensions,
    weight: product.weight ? `${product.weight} ${tPages("products.unit_grams")}` : undefined,
    condition: conditionLabel || undefined,
    location: location || undefined,
    shipping: product.shippingAvailable
      ? product.shippingPrice
        ? `${tPages("products.shipping_available")} · ₾${product.shippingPrice}`
        : tPages("products.shipping_available")
      : tPages("products.shipping_not_available"),
    oneOfAKind: product.isOneOfAKind ? tPages("products.yes") : undefined,
  };

  const rows: ResolvedRow[] = SPEC_ROWS
    .map((r) => {
      const value = valueMap[r.key];
      if (!value) return null;
      return { key: r.key, icon: r.icon, label: tPages(r.labelKey), value };
    })
    .filter((r): r is ResolvedRow => r !== null);

  if (rows.length === 0) return null;

  return (
    <dl className="product-specs">
      {rows.map((row) => (
        <div key={row.key} className="product-specs__row">
          <dt className="product-specs__label">
            <span className="product-specs__icon" aria-hidden>
              {row.icon}
            </span>
            {row.label}
          </dt>
          <dd className="product-specs__value">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
