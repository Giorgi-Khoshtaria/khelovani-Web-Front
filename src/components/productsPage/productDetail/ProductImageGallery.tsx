"use client";

import { useState, useCallback, useRef, MouseEvent } from "react";
import Image from "next/image";
import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import { ZoomIcon } from "./constants";
import "./ProductImageGallery.scss";

interface ProductImageGalleryProps {
  images: string[];
  categoryPlaceholder: string;
  alt: string;
}

const ZOOM_LEVEL = 2;

export default function ProductImageGallery({
  images,
  categoryPlaceholder,
  alt,
}: ProductImageGalleryProps) {
  const { t: tPages } = useClientTranslation("pages");

  const hasRealImages = images && images.length > 0;
  const displayImages = hasRealImages ? images : [categoryPlaceholder];

  const [activeIndex, setActiveIndex] = useState(0);
  const [failedIndexes, setFailedIndexes] = useState<Set<number>>(new Set());
  const [zoom, setZoom] = useState({ active: false, x: 50, y: 50 });

  const stageRef = useRef<HTMLDivElement | null>(null);

  const handleImageError = useCallback((index: number) => {
    setFailedIndexes((prev) => new Set(prev).add(index));
  }, []);

  const getSrc = (index: number) =>
    failedIndexes.has(index) ? categoryPlaceholder : displayImages[index];

  const isPlaceholder = !hasRealImages || failedIndexes.has(activeIndex);
  const total = displayImages.length;
  const activeSrc = getSrc(activeIndex);

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoom({ active: true, x, y });
  };

  const handleLeave = () => setZoom((z) => ({ ...z, active: false }));

  return (
    <div className={`pg-gallery${total > 1 ? "" : " pg-gallery--single"}`}>
      {/* ── Side thumbnails ── */}
      {total > 1 && (
        <div className="pg-gallery__thumbs" role="tablist">
          {displayImages.map((_, idx) => (
            <button
              key={idx}
              type="button"
              role="tab"
              aria-selected={activeIndex === idx}
              className={`pg-gallery__thumb${
                activeIndex === idx ? " pg-gallery__thumb--active" : ""
              }`}
              onClick={() => setActiveIndex(idx)}
              aria-label={`View image ${idx + 1}`}
            >
              <Image
                src={getSrc(idx)}
                alt={`${alt} ${idx + 1}`}
                fill
                sizes="80px"
                style={{ objectFit: "cover" }}
                onError={() => handleImageError(idx)}
              />
            </button>
          ))}
        </div>
      )}

      {/* ── Main stage ── */}
      <div
        ref={stageRef}
        className="pg-gallery__stage"
        onMouseEnter={handleMove}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
      >
        <Image
          src={activeSrc}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="pg-gallery__img"
          style={{ objectFit: "cover" }}
          onError={() => handleImageError(activeIndex)}
          priority={activeIndex === 0}
        />

        {/* Zoom overlay (desktop hover) */}
        {!isPlaceholder && (
          <div
            className={`pg-gallery__zoom${
              zoom.active ? " pg-gallery__zoom--active" : ""
            }`}
            style={{
              backgroundImage: `url(${activeSrc})`,
              backgroundSize: `${ZOOM_LEVEL * 100}%`,
              backgroundPosition: `${zoom.x}% ${zoom.y}%`,
            }}
            aria-hidden
          />
        )}

        <div className="pg-gallery__zoom-hint">
          <ZoomIcon size={14} />
          <span>{tPages("products.hover_to_zoom")}</span>
        </div>

        {isPlaceholder && (
          <div className="pg-gallery__placeholder-badge">
            {tPages("products.sample_image")}
          </div>
        )}

        {total > 1 && (
          <div className="pg-gallery__counter">
            {String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(total).padStart(2, "0")}
          </div>
        )}
      </div>
    </div>
  );
}
