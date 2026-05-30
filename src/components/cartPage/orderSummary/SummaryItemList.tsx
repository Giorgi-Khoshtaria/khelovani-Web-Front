"use client";

import Image from "next/image";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import type { CartItem } from "@/lib/types/cartTypes";
import {
  CATEGORY_PLACEHOLDER_MAP,
  type IPopulatedOwner,
} from "@/lib/types/productTypes";
import "./summaryItemList.scss";

interface Props {
  items: CartItem[];
}

/** Thumbnail list of cart items shown in the summary on shipping/payment steps. */
export default function SummaryItemList({ items }: Props) {
  const { t: tPages } = useClientTranslation("pages");
  const { lang } = useLanguage();
  const isEn = lang.toLowerCase() === "en";

  return (
    <ul className="summary-items">
      {items.map(({ product, quantity }) => {
        const unit =
          product.isOnSale && product.discountPercent
            ? Math.round(product.price * (1 - product.discountPercent / 100))
            : product.price;
        const hasDiscount = unit < product.price;
        const lineTotal = unit * quantity;
        const title = isEn && product.titleEn ? product.titleEn : product.titleGe;
        const owner = (
          typeof product.owner === "object" ? product.owner : null
        ) as IPopulatedOwner | null;
        const ownerName = owner
          ? isEn && owner.companyNameEn
            ? owner.companyNameEn
            : owner.companyNameGe
          : null;
        const image =
          product.images?.[0] ||
          CATEGORY_PLACEHOLDER_MAP[
            product.category as keyof typeof CATEGORY_PLACEHOLDER_MAP
          ] ||
          "/assets/placeholder/default.png";

        return (
          <li key={product._id} className="summary-items__item">
            <div className="summary-items__thumb">
              <Image src={image} alt={title} width={56} height={56} />
              <span className="summary-items__qty">{quantity}</span>
            </div>
            <div className="summary-items__body">
              <p className="summary-items__name">{title}</p>
              {ownerName && (
                <p className="summary-items__partner">
                  {tPages("cart.by") || "By"} {ownerName}
                </p>
              )}
            </div>
            <div className="summary-items__price">
              {hasDiscount && (
                <span className="summary-items__original">
                  ₾{product.price * quantity}
                </span>
              )}
              <span className="summary-items__amount">₾{lineTotal}</span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
