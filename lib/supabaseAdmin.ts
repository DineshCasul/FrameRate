import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Lazily created on first actual call to getSupabaseAdmin(), not at
// module-import time. lib/getReviews.ts imports this module for its
// admin-only getReviews(), but getPublishedReviews() (the public path,
// used by every public page) doesn't need the service-role key at all —
// with an eager `createClient(...)` at module scope, simply IMPORTING this
// file required SUPABASE_SERVICE_ROLE_KEY to be set, so a deploy
// environment missing that var failed the build for every page, including
// fully public ones with no admin involvement.
let client: SupabaseClient | undefined;

// Service-role key: bypasses RLS, so this must only ever be called from
// "use server" files (Server Actions / Route Handlers), never a client
// component. See Architecture & Roadmap.md — anon key is read-only once RLS
// lands, writes go through this instead.
export function getSupabaseAdmin(): SupabaseClient {
  if (!client) {
    client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );
  }
  return client;
}
