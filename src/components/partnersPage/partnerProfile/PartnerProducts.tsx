import Link from "next/link";
import { IProduct } from "@/lib/types/productTypes";
import ProductCard from "@/components/productsPage/productCard/ProductCard";
import "./partnerProducts.scss";

interface PartnerProductsProps {
  products: IProduct[];
  partnerId: string;
}

export function PartnerProducts({ products, partnerId }: PartnerProductsProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="partner-products">
      <div className="partner-products__container">
        <header className="partner-products__header">
          <h2 className="partner-products__title">პარტნიორის პროდუქცია</h2>
          <Link href={`/products?owner=${partnerId}`} className="partner-products__view-all">
            ყველას ნახვა
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </header>

        <div className="partner-products__grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
