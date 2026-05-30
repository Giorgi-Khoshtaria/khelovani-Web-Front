"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import {
  getAddresses,
  addAddress,
  updateAddress,
  setDefaultAddress,
  deleteAddress,
} from "@/apiCalls/profileRequests/addresses.req";
import {
  getProfile,
  type ProfileData,
} from "@/apiCalls/profileRequests/profile.req";
import type { Address, AddressPayload } from "@/lib/types/addressTypes";
import type { CartItem } from "@/lib/types/cartTypes";
import { saveCheckoutSession } from "@/lib/checkout/checkoutSession";
import { z } from "zod";
import { emailSchema, phoneSchema } from "@/lib/validations/shared/zodHelpers";

const contactPersonSchema = z
  .string()
  .trim()
  .min(1, "contactPerson_required")
  .min(2, "contactPerson_min_length")
  .max(100, "contactPerson_max_length");

export interface ContactErrors {
  person?: string;
  email?: string;
  phone?: string;
}

export interface ShippingCheckoutState {
  ready: boolean;
  profile: ProfileData | null;
  addresses: Address[];
  selectedId: string | null;
  busy: boolean;
  modalOpen: boolean;
  editing: Address | null;
  items: CartItem[];
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  contactErrors: ContactErrors;
  setContactPerson: (value: string) => void;
  setContactEmail: (value: string) => void;
  setContactPhone: (value: string) => void;
  logout: () => void;
  selectAddress: (id: string) => void;
  openAdd: () => void;
  openEdit: (address: Address) => void;
  closeModal: () => void;
  handleSubmit: (payload: AddressPayload) => Promise<void>;
  handleDelete: (id: string) => Promise<void>;
  handleContinue: () => void;
}

const validatePerson = (value: string): string | undefined => {
  const res = contactPersonSchema.safeParse(value);
  return res.success ? undefined : res.error.issues[0]?.message;
};

const validateEmail = (value: string): string | undefined => {
  const res = emailSchema(150).safeParse(value);
  return res.success ? undefined : res.error.issues[0]?.message;
};

const validatePhone = (value: string): string | undefined => {
  const res = phoneSchema.safeParse(value);
  return res.success ? undefined : res.error.issues[0]?.message;
};

export const useShippingCheckout = (): ShippingCheckoutState => {
  const router = useRouter();
  const { isAuthenticated, isHydrated, logout } = useAuth();
  const { items, isReady } = useCart();
  const { lang } = useLanguage();
  const { t: tPages } = useClientTranslation("pages");
  const { t: tAlerts } = useClientTranslation("alerts");

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);
  const [contactPerson, setContactPersonState] = useState("");
  const [contactEmail, setContactEmailState] = useState("");
  const [contactPhone, setContactPhoneState] = useState("");
  const [contactErrors, setContactErrors] = useState<ContactErrors>({});
  const fetchedRef = useRef(false);

  const setContactPerson = (value: string) => {
    setContactPersonState(value);
    setContactErrors((prev) => ({ ...prev, person: undefined }));
  };

  const setContactEmail = (value: string) => {
    setContactEmailState(value);
    setContactErrors((prev) => ({ ...prev, email: undefined }));
  };

  const setContactPhone = (value: string) => {
    setContactPhoneState(value);
    setContactErrors((prev) => ({ ...prev, phone: undefined }));
  };

  useEffect(() => {
    if (!isHydrated) return;
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (fetchedRef.current) return;
    const token = localStorage.getItem("access-token");
    if (!token) {
      router.replace("/login");
      return;
    }
    fetchedRef.current = true;
    Promise.all([getProfile(token), getAddresses(token)])
      .then(([p, list]) => {
        setProfile(p);
        const preferGe = lang.toLowerCase() === "ge";
        setContactPersonState(
          preferGe ? p.nameGe || p.nameEn || "" : p.nameEn || p.nameGe || "",
        );
        setContactEmailState(p.email ?? "");
        setContactPhoneState(p.phone ?? "");
        setAddresses(list);
        const def = list.find((a) => a.isDefault);
        setSelectedId(def?._id ?? list[0]?._id ?? null);
      })
      .catch(() => toast.error(tAlerts("error") || "შეცდომა"))
      .finally(() => setLoading(false));
  }, [isAuthenticated, isHydrated, router, tAlerts]);

  useEffect(() => {
    if (isReady && items.length === 0) router.replace("/cart");
  }, [isReady, items.length, router]);

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
        setAddresses(await getAddresses(token));
      } else {
        const created = await addAddress(token, payload);
        toast.success(tAlerts("address_added") || "მისამართი დაემატა");
        let fresh = await getAddresses(token);
        const alreadyDefault = fresh.find(
          (a) => a._id === created._id,
        )?.isDefault;
        if (!alreadyDefault) {
          const wantDefault = window.confirm(
            tPages("shipping.address.set_default_confirm") ||
              "გსურთ ეს მისამართი დააყენოთ ნაგულისხმევად?",
          );
          if (wantDefault) {
            await setDefaultAddress(token, created._id);
            fresh = await getAddresses(token);
          }
        }
        setAddresses(fresh);
        setSelectedId(created._id);
      }
      closeModal();
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
      const fresh = await getAddresses(token);
      setAddresses(fresh);
      if (selectedId === id) {
        const def = fresh.find((a) => a.isDefault);
        setSelectedId(def?._id ?? fresh[0]?._id ?? null);
      }
      toast.success(tAlerts("address_deleted") || "მისამართი წაიშალა");
    } catch {
      toast.error(tAlerts("error") || "შეცდომა");
    } finally {
      setBusy(false);
    }
  };

  const handleContinue = () => {
    const errs: ContactErrors = {
      person: validatePerson(contactPerson),
      email: validateEmail(contactEmail),
      phone: validatePhone(contactPhone),
    };
    setContactErrors(errs);
    if (errs.person || errs.email || errs.phone) return;
    if (!selectedId) {
      toast.warning(
        tPages("shipping.no_address_selected") ||
          "გთხოვთ, აირჩიოთ მიწოდების მისამართი.",
      );
      return;
    }
    saveCheckoutSession({
      addressId: selectedId,
      contact: {
        person: contactPerson.trim(),
        email: contactEmail.trim(),
        phone: contactPhone.trim(),
      },
    });
    router.push("/cart/payment");
  };

  return {
    ready: isReady && isHydrated && !loading,
    profile,
    addresses,
    selectedId,
    busy,
    modalOpen,
    editing,
    items,
    contactPerson,
    contactEmail,
    contactPhone,
    contactErrors,
    setContactPerson,
    setContactEmail,
    setContactPhone,
    logout,
    selectAddress: setSelectedId,
    openAdd,
    openEdit,
    closeModal,
    handleSubmit,
    handleDelete,
    handleContinue,
  };
};
