"use client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getCards,
  setDefaultCard,
  deleteCard,
  type PaymentCard,
} from "@/apiCalls/profileRequests/paymentCards.req";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import PaymentCardItem from "./PaymentCardItem";
import "./paymentsSection.scss";

export default function PaymentsSection() {
  const { t: tProfile } = useClientTranslation("pages");
  const { t: tAlerts } = useClientTranslation("alerts");

  const [cards, setCards] = useState<PaymentCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access-token");
    if (!token) {
      setLoading(false);
      return;
    }
    getCards(token)
      .then(setCards)
      .catch(() => toast.error(tAlerts("error") || "შეცდომა"))
      .finally(() => setLoading(false));
  }, [tAlerts]);

  const handleSetDefault = async (id: string) => {
    const token = localStorage.getItem("access-token");
    if (!token) return;
    setBusy(true);
    try {
      const updated = await setDefaultCard(token, id);
      setCards(updated);
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
        tProfile("profile.payments.delete_confirm") || "წავშალო ეს ბარათი?",
      )
    ) {
      return;
    }
    setBusy(true);
    try {
      await deleteCard(token, id);
      const refreshed = await getCards(token);
      setCards(refreshed);
      toast.success(tAlerts("card_deleted") || "ბარათი წაიშალა");
    } catch {
      toast.error(tAlerts("error") || "შეცდომა");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="payments-section">
      <div className="payments-section__header">
        <h2 className="payments-section__title">
          {tProfile("profile.payments.title") || "ბარათები"}
        </h2>
      </div>

      {loading ? (
        <div className="payments-section__loading">
          <span className="spinner" />
        </div>
      ) : cards.length === 0 ? (
        <div className="payments-section__empty">
          <p>{tProfile("profile.payments.empty") || "ბარათები არ გაქვს"}</p>
        </div>
      ) : (
        <div className="payments-section__grid">
          {cards.map((card) => (
            <PaymentCardItem
              key={card._id}
              card={card}
              busy={busy}
              onSetDefault={handleSetDefault}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
