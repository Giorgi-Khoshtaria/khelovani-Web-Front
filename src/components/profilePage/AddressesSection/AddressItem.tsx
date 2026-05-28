"use client";
import { AddressType } from "@/lib/types/addressTypes";
import type { Address } from "@/lib/types/addressTypes";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import "./addressItem.scss";

interface Props {
  address: Address;
  busy: boolean;
  onSetDefault: (id: string) => void;
  onEdit: (address: Address) => void;
  onDelete: (id: string) => void;
}

const TYPE_LABEL: Record<AddressType, { key: string; fallback: string }> = {
  [AddressType.Home]: { key: "profile.addresses.type_home", fallback: "სახლი" },
  [AddressType.Work]: {
    key: "profile.addresses.type_work",
    fallback: "ოფისი",
  },
  [AddressType.Family]: {
    key: "profile.addresses.type_family",
    fallback: "ოჯახი",
  },
  [AddressType.Other]: { key: "profile.addresses.type_other", fallback: "სხვა" },
};

export default function AddressItem({
  address,
  busy,
  onSetDefault,
  onEdit,
  onDelete,
}: Props) {
  const { t } = useClientTranslation("pages");
  const typeLabel = TYPE_LABEL[address.type];

  return (
    <div className="address-item">
      <div className="address-item__top">
        <span
          className={`address-item__type address-item__type--${address.type}`}
        >
          {(typeLabel && (t(typeLabel.key) || typeLabel.fallback)) ||
            address.type}
        </span>
        {address.isDefault && (
          <span className="address-item__default">
            {t("profile.addresses.default") || "ნაგულისხმევი"}
          </span>
        )}
      </div>

      <h3 className="address-item__label">{address.label}</h3>
      <p className="address-item__line">{address.addressLine}</p>

      {address.formattedAddress && (
        <p className="address-item__resolved">{address.formattedAddress}</p>
      )}

      {address.additionalComment && (
        <p className="address-item__comment">{address.additionalComment}</p>
      )}

      <div className="address-item__actions">
        {!address.isDefault && (
          <button
            type="button"
            className="address-item__action"
            onClick={() => onSetDefault(address._id)}
            disabled={busy}
          >
            {t("profile.addresses.set_default") || "ნაგულისხმევად დაყენება"}
          </button>
        )}
        <button
          type="button"
          className="address-item__action"
          onClick={() => onEdit(address)}
          disabled={busy}
        >
          {t("profile.addresses.edit") || "რედაქტირება"}
        </button>
        <button
          type="button"
          className="address-item__action address-item__action--delete"
          onClick={() => onDelete(address._id)}
          disabled={busy}
        >
          {t("profile.addresses.delete") || "წაშლა"}
        </button>
      </div>
    </div>
  );
}
