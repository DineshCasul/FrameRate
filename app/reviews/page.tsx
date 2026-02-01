import { Metadata } from "next";
import ReviewsClient from "../components/ReviewsClient";
import BreadCrumbs from "../components/BreadCrumbs";
import { getReviews } from "@/lib/getReviews";

export const metadata: Metadata = {
  title: "Reviews | FrameRate",
  description:
    "Explore all FrameRate reviews of games, movies, and TV series. Filter and sort by rating, type, and tags.",
  keywords: "reviews, games, movies, series, ratings",
};

async function ReviewsPage() {
  const reviews = await getReviews();
  console.log("Fetched reviews count:", reviews.length);
  return (
    <>
      <div>
        <BreadCrumbs
          crumbs={[{ label: "Home", href: "/" }, { label: "Reviews" }]}
        />
      </div>
      <ReviewsClient initialReviews={reviews} />
    </>
  );
}

export default ReviewsPage;
