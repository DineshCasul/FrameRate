"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Card from "./components/Card";
import Logo from "./components/Logo";
import { TYPE_QUICK_LINKS } from "@/lib/utils";
import type { Review } from "@/types";

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%&*";

// Reveals `text` left-to-right over `durationMs`, filling the not-yet-real
// portion with random characters each frame — a decode/slot-machine effect.
// Spaces pass through untouched so word shapes stay readable mid-scramble.
function useScrambleText(text: string, start: boolean, durationMs: number): string {
  const [display, setDisplay] = useState(() => (start ? text : ""));

  useEffect(() => {
    if (!start) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(text);
      return;
    }
    const frameMs = 35;
    const totalFrames = Math.ceil(durationMs / frameMs);
    let frame = 0;

    const interval = setInterval(() => {
      frame++;
      const revealCount = Math.floor((frame / totalFrames) * text.length);
      let out = "";
      for (let i = 0; i < text.length; i++) {
        if (text[i] === " " || text[i] === "\n" || i < revealCount) {
          out += text[i];
        } else {
          out += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        }
      }
      setDisplay(out);
      if (frame >= totalFrames) {
        setDisplay(text);
        clearInterval(interval);
      }
    }, frameMs);

    return () => clearInterval(interval);
  }, [start, text, durationMs]);

  return display;
}

type Props = {
  tagline: string;
  featuredReviews: Review[];
};

type Phase = "idle" | "textOpen" | "textHold" | "textClose" | "morph" | "done";

const INTRO_SEEN_KEY = "framerate_intro_seen";

function hasSeenIntro(): boolean {
  try {
    return sessionStorage.getItem(INTRO_SEEN_KEY) === "true";
  } catch {
    // Storage can throw in some privacy modes — fail open (play the intro)
    // rather than crash the homepage over a decorative animation.
    return false;
  }
}

function markIntroSeen(): void {
  try {
    sessionStorage.setItem(INTRO_SEEN_KEY, "true");
  } catch {
    // Ignore — worst case the intro replays next time, not a real problem.
  }
}

// Logo reveal, in acts:
//  1. "FrameRate" text curtain-opens — clip-path reveals it symmetrically
//     from the center outward (not a slide), starting almost immediately.
//  2. Holds, then curtain-closes the same way in reverse.
//  3. The icon (boxed, in its own bordered frame) fades/draws in at that
//     same centered spot once the text has fully closed.
// Plays once per browser session (sessionStorage — clears when the tab/
// session ends, "times out"): later homepage visits in the same session
// skip straight to just the icon.
export default function HomeHero({ tagline, featuredReviews }: Props) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [revealed, setRevealed] = useState(false);
  const scrambledTagline = useScrambleText(tagline, revealed, 500);

  useEffect(() => {
    // Initial state is always "idle" on both server and client (nothing
    // here runs during SSR, so no hydration mismatch) — this effect is the
    // only place that decides to skip ahead, via the same "collapse every
    // delay to 0" trick as reduced motion, not a separate render path.
    const skip = hasSeenIntro() || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const at = (ms: number) => (skip ? 0 : ms);

    const timers = [
      setTimeout(() => setPhase("textOpen"), at(300)),
      setTimeout(() => setPhase("textHold"), at(800)),
      setTimeout(() => setPhase("textClose"), at(1500)),
      setTimeout(() => setPhase("morph"), at(2000)),
      setTimeout(() => {
        setPhase("done");
        setRevealed(true);
        markIntroSeen();
      }, at(2900)),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const iconVisible = phase === "morph" || phase === "done";
  const textVisible = phase === "textOpen" || phase === "textHold";

  return (
    <div className="min-h-full flex flex-col items-center justify-center px-4 py-8 sm:px-6 sm:py-12">
      <div className="text-center max-w-3xl">
        <div className="relative flex items-center justify-center h-20 sm:h-24 mb-2">
          {/* Icon fades/draws in exactly where the text was centered — a
              replacement at the same point, not a separate element
              arriving from elsewhere. */}
          <div
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-foreground rounded-sm p-1.5 sm:p-2 transition-opacity duration-300 ${
              iconVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <Logo animate revealed={iconVisible} size={48} className="w-10 h-auto sm:w-12" />
          </div>
          {/* Centered at the same point as the icon box. clip-path reveals
              it symmetrically from that center outward, like curtains
              parting, and closes the same way in reverse rather than
              sliding off-screen. No aria-hidden — clip-path keeps it out
              of view without removing it from the accessibility tree, so
              "FrameRate" stays announced by screen readers even once
              icon-only. */}
          <span
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-bold tracking-tight text-2xl sm:text-3xl whitespace-nowrap transition-[clip-path] duration-500 ease-out"
            style={{ clipPath: textVisible ? "inset(0 0% 0 0%)" : "inset(0 50% 0 50%)" }}
          >
            FrameRate
          </span>
        </div>

        <p className="mb-6 mt-4 whitespace-pre-line text-sm sm:text-base min-h-[1.5em]">
          {revealed ? scrambledTagline : " "}
        </p>

        <div
          className={`flex justify-center gap-4 mb-8 text-sm sm:text-base transition-opacity duration-500 delay-300 ${
            revealed ? "opacity-100" : "opacity-0"
          }`}
        >
          {TYPE_QUICK_LINKS.map((link, i) => (
            <span key={link.href} className="flex items-center gap-4">
              {i > 0 && (
                <span className="text-border" aria-hidden="true">
                  |
                </span>
              )}
              <Link href={link.href} className="hover:underline">
                {link.label}
              </Link>
            </span>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 justify-items-center">
          {featuredReviews.map((review, i) => (
            <Link
              href={`/reviews/${review.slug || review.id}`}
              key={review.id}
              className={
                revealed
                  ? `block w-full ${i % 2 === 0 ? "animate-deal-in-left" : "animate-deal-in-right"}`
                  : "block w-full opacity-0"
              }
              style={revealed ? { animationDelay: `${600 + i * 100}ms` } : undefined}
            >
              <Card
                rating={review.rating}
                description={review.content}
                title={review.title}
                type={review.type}
                backgroundUrl={review.backgroundUrl}
              />
            </Link>
          ))}
        </div>
        <div
          className={`mt-12 transition-opacity duration-500 ${revealed ? "opacity-100" : "opacity-0"}`}
          style={revealed ? { transitionDelay: `${600 + featuredReviews.length * 100 + 200}ms` } : undefined}
        >
          <Link className="hover:underline" href="/reviews">
            -View All-
          </Link>
        </div>
      </div>
    </div>
  );
}
