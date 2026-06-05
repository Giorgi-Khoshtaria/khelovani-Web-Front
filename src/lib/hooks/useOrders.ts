"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAuth } from "@/contexts/AuthContext";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import { getOrders } from "@/apiCalls/profileRequests/orders.req";
import type { Order, OrderStatusCounts } from "@/lib/types/orderTypes";
import { OrderStatus } from "@/lib/types/orderStatus.enum";

export type StatusFilter = "all" | OrderStatus;

const EMPTY_COUNTS: OrderStatusCounts = {
  all: 0,
  paid: 0,
  delivered: 0,
  cancelled: 0,
};

export interface UseOrdersState {
  ready: boolean;
  orders: Order[]; // after status + search filtering
  counts: OrderStatusCounts;
  activeStatus: StatusFilter;
  search: string;
  setActiveStatus: (status: StatusFilter) => void;
  setSearch: (value: string) => void;
}

/**
 * Loads the user's orders once, then filters by status tab + search client-side
 * (counts come from the server so the tabs stay accurate regardless of filter).
 */
export const useOrders = (): UseOrdersState => {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAuth();
  const { t: tAlerts } = useClientTranslation("alerts");

  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [counts, setCounts] = useState<OrderStatusCounts>(EMPTY_COUNTS);
  const [activeStatus, setActiveStatus] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (!isHydrated) return;
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    getOrders({ limit: 50 })
      .then((res) => {
        setAllOrders(res.orders);
        setCounts(res.counts);
      })
      .catch(() => toast.error(tAlerts("error") || "შეცდომა"))
      .finally(() => setLoading(false));
  }, [isAuthenticated, isHydrated, router, tAlerts]);

  const orders = useMemo(() => {
    const byStatus =
      activeStatus === "all"
        ? allOrders
        : allOrders.filter((o) => o.status === activeStatus);

    const q = search.trim().toLowerCase();
    if (!q) return byStatus;

    return byStatus.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.items.some((it) =>
          `${it.titleGe} ${it.titleEn ?? ""}`.toLowerCase().includes(q),
        ),
    );
  }, [allOrders, activeStatus, search]);

  return {
    ready: isHydrated && !loading,
    orders,
    counts,
    activeStatus,
    search,
    setActiveStatus,
    setSearch,
  };
};
