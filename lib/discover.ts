import { getAnticipatedGames } from "./igdb";
import { getUpcomingMovies, getTrendingSeries } from "./tmdb";
import { distinctSorted } from "./utils";
import type { Review, ReviewKind } from "@/types";

export type DiscoverTileData = {
  id: string;
  title: string;
  type: ReviewKind;
  imageUrl?: string;
  releaseLabel?: string;
  genres: string[];
};

function formatUnixDate(seconds?: number): string | undefined {
  if (!seconds) return undefined;
  return new Date(seconds * 1000).toLocaleDateString(undefined, { year: "numeric", month: "short" });
}

function formatIsoDate(iso?: string): string | undefined {
  if (!iso) return undefined;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short" });
}

// Loose match, not exact — "The Batman" vs "the batman " should count the
// same, and this only needs to be good enough to avoid recommending
// something you've obviously already reviewed, not airtight.
function normalizeTitle(title: string): string {
  return title.trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

// Single fetch point for external (not-yet-reviewed) titles, grouped by
// type — shared by the Trending & New Releases section and the quiz's
// genre-filtered result strip, so both read the same in-memory-cached data
// instead of each triggering their own IGDB/TMDb round trip. `reviews` is
// used only to filter out titles you've already reviewed here.
export async function loadTrendingByType(reviews: Review[]): Promise<Record<ReviewKind, DiscoverTileData[]>> {
  const reviewedTitles = new Set(reviews.map((r) => normalizeTitle(r.title)));

  const [games, movies, series] = await Promise.all([
    getAnticipatedGames(),
    getUpcomingMovies(),
    getTrendingSeries(),
  ]);

  const byType: Record<ReviewKind, DiscoverTileData[]> = {
    game: games.map((g) => ({
      id: `game-${g.id}`,
      title: g.name,
      type: "game" as const,
      imageUrl: g.coverUrl,
      releaseLabel: formatUnixDate(g.firstReleaseDate),
      genres: g.genres,
    })),
    movie: movies.map((m) => ({
      id: `movie-${m.id}`,
      title: m.title,
      type: "movie" as const,
      imageUrl: m.posterUrl,
      releaseLabel: formatIsoDate(m.releaseDate),
      genres: m.genres,
    })),
    series: series.map((s) => ({
      id: `series-${s.id}`,
      title: s.title,
      type: "series" as const,
      imageUrl: s.posterUrl,
      releaseLabel: formatIsoDate(s.releaseDate),
      genres: s.genres,
    })),
  };

  for (const type of Object.keys(byType) as ReviewKind[]) {
    byType[type] = byType[type].filter((tile) => !reviewedTitles.has(normalizeTitle(tile.title)));
  }

  return byType;
}

export const DISCOVER_GROUP_LABELS: Record<ReviewKind, string> = {
  game: "Most Anticipated Games",
  movie: "Upcoming Movies",
  series: "Trending Series",
};

// Genre options for the quiz's genre step — sourced from whatever's actually
// in the current pool for that type, so the options are never empty/dead.
export function genresForType(tiles: DiscoverTileData[]): string[] {
  return distinctSorted(tiles.flatMap((t) => t.genres)).slice(0, 8);
}
