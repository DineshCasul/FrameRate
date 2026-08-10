"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Reveal from "@/app/components/Reveal";
import { TYPE_COLOR_CLASSES } from "@/lib/utils";
import type { Review } from "@/types";

const PAGE_SIZE = 10;

type Props = {
  reviews: Review[];
};

export default function AdminReviewsList({ reviews }: Props) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return reviews;
    return reviews.filter((r) => r.title.toLowerCase().includes(q));
  }, [reviews, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount - 1);
  const pageItems = filtered.slice(currentPage * PAGE_SIZE, currentPage * PAGE_SIZE + PAGE_SIZE);

  function handleQueryChange(next: string) {
    setQuery(next);
    setPage(0);
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-4">
        <h2 className="text-lg sm:text-2xl font-bold">Reviews</h2>
        <input
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          placeholder="Search by title…"
          className="border rounded px-3 py-2 bg-transparent text-sm w-48 sm:w-64"
        />
      </div>

      {pageItems.length === 0 ? (
        <p className="text-sm text-muted-foreground">No reviews match &quot;{query}&quot;.</p>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {pageItems.map((review, i) => (
            <Reveal key={review.id} delay={Math.min((i % 10) * 30, 300)} offset={10}>
              <div
                style={{
                  borderLeftColor: TYPE_COLOR_CLASSES[review.type].cssVar,
                  borderLeftWidth: 3,
                }}
                className="border rounded flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 transition-colors hover:bg-muted"
              >
                <Link
                  href={`/admin/reviews/${review.slug || review.id}/edit`}
                  className="flex-1 p-3 sm:p-4"
                >
                  <h3 className="font-semibold text-sm sm:text-base">{review.title}</h3>
                  <p className={`text-xs sm:text-sm font-semibold uppercase tracking-wide ${TYPE_COLOR_CLASSES[review.type].text}`}>
                    {review.type}
                    <span className="text-muted-foreground font-normal normal-case tracking-normal">
                      {" "}• Rating: {review.rating}/10
                    </span>
                  </p>
                </Link>
                <div className="flex items-center gap-3 px-3 sm:px-4 pb-3 sm:pb-0 sm:pl-0">
                  {review.status === "published" && (
                    <Link
                      href={`/reviews/${review.slug || review.id}`}
                      target="_blank"
                      className="text-xs sm:text-sm underline hover:no-underline whitespace-nowrap"
                    >
                      View Live ↗
                    </Link>
                  )}
                  <span
                    className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap border border-current ${
                      review.status === "published" ? "text-status-good" : "text-status-warn"
                    }`}
                  >
                    {review.status}
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      )}

      {pageCount > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            className="border rounded px-3 py-1.5 hover:bg-muted transition disabled:opacity-50 cursor-pointer"
          >
            Prev
          </button>
          <span className="text-muted-foreground">
            Page {currentPage + 1} of {pageCount}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            disabled={currentPage >= pageCount - 1}
            className="border rounded px-3 py-1.5 hover:bg-muted transition disabled:opacity-50 cursor-pointer"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
