"use client";

import Link from "next/link";
import type { IProduct } from "@/lib/types/productTypes";
import ProductCard from "@/components/productsPage/productCard/ProductCard";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import "./partnerPieces.scss";

interface Props {
  products: IProduct[];
  name: string;
  partnerId: string;
  productCount: number;
}

/** "Pieces by {partner}" grid built from the shared ProductCard. */
export default function PartnerPieces({
  products,
  name,
  partnerId,
  productCount,
}: Props) {
  const { t: tPages } = useClientTranslation("pages");
  const { t: tNav } = useClientTranslation("navigation");
  const { lang } = useLanguage();
  const isGe = lang === "ge";

  if (!products || products.length === 0) return null;

  return (
    <section className="partner-pieces">
      <header className="partner-pieces__header">
        <div className="partner-pieces__heading">
          {/* <span className="partner-pieces__eyebrow">
            {tPages("partner_profile.from_this_maker") ||
              (isGe ? "ამ ხელოსნისგან" : "From this maker")}
          </span> */}
          <h2 className="partner-pieces__title">
            {tPages("partner_profile.pieces_by") ||
              (isGe ? "ნამუშევრები" : "Pieces by")}{" "}
            {name}
          </h2>
        </div>

        <Link
          href={`/products?partnerId=${partnerId}`}
          className="partner-pieces__view-all"
        >
          {tNav("view_all") || (isGe ? "ყველას ნახვა" : "View all")}
          {productCount > 0 ? ` ${productCount}` : ""}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </header>

      <div className="partner-pieces__grid">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}
