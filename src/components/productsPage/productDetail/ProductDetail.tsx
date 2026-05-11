"use client";

import Link from "next/link";
import { IProduct, getCategoryPlaceholder } from "@/lib/types/productTypes";
import { Partner } from "@/lib/types/partnerTypes";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import { useProductDisplay } from "@/lib/hooks/useProductDisplay";
import ProductImageGallery from "./ProductImageGallery";
import ProductInfo from "./ProductInfo";
import ProductAccordion from "./ProductAccordion";
import ProductSpecs from "./ProductSpecs";
import { ChevronLeftIcon } from "./constants";
import "./productDetail.scss";

interface ProductDetailProps {
  product: IProduct;
  partner: Partner | null;
}

export default function ProductDetail({ product, partner }: ProductDetailProps) {
  const { t: tNav } = useClientTranslation("navigation");
  const { t: tPages } = useClientTranslation("pages");

  const { title } = useProductDisplay(product);
  const categoryPlaceholder = getCategoryPlaceholder(product.category as string);

  return (
    <div className="product-detail animate-in">
      {/* ── Back link ── */}
      <Link href="/products" className="product-detail__back">
        <ChevronLeftIcon />
        {tNav("back_to_shop")}
      </Link>

      {/* ── Top split: gallery + info ── */}
      <div className="product-detail__top">
        <div className="product-detail__gallery">
          <ProductImageGallery
            images={product.images}
            categoryPlaceholder={categoryPlaceholder}
            alt={title}
          />
        </div>

        <div className="product-detail__sidebar">
          <ProductInfo product={product} partner={partner} />
        </div>
      </div>

      {/* ── Lower content: specifications ── */}
      <div className="product-detail__content">
        <ProductAccordion title={tPages("products.specifications")}>
          <ProductSpecs product={product} />
        </ProductAccordion>
      </div>
    </div>
  );
}
