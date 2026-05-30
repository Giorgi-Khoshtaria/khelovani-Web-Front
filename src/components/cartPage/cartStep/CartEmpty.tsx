"use client";

import Button from "@/components/ui/Button";
import { CartIcon } from "@/lib/icons";

interface Props {
  message: string;
  ctaLabel: string;
  onShop: () => void;
}

export default function CartEmpty({ message, ctaLabel, onShop }: Props) {
  return (
    <div className="cart-page__empty">
      <CartIcon size={56} />
      <p className="cart-page__empty-text">{message}</p>
      <Button variant="primary" onClick={onShop}>
        {ctaLabel}
      </Button>
    </div>
  );
}
