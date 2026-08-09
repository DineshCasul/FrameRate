import { createClient } from "@supabase/supabase-js";

// Service-role key: bypasses RLS, so this must only ever be imported from
// "use server" files (Server Actions / Route Handlers), never a client
// component. See Architecture & Roadmap.md — anon key is read-only once RLS
// lands, writes go through this instead.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);
