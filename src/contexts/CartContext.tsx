"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "react-toastify";
import { useAuth } from "@/contexts/AuthContext";
import { getProductById } from "@/apiCalls/productRequests/product.req";
import {
  getCart as apiGetCart,
  addToCart as apiAddToCart,
  updateCartItem as apiUpdateCartItem,
  removeCartItem as apiRemoveCartItem,
  clearCart as apiClearCart,
  mergeCart as apiMergeCart,
} from "@/apiCalls/cartRequests/cart.req";
import type { CartItem, GuestCartEntry } from "@/lib/types/cartTypes";
import type { IProduct } from "@/lib/types/productTypes";

const GUEST_KEY = "khelovani-guest-cart";

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  isReady: boolean;
  totalItems: number;
  addItem: (product: IProduct, quantity?: number) => Promise<void>;
  updateItem: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clear: () => Promise<void>;
  refresh: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// ─── localStorage helpers ────────────────────────────────────────────────────

const readGuestCart = (): GuestCartEntry[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(GUEST_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (e) =>
        e &&
        typeof e.productId === "string" &&
        typeof e.quantity === "number" &&
        e.quantity > 0,
    );
  } catch {
    return [];
  }
};

const writeGuestCart = (entries: GuestCartEntry[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(GUEST_KEY, JSON.stringify(entries));
};

const clearGuestCart = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(GUEST_KEY);
};

// ─── Provider ────────────────────────────────────────────────────────────────

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isHydrated } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const wasAuthed = useRef<boolean | null>(null);

  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0);

  /** Build a guest cart's items array by fetching each product. Missing
   *  products are silently dropped and localStorage is rewritten. */
  const hydrateGuestCart = useCallback(async () => {
    const entries = readGuestCart();
    if (entries.length === 0) {
      setItems([]);
      return;
    }
    const results = await Promise.all(
      entries.map(async (e) => {
        try {
          const product = await getProductById(e.productId);
          return { product, quantity: e.quantity } as CartItem;
        } catch {
          return null;
        }
      }),
    );
    const cleaned = results.filter((x): x is CartItem => x !== null);
    setItems(cleaned);
    writeGuestCart(
      cleaned.map((i) => ({ productId: i.product._id, quantity: i.quantity })),
    );
  }, []);

  const refresh = useCallback(async () => {
    if (!isHydrated) return;
    setLoading(true);
    try {
      if (isAuthenticated) {
        const cart = await apiGetCart();
        setItems(cart.items);
      } else {
        await hydrateGuestCart();
      }
    } catch {
      // 401 handled by axios interceptor; nothing useful to surface here.
    } finally {
      setLoading(false);
      setIsReady(true);
    }
  }, [isAuthenticated, isHydrated, hydrateGuestCart]);

  // Hydration + merge-on-login
  useEffect(() => {
    if (!isHydrated) return;

    const justLoggedIn =
      wasAuthed.current === false && isAuthenticated === true;
    wasAuthed.current = isAuthenticated;

    const run = async () => {
      if (justLoggedIn) {
        const guestEntries = readGuestCart();
        if (guestEntries.length > 0) {
          setLoading(true);
          try {
            const cart = await apiMergeCart(guestEntries);
            setItems(cart.items);
            clearGuestCart();
          } catch {
            // fall through to plain refresh
            await refresh();
          } finally {
            setLoading(false);
            setIsReady(true);
          }
          return;
        }
      }
      await refresh();
    };

    run();
  }, [isAuthenticated, isHydrated, refresh]);

  // ── Mutations ──────────────────────────────────────────────────────────

  const addItem = useCallback(
    async (product: IProduct, quantity = 1) => {
      if (product.stockQuantity <= 0) return;
      setLoading(true);
      try {
        if (isAuthenticated) {
          const cart = await apiAddToCart(product._id, quantity);
          setItems(cart.items);
        } else {
          const entries = readGuestCart();
          const existing = entries.find((e) => e.productId === product._id);
          if (existing) {
            existing.quantity = Math.min(
              existing.quantity + quantity,
              product.stockQuantity,
              99,
            );
          } else {
            entries.push({
              productId: product._id,
              quantity: Math.min(quantity, product.stockQuantity, 99),
            });
          }
          writeGuestCart(entries);
          setItems((prev) => {
            const idx = prev.findIndex((p) => p.product._id === product._id);
            if (idx >= 0) {
              const updated = [...prev];
              const newQty = Math.min(
                updated[idx].quantity + quantity,
                product.stockQuantity,
                99,
              );
              updated[idx] = { ...updated[idx], quantity: newQty };
              return updated;
            }
            return [
              ...prev,
              {
                product,
                quantity: Math.min(quantity, product.stockQuantity, 99),
              },
            ];
          });
        }
      } catch {
        toast.error("შეცდომა");
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated],
  );

  const updateItem = useCallback(
    async (productId: string, quantity: number) => {
      if (quantity < 1) return removeItem(productId);
      setLoading(true);
      try {
        if (isAuthenticated) {
          const cart = await apiUpdateCartItem(productId, quantity);
          setItems(cart.items);
        } else {
          const entries = readGuestCart();
          const entry = entries.find((e) => e.productId === productId);
          if (entry) {
            entry.quantity = Math.min(quantity, 99);
            writeGuestCart(entries);
          }
          setItems((prev) =>
            prev.map((i) =>
              i.product._id === productId
                ? {
                    ...i,
                    quantity: Math.min(
                      quantity,
                      i.product.stockQuantity,
                      99,
                    ),
                  }
                : i,
            ),
          );
        }
      } catch {
        toast.error("შეცდომა");
      } finally {
        setLoading(false);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [isAuthenticated],
  );

  const removeItem = useCallback(
    async (productId: string) => {
      setLoading(true);
      try {
        if (isAuthenticated) {
          const cart = await apiRemoveCartItem(productId);
          setItems(cart.items);
        } else {
          const entries = readGuestCart().filter(
            (e) => e.productId !== productId,
          );
          writeGuestCart(entries);
          setItems((prev) => prev.filter((i) => i.product._id !== productId));
        }
      } catch {
        toast.error("შეცდომა");
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated],
  );

  const clear = useCallback(async () => {
    setLoading(true);
    try {
      if (isAuthenticated) {
        await apiClearCart();
      } else {
        clearGuestCart();
      }
      setItems([]);
    } catch {
      toast.error("შეცდომა");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        isReady,
        totalItems,
        addItem,
        updateItem,
        removeItem,
        clear,
        refresh,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};
