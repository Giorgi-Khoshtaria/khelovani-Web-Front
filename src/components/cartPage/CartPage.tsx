"use client";

import { useRouter } from "next/navigation";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import Button from "@/components/ui/Button";
import { CartIcon } from "@/lib/icons";
import "./cartPage.scss";

export default function CartPage() {
  const router = useRouter();
  const { t: tPages } = useClientTranslation("pages");
  const { t: tNav } = useClientTranslation("navigation");

  return (
    <section className="cart-page">
      <h1 className="cart-page__title">{tPages("cart.title")}</h1>

      <div className="cart-page__empty">
        <CartIcon size={56} />
        <p className="cart-page__empty-text">{tPages("cart.empty")}</p>
        <Button variant="primary" onClick={() => router.push("/products")}>
          {tNav("back_to_shop")}
        </Button>
      </div>
    </section>
  );
}
