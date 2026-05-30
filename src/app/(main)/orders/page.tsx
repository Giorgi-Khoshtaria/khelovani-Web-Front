"use client";

import { useOrders } from "@/lib/hooks/useOrders";
import OrdersHero from "@/components/ordersPage/OrdersHero/OrdersHero";
import OrderStatusTabs from "@/components/ordersPage/OrderStatusTabs/OrderStatusTabs";
import OrderList from "@/components/ordersPage/OrderList/OrderList";
import "./orders.scss";

export default function OrdersPage() {
  const o = useOrders();

  if (!o.ready) {
    return (
      <main>
        <section className="orders-page">
          <div className="orders-page__loading">
            <span className="spinner" />
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="orders-page">
        <OrdersHero search={o.search} onSearchChange={o.setSearch} />
        <OrderStatusTabs
          counts={o.counts}
          active={o.activeStatus}
          onChange={o.setActiveStatus}
        />
        <OrderList orders={o.orders} />
      </section>
    </main>
  );
}
