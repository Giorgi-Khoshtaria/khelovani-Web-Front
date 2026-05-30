"use client";
import { useState } from "react";
import { AddressType } from "@/lib/types/addressTypes";
import type { Address, AddressPayload } from "@/lib/types/addressTypes";
import {
  validateAddressForm,
  type AddressFormData,
} from "@/lib/validations/addressValidations";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import { CITY_OPTIONS } from "@/lib/utils/CityOptions";
import SearchableSelect from "@/components/ui/SearchableSelect/SearchableSelect";
import "./addAddressModal.scss";

interface Props {
  initial?: Address | null;
  saving: boolean;
  onClose: () => void;
  onSubmit: (payload: AddressPayload) => void;
}

const TYPE_TABS: { value: AddressType; key: string; fallback: string }[] = [
  {
    value: AddressType.Home,
    key: "profile.addresses.type_home",
    fallback: "Home",
  },
  {
    value: AddressType.Work,
    key: "profile.addresses.type_work",
    fallback: "Office",
  },
  {
    value: AddressType.Other,
    key: "profile.addresses.type_other",
    fallback: "Other",
  },
];

export default function AddAddressModal({
  initial,
  saving,
  onClose,
  onSubmit,
}: Props) {
  const { t: tPages } = useClientTranslation("pages");
  const { t: tInputs } = useClientTranslation("inputs");
  const { t: tCommon } = useClientTranslation("common");
  const { t: tErr } = useClientTranslation("validation");

  const [form, setForm] = useState<AddressFormData>({
    type: initial?.type ?? AddressType.Home,
    addressLine: initial?.addressLine ?? "",
    city: initial?.city ?? "",
    postalCode: initial?.postalCode ?? "",
    additionalComment: initial?.additionalComment ?? "",
    isDefault: initial?.isDefault ?? false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const patch = (changes: Partial<AddressFormData>) => {
    setForm((prev) => ({ ...prev, ...changes }));
    setErrors((prev) => {
      const next = { ...prev };
      Object.keys(changes).forEach((k) => delete next[k]);
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateAddressForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const typeTab = TYPE_TABS.find((t) => t.value === form.type);
    const label = typeTab ? tPages(typeTab.key) || typeTab.fallback : "";
    onSubmit({
      type: form.type,
      label,
      addressLine: form.addressLine.trim(),
      city: form.city.trim(),
      postalCode: form.postalCode.trim() || undefined,
      additionalComment: form.additionalComment.trim() || undefined,
      isDefault: form.isDefault,
    });
  };

  return (
    <div
      className="address-modal__overlay"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="address-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="address-modal__header">
          <div className="address-modal__title-block">
            <span className="address-modal__eyebrow">
              {initial
                ? tPages("address_modal.eyebrow_edit") ||
                  "Edit delivery address"
                : tPages("address_modal.eyebrow_new") ||
                  "New delivery address"}
            </span>
            <h3 className="address-modal__title">
              {initial
                ? tPages("address_modal.title_edit") || "Edit address"
                : tPages("shipping.address.add") || "Add address"}
            </h3>
          </div>
          <button
            type="button"
            className="address-modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form
          className="address-modal__body"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="address-modal__field">
            <label className="address-modal__label address-modal__label--accent">
              {tPages("address_modal.label") || "Label"}
            </label>
            <div className="address-modal__tabs" role="tablist">
              {TYPE_TABS.map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  role="tab"
                  aria-selected={form.type === tab.value}
                  className={`address-modal__tab${
                    form.type === tab.value ? " address-modal__tab--active" : ""
                  }`}
                  onClick={() => patch({ type: tab.value })}
                >
                  {tPages(tab.key) || tab.fallback}
                </button>
              ))}
            </div>
          </div>

          <div className="address-modal__field">
            <label
              className="address-modal__label"
              htmlFor="address-line"
            >
              {tPages("address_modal.street") || "Street & house no."}{" "}
              <span aria-hidden="true">*</span>
            </label>
            <input
              id="address-line"
              type="text"
              className={`address-modal__input${
                errors.addressLine ? " address-modal__input--error" : ""
              }`}
              placeholder={
                tPages("address_modal.street_placeholder") ||
                "12 Rustaveli Avenue, Apt. 4"
              }
              value={form.addressLine}
              maxLength={200}
              onChange={(e) => patch({ addressLine: e.target.value })}
            />
            {errors.addressLine && (
              <span className="address-modal__error">
                {tErr(errors.addressLine)}
              </span>
            )}
          </div>

          <div className="address-modal__row">
            <div className="address-modal__field">
              <label
                className="address-modal__label address-modal__label--accent"
                htmlFor="address-city"
              >
                {tInputs("label.city") || "ქალაქი"}{" "}
                <span aria-hidden="true">*</span>
              </label>
              <SearchableSelect
                id="address-city"
                value={form.city}
                options={CITY_OPTIONS}
                placeholder={tInputs("placeholder.city") || "აირჩიე ქალაქი"}
                searchPlaceholder={tCommon("search") || "ძებნა"}
                emptyText={tCommon("no_results") || "შედეგი არ მოიძებნა"}
                error={!!errors.city}
                onChange={(v) => patch({ city: v })}
              />
              {errors.city && (
                <span className="address-modal__error">
                  {tErr(errors.city)}
                </span>
              )}
            </div>

            <div className="address-modal__field">
              <label className="address-modal__label" htmlFor="address-postal">
                {tPages("address_modal.postal") || "Postal code"}
              </label>
              <input
                id="address-postal"
                type="text"
                className={`address-modal__input${
                  errors.postalCode ? " address-modal__input--error" : ""
                }`}
                placeholder={tPages("address_modal.postal_placeholder") || "0108"}
                value={form.postalCode}
                maxLength={20}
                onChange={(e) => patch({ postalCode: e.target.value })}
              />
              {errors.postalCode && (
                <span className="address-modal__error">
                  {tErr(errors.postalCode)}
                </span>
              )}
            </div>
          </div>

          <div className="address-modal__field">
            <label
              className="address-modal__label address-modal__label--accent"
              htmlFor="address-notes"
            >
              {tPages("address_modal.notes") || "Delivery notes"}{" "}
              <span className="address-modal__optional">
                {tPages("address_modal.optional") || "Optional"}
              </span>
            </label>
            <input
              id="address-notes"
              type="text"
              className={`address-modal__input${
                errors.additionalComment
                  ? " address-modal__input--error"
                  : ""
              }`}
              placeholder={
                tPages("address_modal.notes_placeholder") ||
                "Gate code, doorman, etc."
              }
              value={form.additionalComment}
              maxLength={300}
              onChange={(e) =>
                patch({ additionalComment: e.target.value })
              }
            />
            {errors.additionalComment && (
              <span className="address-modal__error">
                {tErr(errors.additionalComment)}
              </span>
            )}
          </div>

          <label className="address-modal__checkbox">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={(e) => patch({ isDefault: e.target.checked })}
            />
            <span className="address-modal__checkbox-box" aria-hidden="true">
              {form.isDefault && <span>✓</span>}
            </span>
            <span className="address-modal__checkbox-text">
              {tPages("address_modal.make_default") ||
                "Make this my default delivery address"}
            </span>
          </label>

          <div className="address-modal__footer">
            <button
              type="button"
              className="address-modal__cancel"
              onClick={onClose}
              disabled={saving}
            >
              {tPages("address_modal.cancel") || "Cancel"}
            </button>
            <button
              type="submit"
              className="address-modal__submit"
              disabled={saving}
            >
              <span>
                {tPages("address_modal.save") || "Save address"}
              </span>
              <span aria-hidden="true">✓</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
