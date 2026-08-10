import Reveal from "../components/Reveal";
import DiscoverTile from "./DiscoverTile";
import { getAnticipatedGames } from "@/lib/igdb";
import { getUpcomingMovies, getTrendingSeries } from "@/lib/tmdb";
import type { ReviewKind } from "@/types";

type Tile = {
  id: string;
  title: string;
  type: ReviewKind;
  imageUrl?: string;
  releaseLabel?: string;
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

async function loadGroups(): Promise<{ label: string; tiles: Tile[] }[]> {
  const [games, movies, series] = await Promise.all([
    getAnticipatedGames(),
    getUpcomingMovies(),
    getTrendingSeries(),
  ]);

  return [
    {
      label: "Most Anticipated Games",
      tiles: games.map((g) => ({
        id: `game-${g.id}`,
        title: g.name,
        type: "game" as const,
        imageUrl: g.coverUrl,
        releaseLabel: formatUnixDate(g.firstReleaseDate),
      })),
    },
    {
      label: "Upcoming Movies",
      tiles: movies.map((m) => ({
        id: `movie-${m.id}`,
        title: m.title,
        type: "movie" as const,
        imageUrl: m.posterUrl,
        releaseLabel: formatIsoDate(m.releaseDate),
      })),
    },
    {
      label: "Trending Series",
      tiles: series.map((s) => ({
        id: `series-${s.id}`,
        title: s.title,
        type: "series" as const,
        imageUrl: s.posterUrl,
        releaseLabel: formatIsoDate(s.releaseDate),
      })),
    },
  ];
}

// Games/movies/series not yet reviewed here, pulled from IGDB (anticipated
// games, by hype) and TMDb (upcoming movies, trending series — TV has no
// clean "upcoming" signal the way movies do). Any group quietly disappears
// if its API keys aren't configured yet rather than showing a broken/empty
// section — see IGDB_CLIENT_ID/IGDB_CLIENT_SECRET/TMDB_API_KEY in .env.local.
export default async function TrendingSection() {
  const groups = (await loadGroups()).filter((g) => g.tiles.length > 0);
  if (groups.length === 0) return null;

  return (
    <div className="mt-12 sm:mt-16">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">Trending &amp; New Releases</h2>
      <p className="text-xs sm:text-sm text-muted-foreground mb-6 sm:mb-8">
        What&apos;s hot in the wider world — nothing here has a FrameRate review yet.
      </p>
      {groups.map((group, gi) => (
        <div key={group.label} className="mb-8 sm:mb-10">
          <h3 className="text-base sm:text-lg font-bold mb-3">{group.label}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {group.tiles.map((tile, i) => (
              <Reveal key={tile.id} delay={(gi * group.tiles.length + i) % 6 * 60}>
                <DiscoverTile
                  title={tile.title}
                  type={tile.type}
                  imageUrl={tile.imageUrl}
                  releaseLabel={tile.releaseLabel}
                />
              </Reveal>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
