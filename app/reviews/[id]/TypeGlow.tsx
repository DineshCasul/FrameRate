"use client";

import { useEffect } from "react";
import { useHoverGlow } from "@/app/HoverGlowContext";
import type { ReviewKind } from "@/types";

// Renders nothing — just sets this review's type as the page's persistent
// background tint for as long as you're on it (hovering a related-review
// Card still temporarily overrides it, falling back here on mouse-leave).
export default function TypeGlow({ type }: { type: ReviewKind }) {
  const { setBaseType } = useHoverGlow();

  useEffect(() => {
    setBaseType(type);
    return () => setBaseType(null);
  }, [type, setBaseType]);

  return null;
}
