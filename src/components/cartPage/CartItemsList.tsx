"use client";

import type { CartItem as CartItemType } from "@/lib/types/cartTypes";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import CartItem from "./CartItem";
import "./cartItemsList.scss";

interface Props {
  items: CartItemType[];
}

export default function CartItemsList({ items }: Props) {
  const { t: tPages } = useClientTranslation("pages");

  return (
    <div className="cart-items-list">
      <div
        className="cart-items-list__head"
        role="row"
        aria-label={tPages("cart.headers.row") || "სვეტები"}
      >
        <span className="cart-items-list__head-cell">
          {tPages("cart.headers.product") || "ნივთი"}
        </span>
        <span className="cart-items-list__head-cell cart-items-list__head-cell--qty">
          {tPages("cart.headers.quantity") || "რაოდენობა"}
        </span>
        <span className="cart-items-list__head-cell cart-items-list__head-cell--price">
          {tPages("cart.headers.price") || "ფასი"}
        </span>
      </div>

      <ul className="cart-items-list__items">
        {items.map((item) => (
          <li key={item.product._id} className="cart-items-list__item">
            <CartItem item={item} />
          </li>
        ))}
      </ul>
    </div>
  );
}
