import { supabase } from './supabase';
import type { Review } from '@/types';

// Postgres/PostgREST returns column names verbatim (snake_case: background_url,
// recommended_for, aspect_ratings, ...) but Review is camelCase — `as Review[]`
// on the raw rows was a lie TypeScript couldn't check, so fields like
// backgroundUrl/trailerUrl/aspectRatings were silently undefined at runtime.
function toCamelCase(key: string): string {
  return key.replace(/_([a-z0-9])/g, (_, char) => char.toUpperCase());
}

function normalizeReview(row: Record<string, unknown>): Review {
  const normalized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(row)) {
    normalized[toCamelCase(key)] = value;
  }
  return normalized as unknown as Review;
}

export async function getReviews(): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false });

  // A genuinely empty table returns [] here, not an error — only a real
  // fetch/query failure should throw and hit the route's error boundary.
  if (error) {
    console.error('Supabase fetch error:', error);
    throw new Error(`Failed to load reviews: ${error.message}`);
  }

  return (data ?? []).map(normalizeReview);
}

export async function getPublishedReviews(): Promise<Review[]> {
  const reviews = await getReviews();
  return reviews.filter((review) => review.status === "published");
}