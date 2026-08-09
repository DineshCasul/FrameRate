"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { ReviewKind } from "@/types";

type HoverGlowValue = {
  // Card hover — temporary, wins over the base tint while active.
  setHoverType: (type: ReviewKind | null) => void;
  // Page-level persistent tint (e.g. the review detail page's own type) —
  // shows whenever nothing is being hovered.
  setBaseType: (type: ReviewKind | null) => void;
};

const noop = () => {};
const HoverGlowContext = createContext<HoverGlowValue>({ setHoverType: noop, setBaseType: noop });

export function useHoverGlow(): HoverGlowValue {
  return useContext(HoverGlowContext);
}

export function HoverGlowProvider({ children }: { children: ReactNode }) {
  const [hoverType, setHoverType] = useState<ReviewKind | null>(null);
  const [baseType, setBaseType] = useState<ReviewKind | null>(null);
  const activeType = hoverType ?? baseType;

  const value = useMemo(() => ({ setHoverType, setBaseType }), []);

  return (
    <HoverGlowContext.Provider value={value}>
      {/* Ambient background glow tinted by whatever review type is active
          (hover always wins, falls back to a page's own persistent base
          type) — soft radial mask so it reads as atmosphere, not a color
          block, and a plain background-color (not a gradient) so it
          cross-fades smoothly between different types via CSS transition. */}
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 pointer-events-none transition-[opacity,background-color] duration-700 ease-out"
        style={{
          opacity: activeType ? 0.12 : 0,
          backgroundColor: activeType ? `var(--type-${activeType})` : "transparent",
          maskImage: "radial-gradient(ellipse 70% 55% at 50% 25%, black 0%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 55% at 50% 25%, black 0%, transparent 75%)",
        }}
      />
      {children}
    </HoverGlowContext.Provider>
  );
}
