"use client";

import { useEffect } from "react";
import Link from "next/link";
import "./error.scss";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function MainError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Route error:", error);
  }, [error]);

  return (
    <div className="route-error">
      <div className="route-error__card">
        <h1 className="route-error__title">Something went wrong</h1>
        <p className="route-error__message">
          We hit an unexpected issue loading this page. Try again, or head back home.
        </p>
        <div className="route-error__actions">
          <button
            type="button"
            className="route-error__retry"
            onClick={() => reset()}
          >
            Try again
          </button>
          <Link href="/" className="route-error__home">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
