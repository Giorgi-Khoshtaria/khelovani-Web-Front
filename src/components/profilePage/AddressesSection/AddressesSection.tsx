"use client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getAddresses,
  addAddress,
  updateAddress,
  setDefaultAddress,
  deleteAddress,
} from "@/apiCalls/profileRequests/addresses.req";
import type { Address, AddressPayload } from "@/lib/types/addressTypes";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import AddressItem from "./AddressItem";
import AddAddressModal from "./AddAddressModal";
import "./addressesSection.scss";

export default function AddressesSection() {
  const { t: tAlerts } = useClientTranslation("alerts");
  const { t: tPages } = useClientTranslation("pages");

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access-token");
    if (!token) {
      setLoading(false);
      return;
    }
    getAddresses(token)
      .then(setAddresses)
      .catch(() => toast.error(tAlerts("error") || "შეცდომა"))
      .finally(() => setLoading(false));
  }, [tAlerts]);

  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (address: Address) => {
    setEditing(address);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  const handleSubmit = async (payload: AddressPayload) => {
    const token = localStorage.getItem("access-token");
    if (!token) return;
    setBusy(true);
    try {
      if (editing) {
        await updateAddress(token, editing._id, payload);
        toast.success(tAlerts("address_updated") || "მისამართი განახლდა");
      } else {
        await addAddress(token, payload);
        toast.success(tAlerts("address_added") || "მისამართი დაემატა");
      }
      setAddresses(await getAddresses(token));
      closeModal();
    } catch {
      toast.error(tAlerts("error") || "შეცდომა");
    } finally {
      setBusy(false);
    }
  };

  const handleSetDefault = async (id: string) => {
    const token = localStorage.getItem("access-token");
    if (!token) return;
    setBusy(true);
    try {
      setAddresses(await setDefaultAddress(token, id));
    } catch {
      toast.error(tAlerts("error") || "შეცდომა");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("access-token");
    if (!token) return;
    if (
      !window.confirm(
        tPages("profile.addresses.delete_confirm") || "წავშალო ეს მისამართი?",
      )
    )
      return;
    setBusy(true);
    try {
      await deleteAddress(token, id);
      setAddresses(await getAddresses(token));
      toast.success(tAlerts("address_deleted") || "მისამართი წაიშალა");
    } catch {
      toast.error(tAlerts("error") || "შეცდომა");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="addresses-section">
      <div className="addresses-section__header">
        <h2 className="addresses-section__title">
          {tPages("profile.addresses.title") || "ჩემი მისამართები"}
        </h2>
        <button
          type="button"
          className="addresses-section__add-btn"
          onClick={openAdd}
          disabled={busy}
        >
          + {tPages("profile.addresses.add") || "მისამართის დამატება"}
        </button>
      </div>

      {loading ? (
        <div className="addresses-section__loading">
          <span className="spinner" />
        </div>
      ) : addresses.length === 0 ? (
        <div className="addresses-section__empty">
          <p>
            {tPages("profile.addresses.empty") ||
              "შენახული მისამართები არ გაქვს"}
          </p>
        </div>
      ) : (
        <div className="addresses-section__grid">
          {addresses.map((address) => (
            <AddressItem
              key={address._id}
              address={address}
              busy={busy}
              onSetDefault={handleSetDefault}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {modalOpen && (
        <AddAddressModal
          initial={editing}
          saving={busy}
          onClose={closeModal}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
