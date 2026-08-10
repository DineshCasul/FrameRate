"use client";

import type { CSSProperties } from "react";
import { ReviewKind } from "@/types";
import { cn, TYPE_COLOR_CLASSES } from "@/lib/utils";
import { useHoverGlow } from "@/app/HoverGlowContext";

type Props = {
  // Resolved blurb line — callers pass cardBlurb(review), not raw content,
  // so Card doesn't need to know about the verdict/summary/content fallback.
  blurb: string;
  rating: number;
  title: string;
  className?: string;
  style?: CSSProperties;
  type: ReviewKind;
  backgroundUrl?: string;
  recommendationBadge?: string;
};

const Card = ({
  title,
  rating,
  blurb,
  type,
  backgroundUrl,
  recommendationBadge,
  className,
  style,
}: Props) => {
  const colors = TYPE_COLOR_CLASSES[type];
  const { setHoverType } = useHoverGlow();

  return (
    <div
      style={{ borderLeftColor: colors.cssVar, borderLeftWidth: 3, ...style }}
      onMouseEnter={() => setHoverType(type)}
      onMouseLeave={() => setHoverType(null)}
      className={cn(
        `border h-32 sm:h-36 cursor-pointer relative overflow-hidden group flex ${colors.hoverBg} transition-all ease-in-out duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/10 dark:hover:shadow-black/40 w-full`,
        className,
      )}
    >
      {/* Image (or a color swatch keyed to the type when there isn't one) —
          a fixed-width strip rather than a full-bleed backdrop, since the
          card is a wide horizontal bar now, not a poster. */}
      <div className="relative w-24 sm:w-36 shrink-0 overflow-hidden">
        {backgroundUrl ? (
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
            style={{ backgroundImage: `url(${backgroundUrl})` }}
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${colors.cssVar} 0%, transparent 75%)`,
            }}
          />
        )}
        {/* Fades the strip into the content panel's background so there's no
            hard seam between image/swatch and text, image or not. */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to right, transparent 35%, var(--background) 100%)" }}
        />
      </div>

      <div className="relative z-10 flex-1 min-w-0 p-3 sm:p-4 flex items-start gap-2">
        <div className="flex-1 min-w-0 flex flex-col justify-start items-start text-left gap-1">
          <div className={`text-[10px] sm:text-xs font-semibold uppercase tracking-wider ${colors.text}`}>
            {type}
          </div>
          <div className="font-bold text-base sm:text-lg line-clamp-1 w-full -mt-0.5">{title}</div>
          <div className={`text-sm sm:text-base font-bold ${colors.text}`}>{rating}/10</div>
          <div className="text-xs sm:text-sm line-clamp-2 text-muted-foreground w-full">{blurb}</div>
        </div>
        {recommendationBadge && (
          <span
            className={`shrink-0 whitespace-nowrap text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full border border-current ${colors.text}`}
          >
            {recommendationBadge}
          </span>
        )}
      </div>
    </div>
  );
};

export default Card;
