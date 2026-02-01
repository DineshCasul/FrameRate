import Link from "next/link";
import Image from "next/image";
import Card from "./components/Card";
import { homepageData } from "./dummyData";
import { getReviews } from "@/lib/getReviews";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FrameRate | Reviews of Games, Movies & Series",
  description:
    "Discover FrameRate: Your source for honest, detailed reviews of games, movies, and TV series. Rate and explore content across all platforms.",
  keywords: "reviews, games, movies, series, ratings, entertainment",
};

export default async function Home() {
  const reviews = await getReviews();
  const featuredReviews = reviews.slice(0, 6);

  return (
    <div className="min-h-full flex flex-col items-center justify-center bg-white dark:bg-black text-black dark:text-white px-4 py-8 sm:px-6 sm:py-12 dark:border-gray-700">
      <div className="text-center max-w-3xl">
        <div className="mx-auto w-24 h-24 sm:w-32 sm:h-32 relative">
          <Image
            src="/images/FrameRate.png"
            alt="FrameRate Logo"
            width={128}
            height={128}
            className="mx-auto object-contain dark:hidden"
          />
          <Image
            src="/images/FrameRate-white.png"
            alt="FrameRate Logo"
            width={128}
            height={128}
            className="mx-auto object-contain hidden dark:block"
          />
        </div>
        <p className="mb-8 whitespace-pre-line text-sm sm:text-base">{homepageData.description}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 justify-items-center">
          {featuredReviews.map((review) => (
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
        <div className="mt-12">
          <Link className="hover:underline" href="/reviews">
            -View All-
          </Link>
        </div>
      </div>
    </div>
  );
}
