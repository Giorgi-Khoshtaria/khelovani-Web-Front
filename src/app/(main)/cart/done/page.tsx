"use client";

import { useOrderConfirmation } from "@/lib/hooks/useOrderConfirmation";
import CheckoutStepper from "@/components/cartPage/cartStep/CheckoutStepper";
import OrderConfirmed from "@/components/cartPage/doneStep/OrderConfirmed";
import "./doneStep.scss";

export default function DonePage() {
  const o = useOrderConfirmation();

  if (!o.ready) {
    return (
      <div>
        <section className="done-step">
          <div className="done-step__loading">
            <span className="spinner" />
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <section className="done-step">
        <CheckoutStepper active="done" />
        <OrderConfirmed name={o.name} email={o.email} onTrack={o.trackOrder} />
      </section>
    </div>
  );
}
