"use client";

import { useState } from "react";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import { OrderStatus } from "@/lib/types/orderStatus.enum";
import type { Order, OrderItem } from "@/lib/types/orderTypes";

const STATUS_META: Record<
  OrderStatus,
  { key: string; ge: string; en: string; tone: "paid" | "delivered" | "cancelled" }
> = {
  [OrderStatus.Paid]: { key: "orders.status.paid", ge: "გადახდილი", en: "Paid", tone: "paid" },
  [OrderStatus.Delivered]: { key: "orders.status.delivered", ge: "მიწოდებული", en: "Delivered", tone: "delivered" },
  [OrderStatus.Cancelled]: { key: "orders.status.cancelled", ge: "გაუქმებული", en: "Cancelled", tone: "cancelled" },
};

/** View-model for a single order card: expand state + derived labels/dates. */
export const useOrderCard = (order: Order) => {
  const { t: tPages } = useClientTranslation("pages");
  const { lang } = useLanguage();
  const isGe = lang.toLowerCase() === "ge";
  const locale = isGe ? "ka-GE" : "en-US";

  const [open, setOpen] = useState(false);

  const meta = STATUS_META[order.status] ?? STATUS_META[OrderStatus.Paid];

  const formatDate = (iso?: string): string =>
    iso
      ? new Date(iso).toLocaleDateString(locale, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "";

  const partnerName = (): string | null => {
    const p = order.partner;
    if (!p || typeof p === "string") return null;
    return (isGe ? p.companyNameGe : p.companyNameEn || p.companyNameGe) || p.companyNameGe;
  };

  const itemTitle = (item: OrderItem): string =>
    (isGe ? item.titleGe : item.titleEn || item.titleGe) || item.titleGe;

  return {
    open,
    toggle: () => setOpen((prev) => !prev),
    statusLabel: tPages(meta.key) || (isGe ? meta.ge : meta.en),
    tone: meta.tone,
    isDelivered: order.status === OrderStatus.Delivered,
    isCancelled: order.status === OrderStatus.Cancelled,
    orderedDate: formatDate(order.placedAt || order.createdAt),
    deliveredDate: formatDate(order.deliveredAt),
    cancelledDate: formatDate(order.cancelledAt),
    pieces: order.itemsCount,
    partnerName: partnerName(),
    itemTitle,
  };
};
