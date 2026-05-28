import type { IProduct } from "./productTypes";

/** Cart item as returned by the API (product is populated). */
export interface CartItem {
  product: IProduct;
  quantity: number;
  addedAt?: string;
}

/** Server cart shape. */
export interface Cart {
  _id?: string;
  user?: string;
  items: CartItem[];
}

/** Lightweight guest-cart entry stored in localStorage. */
export interface GuestCartEntry {
  productId: string;
  quantity: number;
}
