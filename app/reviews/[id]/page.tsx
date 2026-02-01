import BreadCrumbs from "@/app/components/BreadCrumbs";
import { getReviews } from "@/lib/getReviews";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import type { Review } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getReviewById(id: string): Promise<Review | null> {
  const reviews = await getReviews();
  return reviews.find((r) => r.id === id || r.slug === id) || null;
}

// Helper to normalize content to string array
const parseContent = (content: string[] | string | undefined): string[] => {
  if (Array.isArray(content)) return content;
  if (typeof content === "string") return content.split("\n").filter(Boolean);
  return [];
};

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
  const review = await getReviewById(id);

  if (!review) {
    return notFound();
  }

  const contentParagraphs = parseContent(review.content);

  return (
    <>
      <div>
        <BreadCrumbs
          crumbs={[
            { label: "Home", href: "/" },
            { label: "Reviews", href: "/reviews" },
            { label: review.title },
          ]}
        />
      </div>
      <div className="min-h-screen p-4 sm:p-8 bg-white dark:bg-black text-black dark:text-white">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
          {review.title}
        </h1>

        <div className="flex flex-wrap gap-2 mb-4 text-xs sm:text-sm">
          <span className="px-2 sm:px-3 py-1 bg-blue-600 text-white rounded text-xs sm:text-sm capitalize">
            {review.type}
          </span>
          {review.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 sm:px-3 py-1 bg-gray-300 dark:bg-gray-700 rounded text-xs sm:text-sm"
            >
              {tag}
            </span>
          ))}
        </div>

        <p className="text-xl sm:text-2xl font-bold mb-4 border-b pb-4">
          Rating: {review.rating}/10
        </p>

        {review.summary && (
          <div className="bg-gray-100 dark:bg-gray-900 p-3 sm:p-4 rounded mb-6 italic text-sm sm:text-base">
            <strong>Summary:</strong> {review.summary}
          </div>
        )}

        {review.trailerUrl && (
          <div className="flex justify-center mb-6 -mx-4 sm:-mx-8 px-4 sm:px-8">
            <div className="w-full max-w-sm sm:max-w-2xl md:max-w-3xl lg:max-w-4xl aspect-video">
              <iframe
                className="w-full h-full rounded-md"
                src={review.trailerUrl.replace("watch?v=", "embed/")}
                title={`${review.title} Trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        <p className="first-letter:text-3xl sm:first-letter:text-4xl md:first-letter:text-5xl first-letter:font-bold first-letter:mr-2 first-letter:float-left mt-4 pt-4 border-t text-sm sm:text-base">
          {contentParagraphs[0]}
        </p>

        <div className="border-b mb-6 pb-4">
          {contentParagraphs.slice(1).map((para, i) => (
            <p key={i} className="mb-4 leading-relaxed text-sm sm:text-base">
              {para}
            </p>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {review.pros && review.pros.length > 0 && (
            <div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 text-green-600">
                Pros
              </h3>
              <ul className="space-y-2 text-sm sm:text-base">
                {review.pros.map((pro, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-green-600 font-bold"></span>
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {review.cons && review.cons.length > 0 && (
            <div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 text-red-600">
                Cons
              </h3>
              <ul className="space-y-2 text-sm sm:text-base">
                {review.cons.map((con, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-red-600 font-bold"></span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {review.verdict && (
          <div className="bg-blue-100 dark:bg-blue-900 p-3 sm:p-4 rounded mb-6">
            <h3 className="text-lg sm:text-xl font-bold mb-2">Final Verdict</h3>
            <p className="text-sm sm:text-base">{review.verdict}</p>
          </div>
        )}

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
                          <div className="w-full bg-gray-300 dark:bg-gray-700 rounded h-2">
                            <div
                              className="bg-blue-600 h-2 rounded"
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

        {(review.playtime || review.platform || review.recommendedFor) && (
          <div className="bg-gray-100 dark:bg-gray-900 p-3 sm:p-4 rounded mb-6 grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 text-sm sm:text-base">
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

        <div className="flex items-center w-full justify-center mt-8">
          <Link
            href="/reviews"
            className="inline-block flex items-center px-4 py-2 text-sm sm:text-base text-black dark:text-white rounded hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
          >
            &larr; Back to Reviews
          </Link>
        </div>
      </div>
    </>
  );
}
