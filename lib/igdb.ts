// IGDB (Twitch) integration for the Discover page's "anticipated games" feed.
// Auth is the client_credentials flow — a server-only app access token, not
// a per-user OAuth redirect — cached in-memory and refreshed once expired.
// Queries use Apicalypse (a text query language sent as a POST body), not
// query-string params.

export type IgdbGame = {
  id: number;
  name: string;
  slug: string;
  coverUrl?: string;
  firstReleaseDate?: number; // unix seconds
  hypes?: number;
};

type IgdbToken = { token: string; expiresAt: number };
let cachedToken: IgdbToken | undefined;

async function getIgdbToken(): Promise<string | null> {
  const clientId = process.env.IGDB_CLIENT_ID;
  const clientSecret = process.env.IGDB_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;

  if (cachedToken && cachedToken.expiresAt > Date.now()) return cachedToken.token;

  const res = await fetch(
    `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
    { method: "POST" },
  );
  if (!res.ok) return null;

  const data = (await res.json()) as { access_token: string; expires_in: number };
  // Refresh a minute early rather than risking a request landing right on expiry.
  cachedToken = { token: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 - 60_000 };
  return cachedToken.token;
}

type RawIgdbGame = {
  id: number;
  name: string;
  slug: string;
  cover?: { url: string };
  first_release_date?: number;
  hypes?: number;
};

const GAMES_TTL_MS = 6 * 60 * 60 * 1000; // 6h — plenty fresh for a "what's hot" feed, keeps us well under the 4 req/s limit
let gamesCache: { data: IgdbGame[]; expiresAt: number } | undefined;

// Most-anticipated unreleased games, sorted by community "hype" — IGDB's
// own signal for upcoming titles people are excited about.
export async function getAnticipatedGames(limit = 12): Promise<IgdbGame[]> {
  if (gamesCache && gamesCache.expiresAt > Date.now()) return gamesCache.data;

  const clientId = process.env.IGDB_CLIENT_ID;
  const token = await getIgdbToken();
  if (!clientId || !token) return [];

  const now = Math.floor(Date.now() / 1000);
  const body = `fields name,slug,cover.url,first_release_date,hypes;
    where first_release_date > ${now} & hypes != null;
    sort hypes desc;
    limit ${limit};`;

  const res = await fetch("https://api.igdb.com/v4/games", {
    method: "POST",
    headers: {
      "Client-ID": clientId,
      Authorization: `Bearer ${token}`,
      "Content-Type": "text/plain",
    },
    body,
  });
  if (!res.ok) return [];

  const rows = (await res.json()) as RawIgdbGame[];
  const games: IgdbGame[] = rows.map((g) => ({
    id: g.id,
    name: g.name,
    slug: g.slug,
    // IGDB cover URLs come back protocol-relative and thumbnail-sized by default.
    coverUrl: g.cover?.url ? `https:${g.cover.url.replace("t_thumb", "t_cover_big")}` : undefined,
    firstReleaseDate: g.first_release_date,
    hypes: g.hypes,
  }));

  gamesCache = { data: games, expiresAt: Date.now() + GAMES_TTL_MS };
  return games;
}
