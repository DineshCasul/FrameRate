// TMDb integration for the Discover page's trending movies/series feed.
// Free for non-commercial use — v3 API key passed as a query param, no
// OAuth. Responses are cached in-memory since these lists only need to be
// roughly fresh, not real-time, and it keeps us well clear of rate limits.

export type TmdbItem = {
  id: number;
  title: string;
  posterUrl?: string;
  releaseDate?: string;
  genres: string[];
};

type RawTmdbMovie = {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  genre_ids: number[];
};
type RawTmdbShow = {
  id: number;
  name: string;
  poster_path: string | null;
  first_air_date: string;
  genre_ids: number[];
};
type RawGenre = { id: number; name: string };

const TTL_MS = 6 * 60 * 60 * 1000; // 6h, matches the IGDB cache window
const GENRE_LIST_TTL_MS = 24 * 60 * 60 * 1000; // genre taxonomies barely ever change

async function fetchTmdb<T>(path: string): Promise<T | null> {
  const key = process.env.TMDB_API_KEY;
  if (!key) return null;

  const url = `https://api.themoviedb.org/3${path}${path.includes("?") ? "&" : "?"}api_key=${key}`;
  const res = await fetch(url);
  if (!res.ok) return null;

  return (await res.json()) as T;
}

let movieGenreCache: { data: Map<number, string>; expiresAt: number } | undefined;
let tvGenreCache: { data: Map<number, string>; expiresAt: number } | undefined;

async function getGenreMap(kind: "movie" | "tv"): Promise<Map<number, string>> {
  const cache = kind === "movie" ? movieGenreCache : tvGenreCache;
  if (cache && cache.expiresAt > Date.now()) return cache.data;

  const data = await fetchTmdb<{ genres: RawGenre[] }>(`/genre/${kind}/list`);
  const map = new Map((data?.genres ?? []).map((g) => [g.id, g.name]));

  const entry = { data: map, expiresAt: Date.now() + GENRE_LIST_TTL_MS };
  if (kind === "movie") movieGenreCache = entry;
  else tvGenreCache = entry;
  return map;
}

let moviesCache: { data: TmdbItem[]; expiresAt: number } | undefined;

export async function getUpcomingMovies(limit = 30): Promise<TmdbItem[]> {
  if (moviesCache && moviesCache.expiresAt > Date.now()) return moviesCache.data;

  const [data, genreMap] = await Promise.all([
    fetchTmdb<{ results: RawTmdbMovie[] }>("/movie/upcoming"),
    getGenreMap("movie"),
  ]);
  if (!data) return [];

  const movies: TmdbItem[] = data.results.slice(0, limit).map((m) => ({
    id: m.id,
    title: m.title,
    posterUrl: m.poster_path ? `https://image.tmdb.org/t/p/w342${m.poster_path}` : undefined,
    releaseDate: m.release_date,
    genres: m.genre_ids.map((id) => genreMap.get(id)).filter((g): g is string => Boolean(g)),
  }));

  moviesCache = { data: movies, expiresAt: Date.now() + TTL_MS };
  return movies;
}

let seriesCache: { data: TmdbItem[]; expiresAt: number } | undefined;

// TMDb doesn't have an "upcoming" endpoint for TV the way it does for movies
// (seasons/episodes stagger too unpredictably) — trending-this-week is the
// closest "what's hot right now" signal for series.
export async function getTrendingSeries(limit = 30): Promise<TmdbItem[]> {
  if (seriesCache && seriesCache.expiresAt > Date.now()) return seriesCache.data;

  const [data, genreMap] = await Promise.all([
    fetchTmdb<{ results: RawTmdbShow[] }>("/trending/tv/week"),
    getGenreMap("tv"),
  ]);
  if (!data) return [];

  const series: TmdbItem[] = data.results.slice(0, limit).map((s) => ({
    id: s.id,
    title: s.name,
    posterUrl: s.poster_path ? `https://image.tmdb.org/t/p/w342${s.poster_path}` : undefined,
    releaseDate: s.first_air_date,
    genres: s.genre_ids.map((id) => genreMap.get(id)).filter((g): g is string => Boolean(g)),
  }));

  seriesCache = { data: series, expiresAt: Date.now() + TTL_MS };
  return series;
}
