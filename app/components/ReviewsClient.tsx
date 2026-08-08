"use client";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import Card from "./Card";
import { FilterReviews } from "./FilterReviews";
import { SortReviews } from "./SortReviews";
import type { Review, ReviewKind } from "@/types";

interface ReviewsClientProps {
  initialReviews: Review[];
}

const sortReviews = (data: Review[], sortKey: string | null): Review[] => {
  if (!sortKey) return data;

  const items = [...data];
  switch (sortKey) {
    case "newest":
      return items.sort(
        (a, b) =>
          new Date(b.created_at ?? b.publishedAt).getTime() -
          new Date(a.created_at ?? a.publishedAt).getTime(),
      );
    case "oldest":
      return items.sort(
        (a, b) =>
          new Date(a.created_at ?? a.publishedAt).getTime() -
          new Date(b.created_at ?? b.publishedAt).getTime(),
      );
    case "highest":
      return items.sort((a, b) => b.rating - a.rating);
    case "lowest":
      return items.sort((a, b) => a.rating - b.rating);
    default:
      return items;
  }
};

const isReviewKind = (value: string): value is ReviewKind =>
  value === "movie" || value === "game" || value === "series";

export default function ReviewsClient({ initialReviews }: ReviewsClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeTypes = useMemo(
    () => (searchParams.get("type")?.split(",").filter(isReviewKind) ?? []),
    [searchParams],
  );
  const ratingParam = searchParams.get("rating");
  const activeRating = ratingParam ? Number(ratingParam) : null;
  const sortKey = searchParams.get("sort");
  const activeTag = searchParams.get("tag");

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") params.delete(key);
        else params.set(key, value);
      });
      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  const filteredData = useMemo(() => {
    let items = initialReviews;

    if (activeTypes.length > 0) {
      items = items.filter((review) => activeTypes.includes(review.type));
    }
    if (activeRating !== null) {
      items = items.filter((review) => review.rating >= activeRating);
    }
    if (activeTag) {
      items = items.filter((review) =>
        review.tags.some((tag) => tag.toLowerCase() === activeTag.toLowerCase()),
      );
    }

    return sortReviews(items, sortKey);
  }, [initialReviews, activeTypes, activeRating, activeTag, sortKey]);

  return (
    <>
      <div className="flex flex-col gap-3 w-full border-b my-4 sm:mt-0 mb-8 pb-3">
        <div className="flex justify-between items-center">
          <div className="italic">{`Total Results: ${filteredData.length} / ${initialReviews.length}`}</div>
          <div className="flex items-center gap-4">
            <FilterReviews
              activeTypes={activeTypes}
              activeRating={activeRating}
              onTypesChange={(types) => updateParams({ type: types.length ? types.join(",") : null })}
              onRatingChange={(rating) => updateParams({ rating: rating ? String(rating) : null })}
            />
            <div className="w-px h-4 bg-border" aria-hidden="true" />
            <SortReviews
              activeSortKey={sortKey}
              onSortChange={(key) => updateParams({ sort: key })}
            />
          </div>
        </div>
        {activeTag && (
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <span className="text-muted-foreground">Tag:</span>
            <button
              onClick={() => updateParams({ tag: null })}
              className="flex items-center gap-1 px-2 py-1 bg-secondary rounded hover:opacity-80 transition cursor-pointer"
            >
              {activeTag}
              <span aria-hidden="true">✕</span>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 justify-items-center">
        {filteredData.length > 0 ? (
          filteredData.map((data) => (
            <Link
              href={`/reviews/${data.slug || data.id}`}
              key={data.id}
              className="block w-full"
            >
              <Card
                rating={data.rating}
                description={data.content}
                title={data.title}
                type={data.type}
                backgroundUrl={data.backgroundUrl}
              />
            </Link>
          ))
        ) : (
          <div className="col-span-full flex items-center justify-center py-12 text-center">
            No reviews found.
          </div>
        )}
      </div>
    </>
  );
}
