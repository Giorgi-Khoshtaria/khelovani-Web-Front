import api from "@/apiCalls/api";
import type {
  Order,
  OrderStatusCounts,
  CheckoutPayload,
} from "@/lib/types/orderTypes";

// Auth is carried by the httpOnly `access-token` cookie (sent automatically
// via `withCredentials`). These are all client-side calls — no token param.

export interface GetOrdersResult {
  orders: Order[];
  counts: OrderStatusCounts;
  totalPages: number;
  currentPage: number;
  totalCount: number;
}

export const getOrders = async (
  params?: { status?: string; page?: number; limit?: number },
): Promise<GetOrdersResult> => {
  const res = await api.get("/api/user/orders", { params });
  const meta = res.data.meta ?? {};
  return {
    orders: (res.data.data ?? []) as Order[],
    counts:
      (meta.counts as OrderStatusCounts) ??
      { all: 0, paid: 0, delivered: 0, cancelled: 0 },
    totalPages: meta.totalPages ?? 1,
    currentPage: meta.currentPage ?? 1,
    totalCount: meta.totalCount ?? 0,
  };
};

export const getOrder = async (id: string): Promise<Order> => {
  const res = await api.get(`/api/user/orders/${id}`);
  return res.data.data as Order;
};

export const checkoutOrder = async (
  payload: CheckoutPayload,
): Promise<Order[]> => {
  const res = await api.post("/api/user/orders/checkout", payload);
  return res.data.data as Order[];
};
