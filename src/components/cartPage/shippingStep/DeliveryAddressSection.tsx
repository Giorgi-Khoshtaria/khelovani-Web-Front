"use client";

import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import type { Address } from "@/lib/types/addressTypes";
import DeliveryAddressCard from "./DeliveryAddressCard";
import "./deliveryAddressSection.scss";

interface Props {
  addresses: Address[];
  selectedId: string | null;
  busy: boolean;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onEdit: (address: Address) => void;
  onDelete: (id: string) => void;
}

export default function DeliveryAddressSection({
  addresses,
  selectedId,
  busy,
  onSelect,
  onAdd,
  onEdit,
  onDelete,
}: Props) {
  const { t: tPages } = useClientTranslation("pages");

  return (
    <section className="delivery-address">
      <div className="delivery-address__head">
        <span className="delivery-address__step">02</span>
        <div className="delivery-address__head-text">
          <h2 className="delivery-address__title">
            {tPages("shipping.address.title") || "მიწოდების მისამართი"}
          </h2>
          <p className="delivery-address__subtitle">
            {tPages("shipping.address.subtitle") ||
              "აირჩიეთ შენახული მისამართი ან დაამატეთ ახალი."}
          </p>
        </div>
        <button
          type="button"
          className="delivery-address__add"
          onClick={onAdd}
          disabled={busy}
        >
          + {tPages("shipping.address.add") || "მისამართის დამატება"}
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="delivery-address__empty">
          <p>
            {tPages("shipping.address.empty") ||
              "შენახული მისამართები ჯერ არ გაქვთ. დაამატეთ მისამართი მიწოდების გასაგრძელებლად."}
          </p>
        </div>
      ) : (
        <div className="delivery-address__grid">
          {addresses.map((address) => (
            <DeliveryAddressCard
              key={address._id}
              address={address}
              selected={selectedId === address._id}
              busy={busy}
              onSelect={onSelect}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
}
