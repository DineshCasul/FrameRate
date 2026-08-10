export type ReviewKind = "movie" | "game" | "series";

export type Review = {
  id: string;
  slug: string;

  title: string;
  type: ReviewKind; // game | movie | series

  rating: number; // overall (0–10)

  aspectRatings?: {
    gameplay?: number;
    story?: number;
    visuals?: number;
    soundtrack?: number;
    acting?: number;
    direction?: number;
    levelDesign?: number;
    replayValue?: number;
  };

  tags: string[];

  publishedAt: string;
  created_at?: string; // set by Supabase, used for newest/oldest sorting

  youtubeId?: string;
  trailerUrl?: string;

  backgroundUrl?: string;
  coverUrl?: string;

  // Short intro / TLDR
  summary: string;

  // Main long-form review (markdown later). Supabase stores this as either
  // a text[] column or a single newline-delimited string depending on how
  // the row was saved — see parseContent() in lib/utils.ts.
  content: string[] | string;

  pros: string[];
  cons: string[];

  verdict: string;

  playtime?: string; // "45 hours"
  platform?: string[]; // ["PC", "PS5"]

  recommendedFor?: string[]; // "Souls fans", "Hardcore players"

  // One predefined phrase from RECOMMENDATION_BADGES[type], shown as a
  // small pill on the card — a quick "should you bother" verdict distinct
  // from the numeric rating.
  recommendationBadge?: string;

  status: "draft" | "published";
};
