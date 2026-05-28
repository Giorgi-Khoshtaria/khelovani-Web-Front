"use client";

import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import "./cartHeader.scss";

interface Props {
  pieces: number;
}

export default function CartHeader({ pieces }: Props) {
  const { t: tPages } = useClientTranslation("pages");

  return (
    <header className="cart-header">
      <div className="cart-header__title-row">
        <h1 className="cart-header__title">
          {tPages("cart.title_prefix") || "შენი"}{" "}
          <em className="cart-header__title-em">
            {tPages("cart.title_word") || "კალათა"}
          </em>
        </h1>
        {pieces > 0 && (
          <span className="cart-header__pieces" aria-live="polite">
            {pieces} {tPages("cart.pieces") || "ნივთი"}
          </span>
        )}
      </div>
    </header>
  );
}
