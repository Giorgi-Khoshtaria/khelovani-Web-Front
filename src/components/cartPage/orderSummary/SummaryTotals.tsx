"use client";

import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import type { OrderTotals } from "./useOrderTotals";
import "./summaryTotals.scss";

interface Props {
  totals: OrderTotals;
  /** Adds a top divider (used when an item list precedes the totals). */
  divided?: boolean;
}

/** Subtotal / savings / shipping rows plus the grand total. */
export default function SummaryTotals({ totals, divided = false }: Props) {
  const { t: tPages } = useClientTranslation("pages");

  return (
    <>
      <dl className={`summary-totals${divided ? " summary-totals--divided" : ""}`}>
        <div className="summary-totals__row">
          <dt>
            {tPages("cart.summary.subtotal") || "ჯამი"} ({totals.itemsCount}{" "}
            {tPages("cart.summary.items") || "ნივთი"})
          </dt>
          <dd>₾{totals.subtotal}</dd>
        </div>

        {totals.totalSavings > 0 && (
          <div className="summary-totals__row summary-totals__row--save">
            <dt>{tPages("cart.summary.you_save") || "დაზოგავ"}</dt>
            <dd>-₾{totals.totalSavings}</dd>
          </div>
        )}

        <div className="summary-totals__row">
          <dt>{tPages("cart.summary.shipping") || "მიწოდება"}</dt>
          <dd>
            {totals.shipping === 0
              ? tPages("cart.summary.free") || "უფასო"
              : `₾${totals.shipping}`}
          </dd>
        </div>
      </dl>

      <div className="summary-totals__grand">
        <span>{tPages("cart.summary.total") || "ჯამური"}</span>
        <span className="summary-totals__grand-amount">₾{totals.total}</span>
      </div>
    </>
  );
}
