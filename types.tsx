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

  youtubeId?: string;
  trailerUrl?: string;

  backgroundUrl?: string;
  coverUrl?: string;

  // Short intro / TLDR
  summary: string;

  // Main long-form review (markdown later)
  content: string[];

  pros: string[];
  cons: string[];

  verdict: string;

  playtime?: string; // "45 hours"
  platform?: string[]; // ["PC", "PS5"]

  recommendedFor?: string[]; // "Souls fans", "Hardcore players"

  status: "draft" | "published";
};
