import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { ReviewKind } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Single source of truth for the movie/game/series accent colors (CSS vars
// defined in globals.css). Tailwind needs literal class names, not string
// interpolation, so this is a lookup table rather than a template.
export const TYPE_COLOR_CLASSES: Record<
  ReviewKind,
  { bg: string; text: string; hoverBg: string }
> = {
  movie: {
    bg: "bg-type-movie",
    text: "text-type-movie",
    hoverBg: "hover:bg-type-movie/15",
  },
  game: {
    bg: "bg-type-game",
    text: "text-type-game",
    hoverBg: "hover:bg-type-game/15",
  },
  series: {
    bg: "bg-type-series",
    text: "text-type-series",
    hoverBg: "hover:bg-type-series/15",
  },
};

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
