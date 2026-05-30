import type { OrderContact } from "@/lib/types/orderTypes";

// Carries the shipping selection from the shipping step to the payment step
// (and the checkout call). sessionStorage-backed so it survives the route
// change but not a new tab / fresh session.
const KEY = "khelo-checkout";

export interface CheckoutSession {
  addressId: string;
  contact: OrderContact;
}

export const saveCheckoutSession = (session: CheckoutSession): void => {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(KEY, JSON.stringify(session));
};

export const readCheckoutSession = (): CheckoutSession | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.addressId || !parsed?.contact) return null;
    return parsed as CheckoutSession;
  } catch {
    return null;
  }
};

export const clearCheckoutSession = (): void => {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(KEY);
};
