import api from "@/apiCalls/api";
import type {
  Order,
  OrderStatusCounts,
  CheckoutPayload,
} from "@/lib/types/orderTypes";

const authHeader = (token: string) => ({ Authorization: `Bearer ${token}` });

export interface GetOrdersResult {
  orders: Order[];
  counts: OrderStatusCounts;
  totalPages: number;
  currentPage: number;
  totalCount: number;
}

export const getOrders = async (
  token: string,
  params?: { status?: string; page?: number; limit?: number },
): Promise<GetOrdersResult> => {
  const res = await api.get("/api/user/orders", {
    headers: authHeader(token),
    params,
  });
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

export const getOrder = async (token: string, id: string): Promise<Order> => {
  const res = await api.get(`/api/user/orders/${id}`, {
    headers: authHeader(token),
  });
  return res.data.data as Order;
};

export const checkoutOrder = async (
  token: string,
  payload: CheckoutPayload,
): Promise<Order[]> => {
  const res = await api.post("/api/user/orders/checkout", payload, {
    headers: authHeader(token),
  });
  return res.data.data as Order[];
};
