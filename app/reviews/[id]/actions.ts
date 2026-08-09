"use server";

import { supabase } from "@/lib/supabase";
import { REACTION_EMOJIS, type ReactionEmoji, type ReactionCounts } from "./reactionTypes";

function emptyCounts(): ReactionCounts {
  return { "🔥": 0, "👍": 0, "👎": 0, "😂": 0, "😮": 0 };
}

export async function getReactionCounts(reviewId: string): Promise<ReactionCounts> {
  const { data } = await supabase
    .from("review_reactions")
    .select("emoji")
    .eq("review_id", reviewId);

  const counts = emptyCounts();
  for (const row of data ?? []) {
    if ((REACTION_EMOJIS as readonly string[]).includes(row.emoji)) {
      counts[row.emoji as ReactionEmoji]++;
    }
  }
  return counts;
}

// Public, anonymous write — uses the anon client on purpose, governed by
// review_reactions' RLS policies, not the service-role key admin writes use.
// `emoji: null` removes the caller's reaction (click-to-toggle-off).
export async function setReaction(
  reviewId: string,
  voterId: string,
  emoji: ReactionEmoji | null,
): Promise<ReactionCounts> {
  if (emoji === null) {
    await supabase
      .from("review_reactions")
      .delete()
      .eq("review_id", reviewId)
      .eq("voter_id", voterId);
  } else {
    await supabase
      .from("review_reactions")
      .upsert(
        { review_id: reviewId, voter_id: voterId, emoji },
        { onConflict: "review_id,voter_id" },
      );
  }

  return getReactionCounts(reviewId);
}
