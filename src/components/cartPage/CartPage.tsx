"use client";

import Link from "next/link";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import "./cartPage.scss";

export default function CartPage() {
  const { t: tPages } = useClientTranslation("pages");
  const { t: tNav } = useClientTranslation("navigation");

  return (
    <section className="cart-page">
      <h1 className="cart-page__title">{tPages("cart.title")}</h1>

      <div className="cart-page__empty">
        <svg
          width="56"
          height="56"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
        <p className="cart-page__empty-text">{tPages("cart.empty")}</p>
        <Link href="/products" className="cart-page__cta">
          {tNav("back_to_shop")}
        </Link>
      </div>
    </section>
  );
}
