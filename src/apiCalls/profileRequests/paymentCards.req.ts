import api from "@/apiCalls/api";

// Auth is carried by the httpOnly `access-token` cookie (sent automatically
// via `withCredentials`). These are all client-side calls — no token param.

export type CardBrand = "visa" | "mastercard" | "amex" | "other";

export interface PaymentCard {
  _id: string;
  holderName: string;
  brand: CardBrand;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

export interface AddCardPayload {
  holderName: string;
  brand: CardBrand;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault?: boolean;
}

export const getCards = async (): Promise<PaymentCard[]> => {
  const res = await api.get("/api/user/cards");
  return res.data.data as PaymentCard[];
};

export const addCard = async (data: AddCardPayload): Promise<PaymentCard> => {
  const res = await api.post("/api/user/cards", data);
  return res.data.data as PaymentCard;
};

export const setDefaultCard = async (id: string): Promise<PaymentCard[]> => {
  const res = await api.patch(`/api/user/cards/${id}/default`, {});
  return res.data.data as PaymentCard[];
};

export const deleteCard = async (id: string): Promise<void> => {
  await api.delete(`/api/user/cards/${id}`);
};
