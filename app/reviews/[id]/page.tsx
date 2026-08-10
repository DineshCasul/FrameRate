import BreadCrumbs from "@/app/components/BreadCrumbs";
import Card from "@/app/components/Card";
import Reveal from "@/app/components/Reveal";
import ReviewDetailContent from "@/app/components/ReviewDetail";
import Reactions from "./Reactions";
import TypeGlow from "./TypeGlow";
import { getPublishedReviews } from "@/lib/getReviews";
import { getReactionCounts } from "./actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { cardBlurb } from "@/lib/utils";
import type { Metadata } from "next";
import type { Review } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getReviewById(id: string): Promise<Review | null> {
  const reviews = await getPublishedReviews();
  return reviews.find((r) => r.id === id || r.slug === id) || null;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const review = await getReviewById(id);

  if (!review) {
    return { title: "Review Not Found | FrameRate" };
  }

  return {
    title: `${review.title} | FrameRate`,
    description:
      review.summary ||
      `Read the FrameRate review of ${review.title}. Rating: ${review.rating}/10`,
    keywords: [review.title, ...review.tags, review.type].join(", "),
  };
}

export default async function ReviewDetail({ params }: PageProps) {
  const { id } = await params;
  const allReviews = await getPublishedReviews();
  const review = allReviews.find((r) => r.id === id || r.slug === id);

  if (!review) {
    return notFound();
  }

  const currentIndex = allReviews.findIndex((r) => r.id === review.id);
  const previousReview = allReviews[currentIndex - 1] ?? null;
  const nextReview = allReviews[currentIndex + 1] ?? null;

  const relatedReviews = allReviews
    .filter(
      (r) =>
        r.id !== review.id &&
        (r.type === review.type || r.tags.some((tag) => review.tags.includes(tag))),
    )
    .slice(0, 3);

  const reactionCounts = await getReactionCounts(review.id);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-6 sm:py-8">
      <BreadCrumbs
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Reviews", href: "/reviews" },
          { label: review.title },
        ]}
      />
      <div>
        <TypeGlow type={review.type} />
        <ReviewDetailContent review={review} />

        <Reactions key={review.id} reviewId={review.id} initialCounts={reactionCounts} />

        {(previousReview || nextReview) && (
          <Reveal className="flex justify-between items-center gap-4 border-t pt-4 mt-8 text-sm sm:text-base">
            {previousReview ? (
              <Link
                href={`/reviews/${previousReview.slug || previousReview.id}`}
                className="hover:underline"
              >
                &larr; {previousReview.title}
              </Link>
            ) : (
              <span />
            )}
            {nextReview && (
              <Link
                href={`/reviews/${nextReview.slug || nextReview.id}`}
                className="hover:underline text-right"
              >
                {nextReview.title} &rarr;
              </Link>
            )}
          </Reveal>
        )}

        {relatedReviews.length > 0 && (
          <div className="mt-10">
            <h3 className="text-lg sm:text-xl font-bold mb-4">You Might Also Like</h3>
            <div className="grid grid-cols-1 gap-3">
              {relatedReviews.map((r, i) => (
                <Reveal key={r.id} delay={i * 80}>
                  <Link href={`/reviews/${r.slug || r.id}`} className="block w-full">
                    <Card
                      rating={r.rating}
                      blurb={cardBlurb(r)}
                      title={r.title}
                      type={r.type}
                      backgroundUrl={r.backgroundUrl}
                      recommendationBadge={r.recommendationBadge}
                    />
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center w-full justify-center mt-8">
          <Link
            href="/reviews"
            className="inline-block flex items-center px-4 py-2 text-sm sm:text-base rounded hover:bg-muted transition-colors"
          >
            &larr; Back to Reviews
          </Link>
        </div>
      </div>
    </div>
  );
}
