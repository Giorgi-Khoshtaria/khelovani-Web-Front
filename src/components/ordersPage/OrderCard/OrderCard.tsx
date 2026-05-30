"use client";

import Image from "next/image";
import Link from "next/link";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import type { Order } from "@/lib/types/orderTypes";
import { useOrderCard } from "./useOrderCard";
import "./orderCard.scss";

interface Props {
  order: Order;
}

const PLACEHOLDER = "/assets/placeholder/default.png";

const ChevronIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

/** One order, expandable in place (informational — no action buttons). */
export default function OrderCard({ order }: Props) {
  const { t: tPages } = useClientTranslation("pages");
  const c = useOrderCard(order);

  return (
    <article className={`order-card${c.open ? " order-card--open" : ""}`}>
      <button
        type="button"
        className="order-card__head"
        onClick={c.toggle}
        aria-expanded={c.open}
      >
        <div className="order-card__id">
          <span className="order-card__number">{order.orderNumber}</span>
          <span className="order-card__ordered">
            {tPages("orders.card.ordered") || "Ordered"} {c.orderedDate}
          </span>
        </div>
        <div className="order-card__meta">
          <span className={`order-card__badge order-card__badge--${c.tone}`}>
            {c.statusLabel}
          </span>
          <span className="order-card__total">₾{order.total}</span>
          <span className="order-card__chevron" aria-hidden="true">
            <ChevronIcon />
          </span>
        </div>
      </button>

      {c.open ? (
        <div className="order-card__body">
          {!c.isCancelled && (
            <div className="order-card__tracker">
              <div className="order-card__step order-card__step--done">
                <span className="order-card__bullet">
                  <CheckIcon />
                </span>
                <span>{tPages("orders.card.placed") || "Placed"}</span>
              </div>
              <span
                className={`order-card__line${c.isDelivered ? " order-card__line--done" : ""}`}
              />
              <div
                className={`order-card__step${c.isDelivered ? " order-card__step--done" : ""}`}
              >
                <span className="order-card__bullet">
                  {c.isDelivered ? <CheckIcon /> : "2"}
                </span>
                <span>{tPages("orders.card.delivered") || "Delivered"}</span>
              </div>
            </div>
          )}

          <ul className="order-card__items">
            {order.items.map((item, idx) => {
              const onSale = item.unitPrice < item.originalPrice;
              return (
                <li key={`${item.product}-${idx}`}>
                  <Link
                    href={`/products/${item.product}`}
                    className="order-card__item"
                  >
                    <span className="order-card__thumb">
                      <Image
                        src={item.image || PLACEHOLDER}
                        alt={c.itemTitle(item)}
                        width={56}
                        height={56}
                      />
                      {item.quantity > 1 && (
                        <span className="order-card__qty">{item.quantity}</span>
                      )}
                    </span>
                    <div className="order-card__item-body">
                      <p className="order-card__item-name">{c.itemTitle(item)}</p>
                      {c.partnerName && (
                        <p className="order-card__item-partner">
                          {tPages("cart.by") || "By"} {c.partnerName}
                        </p>
                      )}
                    </div>
                    <div className="order-card__item-price">
                      {onSale && (
                        <span className="order-card__item-original">
                          ₾{item.originalPrice * item.quantity}
                        </span>
                      )}
                      <span
                        className={`order-card__item-amount${onSale ? " order-card__item-amount--sale" : ""}`}
                      >
                        ₾{item.unitPrice * item.quantity}
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <div className="order-card__summary">
          <span className="order-card__thumbs">
            {order.items.slice(0, 5).map((item, idx) => (
              <Image
                key={`${item.product}-${idx}`}
                src={item.image || PLACEHOLDER}
                alt={c.itemTitle(item)}
                width={44}
                height={44}
              />
            ))}
            {order.items.length > 5 && (
              <span className="order-card__thumbs-more">
                +{order.items.length - 5}
              </span>
            )}
          </span>
          <span className="order-card__summary-text">
            {c.pieces} {tPages("orders.card.pieces") || "pieces"}
          </span>
        </div>
      )}
    </article>
  );
}
