import type { Metadata } from "next";
import type { Review } from "@/types";
import { getPublishedReviews } from "@/lib/getReviews";
import Card from "../components/Card";
import Reveal from "../components/Reveal";
import RecommendQuiz from "./RecommendQuiz";
import TrendingSection from "./TrendingSection";
import Link from "next/link";
import { cardBlurb } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Discover | FrameRate",
  description:
    "Get personalized recommendations from FrameRate reviews, plus what's trending and new in games, movies, and TV.",
};

export default async function DiscoverPage() {
  const reviews = await getPublishedReviews();

  const highestRatedByType = reviews.reduce((acc: Record<string, Review>, review: Review) => {
      if (!acc[review.type] || acc[review.type].rating < review.rating) {
        acc[review.type] = review;
      }
      return acc;
    }, {});

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Discover</h1>
        <p className="text-xs sm:text-sm md:text-base text-muted-foreground mb-8 sm:mb-12">
          Answer a couple of questions for a pick tailored to you, or see what&apos;s trending and new.
        </p>

        <div className="mb-12 sm:mb-16">
          <RecommendQuiz reviews={reviews} />
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">Best By Category</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            {Object.values(highestRatedByType).map((review, i) => (
              <Reveal key={review.id} delay={i * 80}>
                <Link href={`/reviews/${review.slug || review.id}`} className="block w-full">
                  <Card
                    rating={review.rating}
                    blurb={cardBlurb(review)}
                    title={review.title}
                    type={review.type}
                    backgroundUrl={review.backgroundUrl}
                    recommendationBadge={review.recommendationBadge}
                  />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>

        <TrendingSection />
      </div>
    </div>
  );
}
