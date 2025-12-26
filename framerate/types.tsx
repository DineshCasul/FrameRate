export type ReviewKind = "movie" | "game" | "series";
export interface Review {
  id: string;
  type: "movie" | "game" | "series";
  title: string;
  rating: number;
  summary: string;
  description: string;
  publishedAt: string; // ISO date
  tags: string[];
  trailerUrl?: string; // optional YouTube trailer link
}
