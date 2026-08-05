"use client";

import "./productsHero.scss";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import Image from "next/image";

function ProductsHero() {
  const { t } = useClientTranslation("pages");

  return (
    <section className="phero">
      <div className="phero__inner">
        <div className="phero__copy">
          <p className="phero__eyebrow">{t("products.hero_eyebrow")}</p>
          <h1 className="phero__title">
            <span className="phero__title-line">
              {t("products.hero_title")}
            </span>
          </h1>
          <p className="phero__desc">{t("products.hero_description")}</p>
        </div>

        <div className="phero__art">
          {/* badge — top left */}
          <div className="phero__badge">
            <span className="phero__badge-num">+24</span>
            <span className="phero__badge-label">
              {t("products.hero_badge_label")}
            </span>
          </div>

          {/* large circle — top right */}
          <div className="phero__circle phero__circle--main">
            <Image
              src="/assets/placeholder/ceramics.png"
              alt="hero_image"
              aria-hidden="true"
              fill
              style={{ objectFit: "cover" }}
            />
          </div>

          {/* large circle — bottom left */}
          <div className="phero__circle phero__circle--btm">
            <Image
              src="/assets/placeholder/textile.png"
              alt="hero_image"
              aria-hidden="true"
              fill
              style={{ objectFit: "cover" }}
            />
          </div>

          {/* medium circle — center overlap */}
          <div className="phero__circle phero__circle--mid">
            <Image
              src="/assets/placeholder/jewelry.png"
              alt="hero_image"
              aria-hidden="true"
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductsHero;
