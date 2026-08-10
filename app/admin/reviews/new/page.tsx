import type { Metadata } from "next";
import BreadCrumbs from "@/app/components/BreadCrumbs";
import ReviewForm from "@/app/admin/ReviewForm";
import { getReviews } from "@/lib/getReviews";
import { knownReviewValues } from "@/lib/utils";
import type { ReviewKind } from "@/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "New Review | Admin | FrameRate",
};

const REVIEW_KINDS: ReviewKind[] = ["movie", "game", "series"];
function isReviewKind(value: string): value is ReviewKind {
  return (REVIEW_KINDS as string[]).includes(value);
}

type PageProps = {
  // Populated by the Discover page's "+ Review this" links (title/type of
  // an IGDB/TMDb title that doesn't have a FrameRate review yet).
  searchParams: Promise<{ title?: string; type?: string }>;
};

export default async function NewReviewPage({ searchParams }: PageProps) {
  const { title, type } = await searchParams;
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
          defaultTitle={title}
          defaultType={type && isReviewKind(type) ? type : undefined}
        />
      </div>
    </div>
  );
}
