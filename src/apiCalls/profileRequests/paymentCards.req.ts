import api from "@/apiCalls/api";

const authHeader = (token: string) => ({ Authorization: `Bearer ${token}` });

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

export const getCards = async (token: string): Promise<PaymentCard[]> => {
  const res = await api.get("/api/user/cards", { headers: authHeader(token) });
  return res.data.data as PaymentCard[];
};

export const addCard = async (
  token: string,
  data: AddCardPayload,
): Promise<PaymentCard> => {
  const res = await api.post("/api/user/cards", data, {
    headers: authHeader(token),
  });
  return res.data.data as PaymentCard;
};

export const setDefaultCard = async (
  token: string,
  id: string,
): Promise<PaymentCard[]> => {
  const res = await api.patch(
    `/api/user/cards/${id}/default`,
    {},
    { headers: authHeader(token) },
  );
  return res.data.data as PaymentCard[];
};

export const deleteCard = async (
  token: string,
  id: string,
): Promise<void> => {
  await api.delete(`/api/user/cards/${id}`, { headers: authHeader(token) });
};
