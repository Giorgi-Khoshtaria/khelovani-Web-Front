"use client";

import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import { OrderStatus } from "@/lib/types/orderStatus.enum";
import type { OrderStatusCounts } from "@/lib/types/orderTypes";
import type { StatusFilter } from "@/lib/hooks/useOrders";
import "./orderStatusTabs.scss";

interface Props {
  counts: OrderStatusCounts;
  active: StatusFilter;
  onChange: (status: StatusFilter) => void;
}

const TABS: {
  value: StatusFilter;
  key: string;
  ge: string;
  en: string;
}[] = [
  { value: "all", key: "orders.status.all", ge: "ყველა შეკვეთა", en: "All orders" },
  { value: OrderStatus.Paid, key: "orders.status.paid", ge: "გადახდილი", en: "Paid" },
  { value: OrderStatus.Delivered, key: "orders.status.delivered", ge: "მიწოდებული", en: "Delivered" },
  { value: OrderStatus.Cancelled, key: "orders.status.cancelled", ge: "გაუქმებული", en: "Cancelled" },
];

/** Status filter chips with live counts. */
export default function OrderStatusTabs({ counts, active, onChange }: Props) {
  const { t: tPages } = useClientTranslation("pages");
  const { lang } = useLanguage();
  const isGe = lang.toLowerCase() === "ge";

  return (
    <div className="order-tabs" role="tablist">
      {TABS.map((tab) => (
        <button
          key={tab.value}
          type="button"
          role="tab"
          aria-selected={active === tab.value}
          className={`order-tabs__tab${active === tab.value ? " order-tabs__tab--active" : ""}`}
          onClick={() => onChange(tab.value)}
        >
          <span>{tPages(tab.key) || (isGe ? tab.ge : tab.en)}</span>
          <span className="order-tabs__count">{counts[tab.value] ?? 0}</span>
        </button>
      ))}
    </div>
  );
}
