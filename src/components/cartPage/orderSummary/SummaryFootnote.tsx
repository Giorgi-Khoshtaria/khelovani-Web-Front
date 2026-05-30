"use client";

import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import "./summaryFootnote.scss";

interface Props {
  variant: "shipping" | "payment";
}

const ShieldIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M12 3 5 6v5c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Reassurance line under the CTA: a generic disclaimer or an SSL/secure note. */
export default function SummaryFootnote({ variant }: Props) {
  const { t: tPages } = useClientTranslation("pages");

  if (variant === "payment") {
    return (
      <p className="summary-footnote summary-footnote--secure">
        <ShieldIcon />
        {tPages("payment.ssl_note") ||
          "256-bit SSL დაშიფვრა · ჩვენ არ ვინახავთ თქვენს CVC-ს"}
      </p>
    );
  }

  return (
    <p className="summary-footnote">
      {tPages("shipping.disclaimer") ||
        "თქვენი მონაცემები დაცულია. გადახდა მოხდება მხოლოდ შემდეგ ეტაპზე დადასტურების შემდეგ."}
    </p>
  );
}
