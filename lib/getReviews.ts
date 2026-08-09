import { supabase } from './supabase';
import { supabaseAdmin } from './supabaseAdmin';
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

// Admin-only: unfiltered (drafts included), so it goes through the
// service-role key rather than the anon one. Once RLS restricts the anon
// role to published rows, the admin dashboard/edit pages still need to see
// drafts — service role bypasses RLS by design, same as the write path in
// app/admin/actions.ts. Never call this from a public-facing page.
export async function getReviews(): Promise<Review[]> {
  const { data, error } = await supabaseAdmin
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

// Public-facing: anon key, filtered to published here in application code
// AND (once the RLS policy is applied) at the database layer — the .eq()
// below is defense in depth, not the only thing stopping a draft leak.
export async function getPublishedReviews(): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase fetch error:', error);
    throw new Error(`Failed to load reviews: ${error.message}`);
  }

  return (data ?? []).map(normalizeReview);
}