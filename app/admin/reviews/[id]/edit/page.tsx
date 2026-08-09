import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BreadCrumbs from "@/app/components/BreadCrumbs";
import ReviewForm from "@/app/admin/ReviewForm";
import { getReviews } from "@/lib/getReviews";
import { knownReviewValues } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Edit Review | Admin | FrameRate",
};

export default async function EditReviewPage({ params }: PageProps) {
  const { id } = await params;
  // Admin-only getReviews() (unfiltered) — a draft must be editable here
  // even though getPublishedReviews() would hide it from visitors.
  const reviews = await getReviews();
  const review = reviews.find((r) => r.id === id || r.slug === id);

  if (!review) {
    return notFound();
  }

  const { tags, platforms, recommendedFor } = knownReviewValues(reviews);

  return (
    <div className="min-h-screen px-4 sm:px-6 py-6 sm:py-8">
      <div className="max-w-6xl mx-auto">
        <BreadCrumbs
          crumbs={[{ label: "Admin", href: "/admin" }, { label: `Edit: ${review.title}` }]}
        />
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Edit Review</h1>
        <ReviewForm
          initialReview={review}
          availableTags={tags}
          availablePlatforms={platforms}
          availableRecommendedFor={recommendedFor}
        />
      </div>
    </div>
  );
}
