"use client";

import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Order } from "@/lib/types/orderTypes";
import OrderCard from "../OrderCard/OrderCard";
import "./orderList.scss";

interface Props {
  orders: Order[];
}

const BagIcon = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

/** Renders the order cards, or an empty state when there are none. */
export default function OrderList({ orders }: Props) {
  const { t: tPages } = useClientTranslation("pages");
  const { lang } = useLanguage();
  const isGe = lang.toLowerCase() === "ge";

  if (orders.length === 0) {
    return (
      <div className="order-list__empty">
        <span className="order-list__empty-icon">
          <BagIcon />
        </span>
        <p className="order-list__empty-text">
          {tPages("orders.empty") ||
            (isGe ? "შეკვეთები ვერ მოიძებნა" : "No orders found")}
        </p>
      </div>
    );
  }

  return (
    <div className="order-list">
      {orders.map((order) => (
        <OrderCard key={order._id} order={order} />
      ))}
    </div>
  );
}
