import "./shippingHeader.scss";

interface Props {
  title: string;
  titlePrefix: string;
  stepLabel: string;
}

export default function ShippingHeader({ title, titlePrefix, stepLabel }: Props) {
  return (
    <header className="shipping-header">
      <div className="shipping-header__title-row">
        <h1 className="shipping-header__title">
          {titlePrefix}{" "}
          <em className="shipping-header__title-em">{title}</em>
        </h1>
        <span className="shipping-header__step" aria-live="polite">
          {stepLabel}
        </span>
      </div>
    </header>
  );
}
