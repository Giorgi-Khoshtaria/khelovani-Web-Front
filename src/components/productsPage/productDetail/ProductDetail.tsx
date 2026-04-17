"use client";

import Image from "next/image";
import Link from "next/link";
import "./productDetail.scss";
import { IProduct } from "@/lib/types/productTypes";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import { useProductDisplay } from "@/lib/hooks/useProductDisplay";
import { useProductImage } from "@/lib/hooks/useProductImage";

interface ProductDetailProps {
  product: IProduct;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const { t: tCommon } = useClientTranslation("common");
  const { t: tNav } = useClientTranslation("navigation");
  const { t: tPages } = useClientTranslation("pages");

  // Senior-level abstractions
  const { title, description, categoryLabel, formattedPrice, isInStock } = useProductDisplay(product);
  const { imgSrc, isPlaceholder, handleImageError } = useProductImage(product);

  return (
    <div className="product-detail animate-in">
      {/* ── Back link ── */}
      <Link href="/products" className="product-detail__back">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
        {tNav("back_to_shop") || "Back to Shop"}
      </Link>

      {/* ── Main card ── */}
      <div className="product-detail__card">
        {/* Left – image */}
        <div className="product-detail__image-wrap">
          <Image
            src={imgSrc}
            alt={title}
            fill
            className="product-detail__image"
            style={{ objectFit: "cover" }}
            onError={handleImageError}
            priority
          />
          {isPlaceholder && (
            <div className="product-detail__placeholder-badge">
              {tCommon("sample_image")}
            </div>
          )}
        </div>

        {/* Right – info */}
        <div className="product-detail__info">
          <div className="product-detail__info-top">
            <span className="product-detail__category">{categoryLabel}</span>
            <button
              className="product-detail__fav-btn"
              aria-label="add to favourites"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          </div>

          <h1 className="product-detail__title">{title}</h1>

          <div className="product-detail__stock">
            {isInStock ? (
              <>
                <span className="product-detail__stock-dot product-detail__stock-dot--in" />
                {tPages("products.in_stock") || "In Stock"}
              </>
            ) : (
              <>
                <span className="product-detail__stock-dot product-detail__stock-dot--out" />
                {tPages("products.out_of_stock") || "Out of Stock"}
              </>
            )}
          </div>

          <div className="product-detail__price">{formattedPrice}</div>

          <hr className="product-detail__divider" />

          <div className="product-detail__description-block">
            <p className="product-detail__description-label">
              {tPages("products.description") || "Description"}
            </p>
            <p className="product-detail__description">{description}</p>
          </div>

          <button
            className="product-detail__buy-btn"
            disabled={!isInStock}
            id={`buy-now-${product._id}`}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {tNav("buy_now") || "Buy Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
