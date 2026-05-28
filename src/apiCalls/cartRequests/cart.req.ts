import api from "@/apiCalls/api";
import type { Cart, GuestCartEntry } from "@/lib/types/cartTypes";

export const getCart = async (): Promise<Cart> => {
  const res = await api.get("/api/user/cart");
  return res.data.data as Cart;
};

export const addToCart = async (
  productId: string,
  quantity = 1,
): Promise<Cart> => {
  const res = await api.post("/api/user/cart/items", { productId, quantity });
  return res.data.data as Cart;
};

export const updateCartItem = async (
  productId: string,
  quantity: number,
): Promise<Cart> => {
  const res = await api.patch(`/api/user/cart/items/${productId}`, {
    quantity,
  });
  return res.data.data as Cart;
};

export const removeCartItem = async (productId: string): Promise<Cart> => {
  const res = await api.delete(`/api/user/cart/items/${productId}`);
  return res.data.data as Cart;
};

export const clearCart = async (): Promise<void> => {
  await api.delete("/api/user/cart");
};

export const mergeCart = async (items: GuestCartEntry[]): Promise<Cart> => {
  const res = await api.post("/api/user/cart/merge", { items });
  return res.data.data as Cart;
};
