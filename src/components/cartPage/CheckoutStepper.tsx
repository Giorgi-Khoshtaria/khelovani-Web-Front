"use client";

import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import "./checkoutStepper.scss";

export type CheckoutStep = "cart" | "shipping" | "payment" | "done";

interface Props {
  active: CheckoutStep;
}

const STEPS: { id: CheckoutStep; key: string; fallback: string }[] = [
  { id: "cart", key: "cart.step.cart", fallback: "კალათა" },
  { id: "shipping", key: "cart.step.shipping", fallback: "მიწოდება" },
  { id: "payment", key: "cart.step.payment", fallback: "გადახდა" },
  { id: "done", key: "cart.step.done", fallback: "მზადაა" },
];

export default function CheckoutStepper({ active }: Props) {
  const { t: tPages } = useClientTranslation("pages");
  const activeIndex = STEPS.findIndex((s) => s.id === active);

  return (
    <ol className="checkout-stepper" aria-label="checkout progress">
      {STEPS.map((step, idx) => {
        const isActive = idx === activeIndex;
        const isDone = idx < activeIndex;
        return (
          <li
            key={step.id}
            className={`checkout-stepper__step${
              isActive ? " checkout-stepper__step--active" : ""
            }${isDone ? " checkout-stepper__step--done" : ""}`}
          >
            <span className="checkout-stepper__bullet" aria-hidden="true">
              {idx + 1}
            </span>
            <span className="checkout-stepper__label">
              {tPages(step.key) || step.fallback}
            </span>
            {idx < STEPS.length - 1 && (
              <span
                className="checkout-stepper__connector"
                aria-hidden="true"
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
