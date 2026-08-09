import type { Metadata } from "next";
import BreadCrumbs from "@/app/components/BreadCrumbs";
import ReviewForm from "@/app/admin/ReviewForm";
import { getReviews } from "@/lib/getReviews";
import { knownReviewValues } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "New Review | Admin | FrameRate",
};

export default async function NewReviewPage() {
  const reviews = await getReviews();
  const { tags, platforms, recommendedFor } = knownReviewValues(reviews);

  return (
    <div className="min-h-screen px-4 sm:px-6 py-6 sm:py-8">
      <div className="max-w-6xl mx-auto">
        <BreadCrumbs
          crumbs={[{ label: "Admin", href: "/admin" }, { label: "New Review" }]}
        />
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">New Review</h1>
        <ReviewForm
          availableTags={tags}
          availablePlatforms={platforms}
          availableRecommendedFor={recommendedFor}
        />
      </div>
    </div>
  );
}
