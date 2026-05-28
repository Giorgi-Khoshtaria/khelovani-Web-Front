"use client";
import type { PaymentCard } from "@/apiCalls/profileRequests/paymentCards.req";
import { brandLabel } from "@/lib/utils/cardUtils";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import "./paymentCardItem.scss";

interface Props {
  card: PaymentCard;
  busy: boolean;
  onSetDefault: (id: string) => void;
  onDelete: (id: string) => void;
}

const pad2 = (n: number) => String(n).padStart(2, "0");

export default function PaymentCardItem({
  card,
  busy,
  onSetDefault,
  onDelete,
}: Props) {
  const { t: tProfile } = useClientTranslation("pages");

  return (
    <div className={`payment-card payment-card--${card.brand}`}>
      <div className="payment-card__top">
        <span className="payment-card__brand">{brandLabel(card.brand)}</span>
        {card.isDefault && (
          <span className="payment-card__default-badge">
            {tProfile("profile.payments.default") || "ნაგულისხმევი"}
          </span>
        )}
      </div>

      <div className="payment-card__number">
        <span aria-hidden>••••</span>
        <span aria-hidden>••••</span>
        <span aria-hidden>••••</span>
        <span className="payment-card__last4">{card.last4}</span>
      </div>

      <div className="payment-card__bottom">
        <div className="payment-card__field">
          <span className="payment-card__field-label">
            {tProfile("profile.payments.holder") || "მფლობელი"}
          </span>
          <span className="payment-card__field-value">{card.holderName}</span>
        </div>
        <div className="payment-card__field">
          <span className="payment-card__field-label">
            {tProfile("profile.payments.expiry") || "ვადა"}
          </span>
          <span className="payment-card__field-value">
            {pad2(card.expMonth)}/{String(card.expYear).slice(-2)}
          </span>
        </div>
      </div>

      <div className="payment-card__actions">
        {!card.isDefault && (
          <button
            type="button"
            className="payment-card__action"
            onClick={() => onSetDefault(card._id)}
            disabled={busy}
          >
            {tProfile("profile.payments.set_default") ||
              "ნაგულისხმევად დაყენება"}
          </button>
        )}
        <button
          type="button"
          className="payment-card__action payment-card__action--delete"
          onClick={() => onDelete(card._id)}
          disabled={busy}
        >
          {tProfile("profile.payments.delete") || "წაშლა"}
        </button>
      </div>
    </div>
  );
}
