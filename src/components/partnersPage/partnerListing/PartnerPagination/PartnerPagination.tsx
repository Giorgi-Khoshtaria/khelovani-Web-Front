import { PartnerPaginationProps } from "@/lib/types/partnerTypes";
import "./partnerPagination.scss";

export default function PartnerPagination({
  page,
  totalPages,
  onPageChange,
  prevLabel,
  nextLabel,
}: PartnerPaginationProps) {
  if (totalPages <= 1) return null;

  // Show at most 5 page dots, centered around current page
  const range = (start: number, end: number) =>
    Array.from({ length: end - start + 1 }, (_, i) => start + i);

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

  return (
    <nav className="custom-pagination" aria-label="Pagination">
      <button
        className="custom-pagination__btn"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        aria-label={prevLabel}
      >
        <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>{prevLabel}</span>
      </button>

      <div className="custom-pagination__pages">
        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`ellipsis-${i}`} className="custom-pagination__ellipsis">
              …
            </span>
          ) : (
            <button
              key={p}
              className={`custom-pagination__page${p === page ? " custom-pagination__page--active" : ""}`}
              onClick={() => onPageChange(p as number)}
              aria-current={p === page ? "page" : undefined}
            >
              {p}
            </button>
          )
        )}
      </div>

      <button
        className="custom-pagination__btn"
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        aria-label={nextLabel}
      >
        <span>{nextLabel}</span>
        <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </nav>
  );
}
