"use client";
import Link from "next/link";
import { useState, useCallback, useMemo } from "react";
import Card from "./Card";
import { FilterReviews } from "./FilterReviews";
import { SortReviews } from "./SortReviews";
import type { Review } from "@/types";

interface ReviewsClientProps {
  initialReviews: Review[];
}

// Sort logic extracted to utility function
const sortReviews = (data: Review[], sortKey: string | null): Review[] => {
  if (!sortKey) return data;

  const items = [...data];
  switch (sortKey) {
    case "newest":
      return items.sort(
        (a, b) =>
          new Date((b as any).created_at).getTime() -
          new Date((a as any).created_at).getTime(),
      );
    case "oldest":
      return items.sort(
        (a, b) =>
          new Date((a as any).created_at).getTime() -
          new Date((b as any).created_at).getTime(),
      );
    case "highest":
      return items.sort((a, b) => b.rating - a.rating);
    case "lowest":
      return items.sort((a, b) => a.rating - b.rating);
    default:
      return items;
  }
};

export default function ReviewsClient({ initialReviews }: ReviewsClientProps) {
  const [filteredData, setFilteredData] = useState(initialReviews);
  const [sortOrder, setSortOrder] = useState<string | null>(null);

  const handleFilterChange = useCallback(
    (newData: Review[]) => {
      setFilteredData(sortReviews(newData, sortOrder));
    },
    [sortOrder],
  );

  const handleSortChange = useCallback((newSortKey: string | null) => {
    setSortOrder(newSortKey);
    setFilteredData((prev) => sortReviews(prev, newSortKey));
  }, []);

  const displayCount = useMemo(
    () => `${filteredData?.length} / ${initialReviews?.length}`,
    [filteredData?.length, initialReviews?.length],
  );

  return (
    <>
      <div className="flex w-full border-b my-4 sm:mt-0 mb-8 pb-2 justify-between items-center">
        <div className="italic">{`Total Results: ${displayCount}`}</div>
        <div className="flex flex-row sm:flex-row sm:justify-end gap-4 sm:gap-4">
          <div className="flex item-center gap-2">
            <FilterReviews
              data={initialReviews}
              setFilteredData={handleFilterChange}
            />
          </div>
          |
          <div className="flex item-center gap-2">
            <SortReviews onSortChange={handleSortChange} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 justify-items-center">
        {filteredData?.length > 0 ? (
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
