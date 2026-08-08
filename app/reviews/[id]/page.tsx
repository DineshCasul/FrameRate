import BreadCrumbs from "@/app/components/BreadCrumbs";
import Card from "@/app/components/Card";
import { YouTubeFacade } from "@/app/components/YouTubeFacade";
import { getPublishedReviews } from "@/lib/getReviews";
import { parseContent, getYouTubeId, TYPE_COLOR_CLASSES } from "@/lib/utils";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckIcon, Cross2Icon } from "@radix-ui/react-icons";
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

  const contentParagraphs = parseContent(review.content);
  const youtubeId = getYouTubeId(review.trailerUrl) ?? review.youtubeId;
  const typeAccent = TYPE_COLOR_CLASSES[review.type].bg;

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
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
          {review.title}
        </h1>

        <div className="flex flex-wrap gap-2 mb-6 text-xs sm:text-sm">
          <span className={`px-2 sm:px-3 py-1 text-white rounded text-xs sm:text-sm capitalize ${typeAccent}`}>
            {review.type}
          </span>
          {review.tags.map((tag) => (
            <Link
              key={tag}
              href={`/reviews?tag=${encodeURIComponent(tag)}`}
              className="px-2 sm:px-3 py-1 bg-secondary rounded text-xs sm:text-sm hover:opacity-80 transition"
            >
              {tag}
            </Link>
          ))}
        </div>

        {/* At a glance: score + verdict, paired as one statement instead of split top/bottom */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-6 pb-6 border-b">
          <div
            className={`shrink-0 flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-2xl text-white ${typeAccent}`}
          >
            <span className="text-4xl sm:text-5xl font-bold leading-none">{review.rating}</span>
          </div>
          {review.verdict && (
            <p className="text-base sm:text-lg font-semibold leading-snug text-center sm:text-left">
              {review.verdict}
            </p>
          )}
        </div>

        {review.aspectRatings &&
          Object.keys(review.aspectRatings).length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg sm:text-xl font-bold mb-3">
                Aspect Ratings
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                {Object.entries(review.aspectRatings).map(
                  ([aspect, rating]) =>
                    rating && (
                      <div key={aspect}>
                        <div className="capitalize font-semibold mb-1 text-xs sm:text-sm">
                          {aspect.replace(/([A-Z])/g, " $1")}
                        </div>
                        <div className="flex items-center gap-2 text-xs sm:text-sm">
                          <div className="w-full bg-secondary rounded h-2">
                            <div
                              className={`${typeAccent} h-2 rounded`}
                              style={{ width: `${(rating / 10) * 100}%` }}
                            />
                          </div>
                          <span className="font-bold min-w-fit">{rating}</span>
                        </div>
                      </div>
                    ),
                )}
              </div>
            </div>
          )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {review.pros && review.pros.length > 0 && (
            <div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 text-status-good">
                What I Loved
              </h3>
              <ul className="space-y-2 text-sm sm:text-base">
                {review.pros.map((pro, i) => (
                  <li key={i} className="flex items-center gap-2.5">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-status-good text-white shrink-0">
                      <CheckIcon className="w-3 h-3" />
                    </span>
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {review.cons && review.cons.length > 0 && (
            <div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 text-status-bad">
                What I Didn&apos;t Like
              </h3>
              <ul className="space-y-2 text-sm sm:text-base">
                {review.cons.map((con, i) => (
                  <li key={i} className="flex items-center gap-2.5">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-status-bad text-white shrink-0">
                      <Cross2Icon className="w-3 h-3" />
                    </span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {youtubeId && (
          <div className="flex justify-center mb-6 -mx-4 sm:-mx-8 px-4 sm:px-8">
            <div className="w-full max-w-sm sm:max-w-2xl md:max-w-3xl lg:max-w-4xl aspect-video">
              <YouTubeFacade videoId={youtubeId} title={`${review.title} Trailer`} />
            </div>
          </div>
        )}

        {/* The full write-up — the argument behind the score/verdict above */}
        <div className="border-t pt-6">
          {review.summary && (
            <p className="italic text-muted-foreground mb-4 text-sm sm:text-base">
              {review.summary}
            </p>
          )}
          {contentParagraphs.map((para, i) => (
            <p key={i} className="mb-4 leading-relaxed text-sm sm:text-base">
              {para}
            </p>
          ))}
        </div>

        {(review.playtime || review.platform || review.recommendedFor) && (
          <div className="bg-muted p-3 sm:p-4 rounded mb-6 grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 text-sm sm:text-base">
            {review.playtime && (
              <div>
                <h4 className="font-bold mb-1">Playtime</h4>
                <p>{review.playtime}</p>
              </div>
            )}
            {review.platform && (
              <div>
                <h4 className="font-bold mb-1">Platforms</h4>
                <p>{review.platform.join(", ")}</p>
              </div>
            )}
            {review.recommendedFor && (
              <div>
                <h4 className="font-bold mb-1">Recommended For</h4>
                <p>{review.recommendedFor.join(", ")}</p>
              </div>
            )}
          </div>
        )}

        {(previousReview || nextReview) && (
          <div className="flex justify-between items-center gap-4 border-t pt-4 mt-8 text-sm sm:text-base">
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
          </div>
        )}

        {relatedReviews.length > 0 && (
          <div className="mt-10">
            <h3 className="text-lg sm:text-xl font-bold mb-4">You Might Also Like</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 justify-items-center">
              {relatedReviews.map((r) => (
                <Link
                  href={`/reviews/${r.slug || r.id}`}
                  key={r.id}
                  className="block w-full"
                >
                  <Card
                    rating={r.rating}
                    description={r.content}
                    title={r.title}
                    type={r.type}
                    backgroundUrl={r.backgroundUrl}
                  />
                </Link>
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
