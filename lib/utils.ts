import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Review, ReviewKind } from "@/types"

// Aspect fields shown/saved per type — mirrors the conditional section in
// Admin - Review Authoring Form Plan.md: story/visuals/soundtrack always,
// the rest split by whether it's a game or a movie/series. Shared by the
// admin form (which fields to render) and its server action (which fields
// to read out of FormData).
export const COMMON_ASPECTS = ["story", "visuals", "soundtrack"] as const;
export const GAME_ASPECTS = ["gameplay", "levelDesign", "replayValue"] as const;
export const SCREEN_ASPECTS = ["acting", "direction"] as const;

export function aspectFieldsFor(type: ReviewKind): readonly string[] {
  return [...COMMON_ASPECTS, ...(type === "game" ? GAME_ASPECTS : SCREEN_ASPECTS)];
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Type-filter shortcuts — shared by the homepage hero and the mobile
// header menu so the two don't drift out of sync with each other. `type`
// lets both hover the link's underline in that type's accent color.
export const TYPE_QUICK_LINKS: { href: string; label: string; type: ReviewKind }[] = [
  { href: "/reviews?type=game", label: "Games", type: "game" },
  { href: "/reviews?type=movie", label: "Movies", type: "movie" },
  { href: "/reviews?type=series", label: "Series", type: "series" },
];

// Single source of truth for the movie/game/series accent colors (CSS vars
// defined in globals.css). Tailwind needs literal class names, not string
// interpolation, so this is a lookup table rather than a template.
export const TYPE_COLOR_CLASSES: Record<
  ReviewKind,
  { bg: string; text: string; hoverBg: string; cssVar: string }
> = {
  movie: {
    bg: "bg-type-movie",
    text: "text-type-movie",
    hoverBg: "hover:bg-type-movie/15",
    cssVar: "var(--type-movie)",
  },
  game: {
    bg: "bg-type-game",
    text: "text-type-game",
    hoverBg: "hover:bg-type-game/15",
    cssVar: "var(--type-game)",
  },
  series: {
    bg: "bg-type-series",
    text: "text-type-series",
    hoverBg: "hover:bg-type-series/15",
    cssVar: "var(--type-series)",
  },
};

// The line shown on a Card — verdict is the punchiest one-liner, summary
// (the TLDR) next, and the long-form content is only a last resort for rows
// saved before verdict/summary were filled in.
export function cardBlurb(review: Pick<Review, "verdict" | "summary" | "content">): string {
  return review.verdict || review.summary || parseContent(review.content).join(" ");
}

// Supabase can return `content` as either a text[] column or a single
// newline-delimited string depending on how a review was saved, so every
// consumer needs to normalize before treating it as paragraphs.
export function parseContent(content: string[] | string | undefined): string[] {
  if (Array.isArray(content)) return content;
  if (typeof content === "string") return content.split("\n").filter(Boolean);
  return [];
}

// Handles youtube.com/watch?v=, youtube.com/embed/, and youtu.be/ links —
// the old code only handled the first via a naive string .replace().
export function getYouTubeId(url?: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/,
  );
  return match ? match[1] : null;
}

// Shared by the admin form (live preview) and its server action (actual
// save) so "one item per line" splits identically in both places.
export function linesToArray(value: FormDataEntryValue | null | undefined): string[] {
  return String(value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

// Seed list so the platform picker has useful options even before any
// review has been tagged with them — unlike tags/recommendedFor, platforms
// are a small well-known domain worth pre-populating.
export const COMMON_PLATFORMS = [
  "PC",
  "PlayStation 5",
  "PlayStation 4",
  "Xbox Series X/S",
  "Nintendo Switch",
  "Mobile",
] as const;

// One-liner "should you bother" verdicts, distinct per type since a game's
// day-1-buy calculus doesn't map onto a movie or series. Admin form limits
// the picker to these — deliberately closed, not a TagPicker-style free-text
// list, so the badge stays a quick recognizable signal across cards.
export const RECOMMENDATION_BADGES: Record<ReviewKind, string[]> = {
  game: [
    "I'd Buy on Day 1",
    "Wait for a Sale",
    "Worth a Rental",
    "Only for Genre Diehards",
    "Not Worth Your Time",
  ],
  movie: [
    "Catch It in Theaters",
    "Perfect Rainy-Day Watch",
    "One and Done",
    "Only for the Fans",
    "Skip It",
  ],
  series: [
    "Cleared My Schedule for This",
    "Solid Weekend Binge",
    "One Season and Out",
    "Only for the Fans",
    "Skip It",
  ],
};

export function distinctSorted(values: string[]): string[] {
  return Array.from(new Set(values.map((v) => v.trim()).filter(Boolean))).sort((a, b) =>
    a.localeCompare(b),
  );
}

// Known values for the admin form's tag/platform/recommendedFor pickers —
// derived from what's already in the data, so the options list grows with
// real usage instead of needing separate upkeep.
export function knownReviewValues(reviews: Review[]) {
  return {
    tags: distinctSorted(reviews.flatMap((r) => r.tags)),
    platforms: distinctSorted([...COMMON_PLATFORMS, ...reviews.flatMap((r) => r.platform ?? [])]),
    recommendedFor: distinctSorted(reviews.flatMap((r) => r.recommendedFor ?? [])),
  };
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Inverse of the normalizeReview() camelCase conversion in getReviews.ts —
// only renames top-level keys (aspectRatings' internal keys like
// "levelDesign" are stored camelCase inside the jsonb column on purpose,
// matching how Review['aspectRatings'] is typed, so this does not recurse).
export function toSnakeCase(fields: Record<string, unknown>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(fields)) {
    const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
    row[snakeKey] = value;
  }
  return row;
}
