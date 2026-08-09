// Shared by actions.ts (server) and Reactions.tsx (client) — a "use server"
// file may only export async functions, so the constant/type both need lives
// in a plain module instead.
export const REACTION_EMOJIS = ["🔥", "👍", "👎", "😂", "😮"] as const;
export type ReactionEmoji = (typeof REACTION_EMOJIS)[number];
export type ReactionCounts = Record<ReactionEmoji, number>;

export const REACTION_LABELS: Record<ReactionEmoji, string> = {
  "🔥": "Loved it",
  "👍": "Agree",
  "👎": "Disagree",
  "😂": "Funny",
  "😮": "Surprised",
};
