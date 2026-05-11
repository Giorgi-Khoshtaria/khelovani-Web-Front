import type { Metadata } from "next";
import CartPage from "@/components/cartPage/CartPage";

export const metadata: Metadata = {
  title: "Cart | Khelovani",
};

export default function Page() {
  return (
    <main>
      <CartPage />
    </main>
  );
}
