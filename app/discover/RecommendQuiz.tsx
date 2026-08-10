"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Card from "@/app/components/Card";
import DiscoverTile from "./DiscoverTile";
import { distinctSorted, cardBlurb, RECOMMENDATION_BADGES, TYPE_COLOR_CLASSES } from "@/lib/utils";
import { genresForType, type DiscoverTileData } from "@/lib/discover";
import type { Review, ReviewKind } from "@/types";

type Props = {
  reviews: Review[];
  trendingByType: Record<ReviewKind, DiscoverTileData[]>;
};

type Step = "type" | "genre" | "vibe" | "badge" | "result";

const TYPE_LABELS: { type: ReviewKind; label: string }[] = [
  { type: "game", label: "Game" },
  { type: "movie", label: "Movie" },
  { type: "series", label: "Series" },
];

type Result = {
  pick: Review | null;
  runnersUp: Review[];
  notes: string[];
};

function findPick(reviews: Review[], type: ReviewKind, vibe: string | null, badge: string | null): Result {
  const pool = reviews.filter((r) => r.type === type);
  const notes: string[] = [];

  let candidates = pool;
  if (vibe) candidates = candidates.filter((r) => r.recommendedFor?.includes(vibe));
  if (badge) candidates = candidates.filter((r) => r.recommendationBadge === badge);

  if (candidates.length === 0 && badge) {
    candidates = vibe ? pool.filter((r) => r.recommendedFor?.includes(vibe)) : pool;
    if (candidates.length > 0) {
      notes.push(`Nothing tagged "${badge}" matched exactly, so here's the best available instead.`);
    }
  }
  if (candidates.length === 0 && vibe) {
    candidates = pool;
    notes.push(`No exact "${vibe}" match — here's the best overall in this category.`);
  }

  const sorted = [...candidates].sort((a, b) => b.rating - a.rating);
  return { pick: sorted[0] ?? null, runnersUp: sorted.slice(1, 3), notes };
}

export default function RecommendQuiz({ reviews, trendingByType }: Props) {
  const [step, setStep] = useState<Step>("type");
  const [type, setType] = useState<ReviewKind | null>(null);
  const [genre, setGenre] = useState<string | null>(null);
  const [vibe, setVibe] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  // Surprise-me sets result.pick.type without ever touching the `type`
  // state, so the trending strip needs to fall back to the pick's own type.
  const trendingType = result?.pick?.type ?? type;
  const trendingPool = trendingType ? trendingByType[trendingType] : [];
  // Genre only applies to the guided path (surprise-me never sets it) —
  // narrows the external pool the same way vibe narrows your own reviews.
  // Pool is already ordered by hype/popularity from the source fetch, so
  // filtering preserves a reasonable "best first" order.
  const trendingTiles = (genre ? trendingPool.filter((t) => t.genres.includes(genre)) : trendingPool).slice(
    0,
    6,
  );

  const availableTypes = useMemo(
    () => TYPE_LABELS.filter((t) => reviews.some((r) => r.type === t.type)),
    [reviews],
  );

  const genreOptions = useMemo(() => {
    if (!type) return [];
    return genresForType(trendingByType[type]);
  }, [trendingByType, type]);

  const vibeOptions = useMemo(() => {
    if (!type) return [];
    return distinctSorted(
      reviews.filter((r) => r.type === type).flatMap((r) => r.recommendedFor ?? []),
    );
  }, [reviews, type]);

  function reset() {
    setStep("type");
    setType(null);
    setGenre(null);
    setVibe(null);
    setResult(null);
  }

  function pickType(t: ReviewKind) {
    setType(t);
    setStep(genresForType(trendingByType[t]).length > 0 ? "genre" : "vibe");
  }

  function surpriseMe() {
    const pick = reviews[Math.floor(Math.random() * reviews.length)];
    setResult({ pick, runnersUp: [], notes: ["Random pick from everything published."] });
    setStep("result");
  }

  function pickGenre(g: string | null) {
    setGenre(g);
    setStep("vibe");
  }

  function pickVibe(v: string | null) {
    setVibe(v);
    setStep("badge");
  }

  function pickBadge(b: string | null) {
    if (type) {
      setResult(findPick(reviews, type, vibe, b));
    }
    setStep("result");
  }

  const chipClass =
    "px-4 py-2 rounded-full border text-sm sm:text-base hover:bg-muted transition cursor-pointer";

  if (reviews.length === 0) {
    return (
      <div className="border rounded p-6 sm:p-8 text-center text-muted-foreground">
        No published reviews yet — check back soon.
      </div>
    );
  }

  return (
    <div className="border rounded p-6 sm:p-8">
      {step === "type" && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300 fill-mode-both">
          <h2 className="text-lg sm:text-xl font-bold mb-4">What are you in the mood for?</h2>
          <div className="flex flex-wrap gap-3">
            {availableTypes.map(({ type: t, label }, i) => (
              <button
                key={t}
                type="button"
                onClick={() => pickType(t)}
                className={`${chipClass} animate-in fade-in zoom-in-95 duration-300 fill-mode-both`}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {label}
              </button>
            ))}
            <button
              type="button"
              onClick={surpriseMe}
              className={`${chipClass} animate-in fade-in zoom-in-95 duration-300 fill-mode-both`}
              style={{ animationDelay: `${availableTypes.length * 60}ms` }}
            >
              Just surprise me
            </button>
          </div>
        </div>
      )}

      {step === "genre" && type && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300 fill-mode-both">
          <h2 className="text-lg sm:text-xl font-bold mb-1">Any genre in mind?</h2>
          <p className="text-sm text-muted-foreground mb-4">
            This narrows what we show you from what&apos;s trending right now, not your pick below.
          </p>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => pickGenre(null)} className={chipClass}>
              Any
            </button>
            {genreOptions.map((g, i) => (
              <button
                key={g}
                type="button"
                onClick={() => pickGenre(g)}
                className={`${chipClass} animate-in fade-in zoom-in-95 duration-300 fill-mode-both`}
                style={{ animationDelay: `${i * 40}ms` }}
              >
                {g}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setStep("type")}
            className="text-sm text-muted-foreground hover:underline mt-4"
          >
            &larr; Back
          </button>
        </div>
      )}

      {step === "vibe" && type && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300 fill-mode-both">
          <h2 className="text-lg sm:text-xl font-bold mb-1">What matches you?</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Picking a {type} — narrow it down, or skip.
          </p>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => pickVibe(null)} className={chipClass}>
              Any
            </button>
            {vibeOptions.map((v, i) => (
              <button
                key={v}
                type="button"
                onClick={() => pickVibe(v)}
                className={`${chipClass} animate-in fade-in zoom-in-95 duration-300 fill-mode-both`}
                style={{ animationDelay: `${i * 40}ms` }}
              >
                {v}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setStep(genreOptions.length > 0 ? "genre" : "type")}
            className="text-sm text-muted-foreground hover:underline mt-4"
          >
            &larr; Back
          </button>
        </div>
      )}

      {step === "badge" && type && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300 fill-mode-both">
          <h2 className="text-lg sm:text-xl font-bold mb-1">What kind of pick are you after?</h2>
          <p className="text-sm text-muted-foreground mb-4">Skip if you don&apos;t have a preference.</p>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => pickBadge(null)} className={chipClass}>
              Any
            </button>
            {RECOMMENDATION_BADGES[type].map((b, i) => (
              <button
                key={b}
                type="button"
                onClick={() => pickBadge(b)}
                className={`${chipClass} animate-in fade-in zoom-in-95 duration-300 fill-mode-both`}
                style={{ animationDelay: `${i * 40}ms` }}
              >
                {b}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setStep("vibe")}
            className="text-sm text-muted-foreground hover:underline mt-4"
          >
            &larr; Back
          </button>
        </div>
      )}

      {step === "result" && result && (
        <div className="animate-in fade-in duration-300 fill-mode-both">
          {result.pick ? (
            <>
              <h2 className="text-lg sm:text-xl font-bold mb-4">Your Pick</h2>
              {result.notes.map((note) => (
                <p key={note} className="text-sm text-muted-foreground mb-4">
                  {note}
                </p>
              ))}
              <Link
                href={`/reviews/${result.pick.slug || result.pick.id}`}
                className="block mb-6 animate-in fade-in zoom-in-95 duration-500 fill-mode-both"
              >
                <Card
                  title={result.pick.title}
                  rating={result.pick.rating}
                  blurb={cardBlurb(result.pick)}
                  type={result.pick.type}
                  backgroundUrl={result.pick.backgroundUrl}
                  recommendationBadge={result.pick.recommendationBadge}
                />
              </Link>
              {result.pick.verdict && (
                <p
                  className={`text-base font-semibold mb-6 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-150 fill-mode-both ${TYPE_COLOR_CLASSES[result.pick.type].text}`}
                >
                  &ldquo;{result.pick.verdict}&rdquo;
                </p>
              )}
              {result.runnersUp.length > 0 && (
                <div className="mb-6 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300 fill-mode-both">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                    Also consider
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {result.runnersUp.map((r) => (
                      <Link href={`/reviews/${r.slug || r.id}`} key={r.id}>
                        <Card
                          title={r.title}
                          rating={r.rating}
                          blurb={cardBlurb(r)}
                          type={r.type}
                          backgroundUrl={r.backgroundUrl}
                          recommendationBadge={r.recommendationBadge}
                        />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-muted-foreground mb-6">No match found — try different answers.</p>
          )}
          {trendingTiles.length > 0 && (
            <div className="mb-6 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-500 fill-mode-both">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                Trending {genre ? `${genre} ` : ""}
                {trendingType} right now — not reviewed here yet
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {trendingTiles.map((tile) => (
                  <DiscoverTile
                    key={tile.id}
                    title={tile.title}
                    type={tile.type}
                    imageUrl={tile.imageUrl}
                    releaseLabel={tile.releaseLabel}
                    genres={tile.genres}
                  />
                ))}
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={reset}
            className="border rounded px-4 py-2 text-sm hover:bg-muted transition cursor-pointer"
          >
            Start Over
          </button>
        </div>
      )}
    </div>
  );
}
