import Reveal from "../components/Reveal";
import DiscoverTile from "./DiscoverTile";
import { DISCOVER_GROUP_LABELS, type DiscoverTileData } from "@/lib/discover";
import type { ReviewKind } from "@/types";

type Props = {
  trendingByType: Record<ReviewKind, DiscoverTileData[]>;
};

// Games/movies/series not yet reviewed here, pulled from IGDB (anticipated
// games, by hype) and TMDb (upcoming movies, trending series — TV has no
// clean "upcoming" signal the way movies do). Any group quietly disappears
// if its API keys aren't configured yet rather than showing a broken/empty
// section — see IGDB_CLIENT_ID/IGDB_CLIENT_SECRET/TMDB_API_KEY in .env.local.
export default function TrendingSection({ trendingByType }: Props) {
  const groups = (Object.keys(DISCOVER_GROUP_LABELS) as ReviewKind[])
    // The quiz uses the full fetched pool for genre matching — this browse
    // view only needs a representative slice, not all 30 per type.
    .map((type) => ({ type, label: DISCOVER_GROUP_LABELS[type], tiles: trendingByType[type].slice(0, 12) }))
    .filter((g) => g.tiles.length > 0);

  if (groups.length === 0) return null;

  return (
    <div className="mt-12 sm:mt-16">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">Trending &amp; New Releases</h2>
      <p className="text-xs sm:text-sm text-muted-foreground mb-6 sm:mb-8">
        What&apos;s hot in the wider world — nothing here has a FrameRate review yet.
      </p>
      {groups.map((group, gi) => (
        <div key={group.type} className="mb-8 sm:mb-10">
          <h3 className="text-base sm:text-lg font-bold mb-3">{group.label}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {group.tiles.map((tile, i) => (
              <Reveal key={tile.id} delay={((gi * group.tiles.length + i) % 6) * 60}>
                <DiscoverTile
                  title={tile.title}
                  type={tile.type}
                  imageUrl={tile.imageUrl}
                  releaseLabel={tile.releaseLabel}
                  genres={tile.genres}
                />
              </Reveal>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
