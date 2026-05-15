"use client";

import { useClientTranslation } from "@/lib/hooks/useClientTranslation";
import Button from "@/components/ui/Button";
import { ChevronLeftIcon, ChevronRightIcon } from "@/lib/icons";
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
      <Button
        variant="secondary"
        size="sm"
        disabled={page === 1 || isLoading}
        onClick={() => onPageChange(Math.max(1, page - 1))}
        aria-label="Previous page"
        leadingIcon={<ChevronLeftIcon size={14} />}
      >
        {prevLabel}
      </Button>

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

      <Button
        variant="secondary"
        size="sm"
        disabled={page === totalPages || isLoading}
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        aria-label="Next page"
        trailingIcon={<ChevronRightIcon size={14} />}
      >
        {nextLabel}
      </Button>
    </nav>
  );
}
