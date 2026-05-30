"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import type { CartItem } from "@/lib/types/cartTypes";
import {
  type CardBrand,
  detectBrand,
  onlyDigits,
  cvcLengthForBrand,
  formatCardNumber,
  formatExpiry,
} from "@/lib/validations/cardValidations";
import { checkoutOrder } from "@/apiCalls/profileRequests/orders.req";
import {
  readCheckoutSession,
  clearCheckoutSession,
} from "@/lib/checkout/checkoutSession";

export interface PaymentCheckoutState {
  ready: boolean;
  items: CartItem[];
  number: string;
  holder: string;
  expiry: string;
  cvc: string;
  saveCard: boolean;
  brand: CardBrand;
  paying: boolean;
  setNumber: (value: string) => void;
  setHolder: (value: string) => void;
  setExpiry: (value: string) => void;
  setCvc: (value: string) => void;
  setSaveCard: (value: boolean) => void;
  handlePay: () => void;
  goBack: () => void;
}

/**
 * Drives the payment step: card form state, brand-aware input formatting, and
 * route/cart guards (mirrors useShippingCheckout). No client-side validation —
 * the card is validated by the payment processor / backend.
 *
 * NOTE: there is no payment processor wired yet. The PAN/CVC must be sent to a
 * PCI-compliant tokenizing processor, and "save card" should later persist just
 * the returned token + last4 via POST /api/user/cards. Nothing here transmits
 * raw card data.
 */
export const usePaymentCheckout = (): PaymentCheckoutState => {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAuth();
  const { items, isReady } = useCart();
  const { t: tAlerts } = useClientTranslation("alerts");

  const [number, setNumberState] = useState("");
  const [holder, setHolderState] = useState("");
  const [expiry, setExpiryState] = useState("");
  const [cvc, setCvcState] = useState("");
  const [saveCard, setSaveCard] = useState(false);
  const [paying, setPaying] = useState(false);

  const brand = detectBrand(onlyDigits(number));

  // Redirect unauthenticated users to login.
  useEffect(() => {
    if (!isHydrated) return;
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, isHydrated, router]);

  // Bounce back to the cart if it is empty.
  useEffect(() => {
    if (isReady && items.length === 0) router.replace("/cart");
  }, [isReady, items.length, router]);

  const setNumber = (value: string) => setNumberState(formatCardNumber(value));
  const setHolder = (value: string) => setHolderState(value);
  const setExpiry = (value: string) => setExpiryState(formatExpiry(value));
  const setCvc = (value: string) =>
    setCvcState(onlyDigits(value).slice(0, cvcLengthForBrand(brand)));

  const handlePay = async () => {
    // The shipping step stashed the address + contact; without it (e.g. a deep
    // link straight to /cart/payment) we can't place an order.
    const session = readCheckoutSession();
    if (!session) {
      router.replace("/cart/shipping");
      return;
    }
    const token = localStorage.getItem("access-token");
    if (!token) {
      router.replace("/login");
      return;
    }

    // TODO: integrate a tokenizing payment processor here. On success, if
    // `saveCard` is true, persist only the token + last4/brand/expiry via
    // POST /api/user/cards. Never send the raw PAN/CVC to our own API.
    // The backend groups the cart by partner, creates one order each, and
    // empties the cart.
    setPaying(true);
    try {
      await checkoutOrder(token, session);
      clearCheckoutSession();
      router.push("/cart/done");
    } catch {
      setPaying(false);
      toast.error(tAlerts("checkout_failed") || "შეკვეთის გაფორმება ვერ მოხერხდა");
    }
  };

  const goBack = () => router.push("/cart/shipping");

  return {
    ready: isReady && isHydrated,
    items,
    number,
    holder,
    expiry,
    cvc,
    saveCard,
    brand,
    paying,
    setNumber,
    setHolder,
    setExpiry,
    setCvc,
    setSaveCard,
    handlePay,
    goBack,
  };
};
