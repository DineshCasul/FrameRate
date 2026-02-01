import type { Metadata } from "next";
import type { Review } from "@/types";
import { getReviews } from "@/lib/getReviews";
import Card from "../components/Card";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Recommendations | FrameRate",
  description:
    "Get personalized recommendations for games, movies, and TV series based on FrameRate reviews.",
};

export default async function RecommendPage() {
  const reviews = await getReviews();
  const topRated = reviews
    .filter((r) => r.status === "published")
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6);

  const highestRatedByType = reviews
    .filter((r) => r.status === "published")
    .reduce((acc: Record<string, Review>, review: Review) => {
      if (!acc[review.type] || acc[review.type].rating < review.rating) {
        acc[review.type] = review;
      }
      return acc;
    }, {});

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Recommendations</h1>
        <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 mb-8 sm:mb-12">
          Discover the highest-rated content across all categories.
        </p>

        <div className="mb-12 sm:mb-16">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">Top Rated</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 justify-items-center">
            {topRated.map((review) => (
              <Link
                href={`/reviews/${review.slug || review.id}`}
                key={review.id}
                className="block w-full"
              >
                <Card
                  rating={review.rating}
                  description={review.content}
                  title={review.title}
                  type={review.type}
                  backgroundUrl={review.backgroundUrl}
                />
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">Best By Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {Object.entries(highestRatedByType).map(([type, review]) => (
              <Link
                href={`/reviews/${review.slug || review.id}`}
                key={review.id}
                className="block"
              >
                <div className="border border-gray-300 dark:border-gray-700 rounded overflow-hidden hover:shadow-lg transition cursor-pointer">
                  <div
                    className="h-32 sm:h-40 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${review.backgroundUrl})`,
                    }}
                  ></div>
                  <div className="p-3 sm:p-4">
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 capitalize mb-1">
                      {type}
                    </p>
                    <h3 className="font-bold mb-2 text-sm sm:text-base">{review.title}</h3>
                    <p className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400">
                      {review.rating}/10
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
