"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import CartHeader from "@/components/cartPage/cartStep/CartHeader";
import CheckoutStepper from "@/components/cartPage/cartStep/CheckoutStepper";
import CartItemsList from "@/components/cartPage/cartStep/CartItemsList";
import OrderSummary from "@/components/cartPage/orderSummary/OrderSummary";
import CartEmpty from "@/components/cartPage/cartStep/CartEmpty";
import "./cartPage.scss";

export default function CartPage() {
  const router = useRouter();
  const { items, isReady, totalItems } = useCart();
  const { t: tPages } = useClientTranslation("pages");
  const { t: tNav } = useClientTranslation("navigation");

  if (!isReady) {
    return (
      <div>
        <section className="cart-page">
          <div className="cart-page__loading">
            <span className="spinner" />
          </div>
        </section>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div>
        <section className="cart-page">
          <CartHeader pieces={0} />
          <CheckoutStepper active="cart" />
          <CartEmpty
            message={tPages("cart.empty") || "თქვენი კალათა ცარიელია"}
            ctaLabel={tNav("back_to_shop") || "მაღაზიაში დაბრუნება"}
            onShop={() => router.push("/products")}
          />
        </section>
      </div>
    );
  }

  return (
    <div>
      <section className="cart-page">
        <CartHeader pieces={totalItems} />
        <CheckoutStepper active="cart" />

        <div className="cart-page__layout">
          <div className="cart-page__main">
            <CartItemsList items={items} />
          </div>
          <aside className="cart-page__aside">
            <OrderSummary
              items={items}
              variant="cart"
              onAction={() => router.push("/cart/shipping")}
            />
          </aside>
        </div>
      </section>
    </div>
  );
}
