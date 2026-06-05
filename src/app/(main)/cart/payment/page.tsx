"use client";

import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import { usePaymentCheckout } from "@/lib/hooks/usePaymentCheckout";
import CheckoutStepper from "@/components/cartPage/cartStep/CheckoutStepper";
import OrderSummary from "@/components/cartPage/orderSummary/OrderSummary";
import PaymentHeader from "@/components/cartPage/paymentStep/PaymentHeader";
import CardDetailsForm from "@/components/cartPage/paymentStep/CardDetailsForm";
import BackToShipping from "@/components/cartPage/paymentStep/BackToShipping";
import "./paymentStep.scss";

export default function PaymentPage() {
  const p = usePaymentCheckout();
  const { t: tPages } = useClientTranslation("pages");

  if (!p.ready) {
    return (
      <div>
        <section className="payment-step">
          <div className="payment-step__loading">
            <span className="spinner" />
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <section className="payment-step">
        <PaymentHeader
          title={tPages("payment.title_word") || "გადახდა"}
          titlePrefix={tPages("payment.title_prefix") || "უსაფრთხო"}
          stepLabel={tPages("payment.step_indicator") || "ნაბიჯი 3 / 4"}
        />
        <CheckoutStepper active="payment" />

        <div className="payment-step__layout">
          <div className="payment-step__main">
            <CardDetailsForm
              number={p.number}
              holder={p.holder}
              expiry={p.expiry}
              cvc={p.cvc}
              brand={p.brand}
              saveCard={p.saveCard}
              errors={p.errors}
              onNumberChange={p.setNumber}
              onHolderChange={p.setHolder}
              onExpiryChange={p.setExpiry}
              onCvcChange={p.setCvc}
              onSaveCardChange={p.setSaveCard}
            />
            <BackToShipping onClick={p.goBack} />
          </div>
          <aside className="payment-step__aside">
            <OrderSummary
              items={p.items}
              variant="payment"
              onAction={p.handlePay}
              actionDisabled={p.paying}
            />
          </aside>
        </div>
      </section>
    </div>
  );
}
