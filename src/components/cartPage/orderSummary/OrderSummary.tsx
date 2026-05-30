"use client";

import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import type { CartItem } from "@/lib/types/cartTypes";
import FreeShippingBar from "../cartStep/FreeShippingBar";
import PromoCodeInput from "../cartStep/PromoCodeInput";
import PaymentMethods from "../cartStep/PaymentMethods";
import ContinueShoppingLink from "./ContinueShoppingLink";
import SummaryItemList from "./SummaryItemList";
import SummaryTotals from "./SummaryTotals";
import SummaryAction from "./SummaryAction";
import SummaryFootnote from "./SummaryFootnote";
import { useOrderTotals, FREE_SHIPPING_THRESHOLD } from "./useOrderTotals";
import "./orderSummary.scss";

export type SummaryVariant = "cart" | "shipping" | "payment";

interface Props {
  items: CartItem[];
  variant: SummaryVariant;
  /** Primary CTA handler (checkout / continue / pay). */
  onAction: () => void;
  /** Disables the CTA (e.g. while a payment request is in flight). */
  actionDisabled?: boolean;
}

/**
 * Shared checkout summary card used on every step. The left section of each
 * page changes (cart / shipping / payment); this card stays the same and the
 * `variant` only toggles step-specific pieces — promo + payment methods on
 * cart, the item list on shipping/payment, and the CTA label / footnote.
 */
export default function OrderSummary({
  items,
  variant,
  onAction,
  actionDisabled = false,
}: Props) {
  const { t: tPages } = useClientTranslation("pages");
  const isCart = variant === "cart";
  const showItems = variant === "shipping" || variant === "payment";

  const { totals, applyPromo, promoApplied } = useOrderTotals(items, isCart);

  const ctaLabel =
    variant === "cart"
      ? tPages("cart.checkout") || "უსაფრთხო გადახდა"
      : variant === "shipping"
        ? tPages("shipping.continue_to_payment") || "გადახდაზე გადასვლა"
        : `${tPages("payment.pay") || "გადახდა"} ₾${totals.total}`;

  return (
    <div className="order-summary">
      <h2 className="order-summary__title">
        {tPages("cart.summary.title") || "შეკვეთის ჯამი"}
      </h2>

      {isCart && (
        <>
          <FreeShippingBar
            subtotal={totals.afterPromoSubtotal}
            threshold={FREE_SHIPPING_THRESHOLD}
          />
          <PromoCodeInput onApply={applyPromo} applied={promoApplied} />
        </>
      )}

      {showItems && <SummaryItemList items={items} />}

      <SummaryTotals totals={totals} divided={showItems} />

      <SummaryAction
        label={ctaLabel}
        onClick={onAction}
        disabled={actionDisabled}
        spread={isCart}
      />

      {variant !== "cart" && <SummaryFootnote variant={variant} />}

      {isCart && (
        <>
          <ContinueShoppingLink />
          <PaymentMethods />
        </>
      )}
    </div>
  );
}
