"use client";

import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import "./productPagination.scss";

interface ProductPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  isLoading: boolean;
}

const range = (start: number, end: number) => {
  const length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
};

export default function ProductPagination({
  page,
  totalPages,
  onPageChange,
  isLoading,
}: ProductPaginationProps) {
  const { t } = useClientTranslation("common");

  if (totalPages <= 1) return null;

  // Pagination logic to show page numbers with ellipses
  let pages: (number | "…")[];
  if (totalPages <= 7) {
    pages = range(1, totalPages);
  } else if (page <= 4) {
    pages = [...range(1, 5), "…", totalPages];
  } else if (page >= totalPages - 3) {
    pages = [1, "…", ...range(totalPages - 4, totalPages)];
  } else {
    pages = [1, "…", page - 1, page, page + 1, "…", totalPages];
  }

  const prevLabel = t("listing.prev") || "წინა";
  const nextLabel = t("listing.next") || "შემდეგი";

  return (
    <nav className="custom-pagination" aria-label="Pagination">
      <button
        className="custom-pagination__btn"
        disabled={page === 1 || isLoading}
        onClick={() => onPageChange(Math.max(1, page - 1))}
        aria-label="Previous page"
      >
        <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>{prevLabel}</span>
      </button>

      <div className="custom-pagination__pages">
        {pages.map((p, index) => {
          if (p === "…") {
            return (
              <span key={`ellipsis-${index}`} className="custom-pagination__ellipsis">
                {p}
              </span>
            );
          }

          return (
            <button
              key={p}
              className={`custom-pagination__page ${
                p === page ? "custom-pagination__page--active" : ""
              }`}
              disabled={isLoading}
              onClick={() => onPageChange(p)}
              aria-current={p === page ? "page" : undefined}
            >
              {p}
            </button>
          );
        })}
      </div>

      <button
        className="custom-pagination__btn"
        disabled={page === totalPages || isLoading}
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        aria-label="Next page"
      >
        <span>{nextLabel}</span>
        <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </nav>
  );
}
