"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { getProfile } from "@/apiCalls/profileRequests/profile.req";

export interface OrderConfirmationState {
  ready: boolean;
  name: string;
  email: string;
  trackOrder: () => void;
}

/**
 * Terminal checkout step: loads the buyer's name/email for the thank-you
 * message and empties the cart now that the order is placed.
 */
export const useOrderConfirmation = (): OrderConfirmationState => {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAuth();
  const { clear } = useCart();
  const { lang } = useLanguage();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [ready, setReady] = useState(false);
  const doneRef = useRef(false);

  useEffect(() => {
    if (!isHydrated) return;
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (doneRef.current) return;
    doneRef.current = true;

    const token = localStorage.getItem("access-token");
    if (!token) {
      router.replace("/login");
      return;
    }

    getProfile(token)
      .then((p) => {
        const preferGe = lang.toLowerCase() === "ge";
        setName(preferGe ? p.nameGe || p.nameEn || "" : p.nameEn || p.nameGe || "");
        setEmail(p.email ?? "");
      })
      .catch(() => undefined)
      .finally(() => setReady(true));

    // Order placed — empty the cart (fire and forget).
    void clear();
  }, [isAuthenticated, isHydrated, router, lang, clear]);

  const trackOrder = () => router.push("/orders");

  return { ready, name, email, trackOrder };
};
