import { parseContent, getYouTubeId, TYPE_COLOR_CLASSES } from "@/lib/utils";
import { YouTubeFacade } from "@/app/components/YouTubeFacade";
import Reveal from "@/app/components/Reveal";
import Link from "next/link";
import { CheckIcon, Cross2Icon } from "@radix-ui/react-icons";
import type { Review } from "@/types";

type Props = {
  review: Review;
  // Live preview (no real slugs to link to yet) renders tags as plain text
  // instead of /reviews?tag= links.
  linkTags?: boolean;
};

// The score/verdict/aspect-ratings/pros-cons/write-up block shared by the
// real review page and the admin form's live preview, so the preview is
// guaranteed to match production instead of re-implementing the layout.
const ReviewDetailContent = ({ review, linkTags = true }: Props) => {
  const contentParagraphs = parseContent(review.content);
  const youtubeId = getYouTubeId(review.trailerUrl) ?? review.youtubeId;
  const typeAccent = TYPE_COLOR_CLASSES[review.type].bg;

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both">
        {review.title}
      </h1>

      <div className="flex flex-wrap gap-2 mb-6 text-xs sm:text-sm animate-in fade-in slide-in-from-bottom-2 duration-500 delay-75 fill-mode-both">
        <span className={`px-2 sm:px-3 py-1 text-white rounded text-xs sm:text-sm capitalize ${typeAccent}`}>
          {review.type}
        </span>
        {review.tags.map((tag) =>
          linkTags ? (
            <Link
              key={tag}
              href={`/reviews?tag=${encodeURIComponent(tag)}`}
              className="px-2 sm:px-3 py-1 bg-secondary rounded text-xs sm:text-sm hover:opacity-80 transition"
            >
              {tag}
            </Link>
          ) : (
            <span key={tag} className="px-2 sm:px-3 py-1 bg-secondary rounded text-xs sm:text-sm">
              {tag}
            </span>
          ),
        )}
      </div>

      {/* At a glance: score + verdict, paired as one statement instead of split top/bottom */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-6 pb-6 border-b animate-in fade-in slide-in-from-bottom-2 duration-500 delay-150 fill-mode-both">
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

      {(() => {
        const hasAspectRatings =
          review.aspectRatings && Object.keys(review.aspectRatings).length > 0;
        // Playtime used to be tied to aspectRatings' own presence check, so
        // a review with playtime but no aspect ratings filled in silently
        // lost its playtime display entirely — decoupled here.
        if (!hasAspectRatings && !review.playtime) return null;

        return (
          <Reveal className="mb-6">
            {hasAspectRatings && (
              <h3 className="text-lg sm:text-xl font-bold mb-3">
                Aspect Ratings
              </h3>
            )}
            {review.playtime && (
              <p className="text-xs sm:text-sm text-muted-foreground mb-3">
                Playtime: {review.playtime}
              </p>
            )}
            {hasAspectRatings && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                {Object.entries(review.aspectRatings!).map(
                  ([aspect, rating], i) =>
                    // rating !== undefined (not `rating &&`) — an aspect
                    // explicitly scored 0 is still a real rating to show,
                    // not the same as the aspect never being filled in.
                    rating !== undefined && (
                      <div key={aspect}>
                        <div className="capitalize font-semibold mb-1 text-xs sm:text-sm">
                          {aspect.replace(/([A-Z])/g, " $1")}
                        </div>
                        <div className="flex items-center gap-2 text-xs sm:text-sm">
                          <div className="w-full bg-secondary rounded h-2">
                            <div
                              className={`${typeAccent} h-2 rounded animate-fill-bar`}
                              style={{ width: `${(rating / 10) * 100}%`, animationDelay: `${250 + i * 80}ms` }}
                            />
                          </div>
                          <span className="font-bold min-w-fit">{rating}</span>
                        </div>
                      </div>
                    ),
                )}
              </div>
            )}
          </Reveal>
        );
      })()}

      <Reveal className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6" delay={80}>
        {review.pros && review.pros.length > 0 && (
          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-3 text-status-good">
              What I Loved
            </h3>
            <ul className="space-y-2 text-sm sm:text-base">
              {review.pros.map((pro, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2.5 animate-in fade-in slide-in-from-left-2 duration-400 fill-mode-both"
                  style={{ animationDelay: `${300 + i * 60}ms` }}
                >
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
                <li
                  key={i}
                  className="flex items-center gap-2.5 animate-in fade-in slide-in-from-left-2 duration-400 fill-mode-both"
                  style={{ animationDelay: `${300 + i * 60}ms` }}
                >
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-status-bad text-white shrink-0">
                    <Cross2Icon className="w-3 h-3" />
                  </span>
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Reveal>

      {youtubeId && (
        <Reveal className="flex justify-center mb-6 -mx-4 sm:-mx-8 px-4 sm:px-8">
          <div className="w-full max-w-sm sm:max-w-2xl md:max-w-3xl lg:max-w-4xl aspect-video">
            <YouTubeFacade videoId={youtubeId} title={`${review.title} Trailer`} />
          </div>
        </Reveal>
      )}

      {/* The full write-up — the argument behind the score/verdict above */}
      <Reveal className="border-t pt-6">
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
      </Reveal>

      {/* .length check, not just truthy — the admin form always sends
          platform/recommendedFor as arrays (possibly empty []), never
          undefined, and an empty array is still truthy in JS. */}
      {((review.platform && review.platform.length > 0) ||
        (review.recommendedFor && review.recommendedFor.length > 0)) && (
        <Reveal className="bg-muted p-3 sm:p-4 rounded mb-6 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 text-sm sm:text-base">
          {review.platform && review.platform.length > 0 && (
            <div>
              <h4 className="font-bold mb-1">Platforms</h4>
              <p>{review.platform.join(", ")}</p>
            </div>
          )}
          {review.recommendedFor && review.recommendedFor.length > 0 && (
            <div>
              <h4 className="font-bold mb-1">Recommended For</h4>
              <p>{review.recommendedFor.join(", ")}</p>
            </div>
          )}
        </Reveal>
      )}
    </div>
  );
};

export default ReviewDetailContent;
