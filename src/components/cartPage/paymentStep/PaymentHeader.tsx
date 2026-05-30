import "./paymentHeader.scss";

interface Props {
  title: string;
  titlePrefix: string;
  stepLabel: string;
}

/** Page heading for the payment step (mirrors the shipping header). */
export default function PaymentHeader({ title, titlePrefix, stepLabel }: Props) {
  return (
    <header className="payment-header">
      <div className="payment-header__title-row">
        <h1 className="payment-header__title">
          {titlePrefix}{" "}
          <em className="payment-header__title-em">{title}</em>
        </h1>
        <span className="payment-header__step" aria-live="polite">
          {stepLabel}
        </span>
      </div>
    </header>
  );
}
