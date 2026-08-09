"use client";

import { useEffect, useState, useTransition } from "react";
import { setReaction } from "./actions";
import {
  REACTION_EMOJIS,
  REACTION_LABELS,
  type ReactionCounts,
  type ReactionEmoji,
} from "./reactionTypes";

const VOTER_ID_KEY = "framerate_voter_id";

function getVoterId(): string {
  let id = localStorage.getItem(VOTER_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VOTER_ID_KEY, id);
  }
  return id;
}

type Props = {
  reviewId: string;
  initialCounts: ReactionCounts;
};

export default function Reactions({ reviewId, initialCounts }: Props) {
  const [counts, setCounts] = useState(initialCounts);
  // No login, so "my reaction" is just what this browser remembers picking
  // last — the DB is the source of truth for counts, not for who voted what.
  // Starts null on both server and client (no hydration mismatch); a
  // lazy-initializer reading localStorage directly was tried first, but
  // that's genuinely wrong, not just extra work — a returning visitor's
  // stored reaction would differ from the server's (always-null) render,
  // a real mismatch rather than an intentional one. Read after mount.
  const [myReaction, setMyReaction] = useState<ReactionEmoji | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    // setState wrapped in a timeout, not called directly in the effect body
    // — same pattern used throughout this session (see HomeHero.tsx etc.).
    const timer = setTimeout(() => {
      const stored = localStorage.getItem(`framerate_reaction_${reviewId}`);
      if (stored && (REACTION_EMOJIS as readonly string[]).includes(stored)) {
        setMyReaction(stored as ReactionEmoji);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [reviewId]);

  function handleClick(emoji: ReactionEmoji) {
    const next = myReaction === emoji ? null : emoji;
    const voterId = getVoterId();
    const previous = myReaction;

    // Optimistic update — feels instant, corrected by the server response
    // (or rolled back on failure) a moment later.
    setCounts((prev) => {
      const updated = { ...prev };
      if (previous) updated[previous] = Math.max(0, updated[previous] - 1);
      if (next) updated[next] = (updated[next] ?? 0) + 1;
      return updated;
    });
    setMyReaction(next);
    if (next) {
      localStorage.setItem(`framerate_reaction_${reviewId}`, next);
    } else {
      localStorage.removeItem(`framerate_reaction_${reviewId}`);
    }

    startTransition(async () => {
      try {
        const serverCounts = await setReaction(reviewId, voterId, next);
        setCounts(serverCounts);
      } catch {
        // Roll back to what we had before the optimistic change.
        setCounts((prev) => {
          const rolledBack = { ...prev };
          if (next) rolledBack[next] = Math.max(0, rolledBack[next] - 1);
          if (previous) rolledBack[previous] = (rolledBack[previous] ?? 0) + 1;
          return rolledBack;
        });
        setMyReaction(previous);
      }
    });
  }

  return (
    <div
      className="flex flex-wrap gap-2 justify-center mb-6 animate-in fade-in duration-500 fill-mode-both"
      role="group"
      aria-label="React to this review"
    >
      {REACTION_EMOJIS.map((emoji, i) => {
        const selected = myReaction === emoji;
        return (
          <button
            key={emoji}
            type="button"
            onClick={() => handleClick(emoji)}
            disabled={isPending}
            aria-pressed={selected}
            aria-label={REACTION_LABELS[emoji]}
            title={REACTION_LABELS[emoji]}
            style={{ animationDelay: `${i * 50}ms` }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm transition-all duration-200 disabled:opacity-60 cursor-pointer animate-in fade-in zoom-in-95 fill-mode-both hover:scale-110 ${
              selected
                ? "bg-primary text-primary-foreground border-primary scale-110"
                : "hover:bg-muted"
            }`}
          >
            <span className="text-base leading-none">{emoji}</span>
            <span className="tabular-nums">{counts[emoji] ?? 0}</span>
          </button>
        );
      })}
    </div>
  );
}
