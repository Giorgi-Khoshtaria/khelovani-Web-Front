"use client";

import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import { useShippingCheckout } from "@/lib/hooks/useShippingCheckout";
import CheckoutStepper from "@/components/cartPage/cartStep/CheckoutStepper";
import AddAddressModal from "@/components/profilePage/AddressesSection/AddAddressModal";
import ShippingHeader from "@/components/cartPage/shippingStep/ShippingHeader";
import ContactInfoSection from "@/components/cartPage/shippingStep/ContactInfoSection";
import DeliveryAddressSection from "@/components/cartPage/shippingStep/DeliveryAddressSection";
import OrderSummary from "@/components/cartPage/orderSummary/OrderSummary";
import "./shippingStep.scss";

export default function ShippingPage() {
  const s = useShippingCheckout();
  const { t: tPages } = useClientTranslation("pages");

  if (!s.ready) {
    return (
      <div>
        <section className="shipping-step">
          <div className="shipping-step__loading">
            <span className="spinner" />
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <section className="shipping-step">
        <ShippingHeader
          title={tPages("shipping.title_word") || "მიწოდება"}
          titlePrefix={tPages("shipping.title_prefix") || "თქვენი"}
          stepLabel={tPages("shipping.step_indicator") || "ნაბიჯი 2 / 4"}
        />
        <CheckoutStepper active="shipping" />

        <div className="shipping-step__layout">
          <div className="shipping-step__main">
            <ContactInfoSection
              person={s.contactPerson}
              email={s.contactEmail}
              phone={s.contactPhone}
              errors={s.contactErrors}
              onPersonChange={s.setContactPerson}
              onEmailChange={s.setContactEmail}
              onPhoneChange={s.setContactPhone}
            />
            <DeliveryAddressSection
              addresses={s.addresses}
              selectedId={s.selectedId}
              busy={s.busy}
              onSelect={s.selectAddress}
              onAdd={s.openAdd}
              onEdit={s.openEdit}
              onDelete={s.handleDelete}
            />
          </div>
          <aside className="shipping-step__aside">
            <OrderSummary
              items={s.items}
              variant="shipping"
              onAction={s.handleContinue}
            />
          </aside>
        </div>

        {s.modalOpen && (
          <AddAddressModal
            initial={s.editing}
            saving={s.busy}
            onClose={s.closeModal}
            onSubmit={s.handleSubmit}
          />
        )}
      </section>
    </div>
  );
}
