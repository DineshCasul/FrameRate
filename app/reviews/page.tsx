import { Metadata } from "next";
import { Suspense } from "react";
import ReviewsClient from "../components/ReviewsClient";
import BreadCrumbs from "../components/BreadCrumbs";
import { getPublishedReviews } from "@/lib/getReviews";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Reviews | FrameRate",
  description:
    "Explore all FrameRate reviews of games, movies, and TV series. Filter and sort by rating, type, and tags.",
  keywords: "reviews, games, movies, series, ratings",
};

async function ReviewsPage() {
  const reviews = await getPublishedReviews();
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <BreadCrumbs
        crumbs={[{ label: "Home", href: "/" }, { label: "Reviews" }]}
      />
      <Suspense fallback={null}>
        <ReviewsClient initialReviews={reviews} />
      </Suspense>
    </div>
  );
}

export default ReviewsPage;
