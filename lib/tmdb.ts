// TMDb integration for the Discover page's trending movies/series feed.
// Free for non-commercial use — v3 API key passed as a query param, no
// OAuth. Responses are cached in-memory since these lists only need to be
// roughly fresh, not real-time, and it keeps us well clear of rate limits.

export type TmdbItem = {
  id: number;
  title: string;
  posterUrl?: string;
  releaseDate?: string;
};

type RawTmdbMovie = { id: number; title: string; poster_path: string | null; release_date: string };
type RawTmdbShow = { id: number; name: string; poster_path: string | null; first_air_date: string };

const TTL_MS = 6 * 60 * 60 * 1000; // 6h, matches the IGDB cache window

async function fetchTmdb<T>(path: string): Promise<T[] | null> {
  const key = process.env.TMDB_API_KEY;
  if (!key) return null;

  const url = `https://api.themoviedb.org/3${path}${path.includes("?") ? "&" : "?"}api_key=${key}`;
  const res = await fetch(url);
  if (!res.ok) return null;

  const data = (await res.json()) as { results: T[] };
  return data.results;
}

let moviesCache: { data: TmdbItem[]; expiresAt: number } | undefined;

export async function getUpcomingMovies(limit = 12): Promise<TmdbItem[]> {
  if (moviesCache && moviesCache.expiresAt > Date.now()) return moviesCache.data;

  const results = await fetchTmdb<RawTmdbMovie>("/movie/upcoming");
  if (!results) return [];

  const movies: TmdbItem[] = results.slice(0, limit).map((m) => ({
    id: m.id,
    title: m.title,
    posterUrl: m.poster_path ? `https://image.tmdb.org/t/p/w342${m.poster_path}` : undefined,
    releaseDate: m.release_date,
  }));

  moviesCache = { data: movies, expiresAt: Date.now() + TTL_MS };
  return movies;
}

let seriesCache: { data: TmdbItem[]; expiresAt: number } | undefined;

// TMDb doesn't have an "upcoming" endpoint for TV the way it does for movies
// (seasons/episodes stagger too unpredictably) — trending-this-week is the
// closest "what's hot right now" signal for series.
export async function getTrendingSeries(limit = 12): Promise<TmdbItem[]> {
  if (seriesCache && seriesCache.expiresAt > Date.now()) return seriesCache.data;

  const results = await fetchTmdb<RawTmdbShow>("/trending/tv/week");
  if (!results) return [];

  const series: TmdbItem[] = results.slice(0, limit).map((s) => ({
    id: s.id,
    title: s.name,
    posterUrl: s.poster_path ? `https://image.tmdb.org/t/p/w342${s.poster_path}` : undefined,
    releaseDate: s.first_air_date,
  }));

  seriesCache = { data: series, expiresAt: Date.now() + TTL_MS };
  return series;
}
