"use client";

import { AddressType } from "@/lib/types/addressTypes";
import type { Address } from "@/lib/types/addressTypes";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import "./deliveryAddressCard.scss";

interface Props {
  address: Address;
  selected: boolean;
  busy: boolean;
  onSelect: (id: string) => void;
  onEdit: (address: Address) => void;
  onDelete: (id: string) => void;
}

const TYPE_LABEL: Partial<
  Record<AddressType, { key: string; fallback: string }>
> = {
  [AddressType.Home]: { key: "profile.addresses.type_home", fallback: "სახლი" },
  [AddressType.Work]: {
    key: "profile.addresses.type_work",
    fallback: "ოფისი",
  },
  [AddressType.Other]: {
    key: "profile.addresses.type_other",
    fallback: "სხვა",
  },
};

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path
      d="M4 20h4l10.5-10.5a2.121 2.121 0 0 0-3-3L5 17v3z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path
      d="M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function DeliveryAddressCard({
  address,
  selected,
  busy,
  onSelect,
  onEdit,
  onDelete,
}: Props) {
  const { t: tPages } = useClientTranslation("pages");
  const typeLabel = TYPE_LABEL[address.type];

  return (
    <div
      className={`delivery-address-card${
        selected ? " delivery-address-card--selected" : ""
      }`}
      role="button"
      tabIndex={0}
      onClick={() => onSelect(address._id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(address._id);
        }
      }}
    >
      <div className="delivery-address-card__top">
        <span
          className="delivery-address-card__radio"
          aria-checked={selected}
          role="radio"
        >
          {selected && <span className="delivery-address-card__radio-dot" />}
        </span>
        {typeLabel && (
          <span className="delivery-address-card__type">
            {tPages(typeLabel.key) || typeLabel.fallback}
          </span>
        )}
        {address.isDefault && (
          <span className="delivery-address-card__default">
            {tPages("shipping.address.default_badge") || "ნაგულისხმევი"}
          </span>
        )}
        <div className="delivery-address-card__actions">
          <button
            type="button"
            className="delivery-address-card__icon-btn"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(address);
            }}
            disabled={busy}
            aria-label={tPages("profile.addresses.edit") || "რედაქტირება"}
          >
            <EditIcon />
          </button>
          <button
            type="button"
            className="delivery-address-card__icon-btn delivery-address-card__icon-btn--danger"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(address._id);
            }}
            disabled={busy}
            aria-label={tPages("profile.addresses.delete") || "წაშლა"}
          >
            <TrashIcon />
          </button>
        </div>
      </div>

      <h3 className="delivery-address-card__label">{address.label}</h3>
      <p className="delivery-address-card__line">{address.addressLine}</p>
      {address.formattedAddress && (
        <p className="delivery-address-card__resolved">
          {address.formattedAddress}
        </p>
      )}
      {address.additionalComment && (
        <p className="delivery-address-card__comment">
          {address.additionalComment}
        </p>
      )}
    </div>
  );
}
