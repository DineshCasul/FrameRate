"use client";

import type { CSSProperties } from "react";
import { ReviewKind } from "@/types";
import { cn, parseContent, TYPE_COLOR_CLASSES } from "@/lib/utils";
import { useHoverGlow } from "@/app/HoverGlowContext";
import Tag from "../Tag";

type Props = {
  description: string[] | string;
  rating: number;
  title: string;
  className?: string;
  style?: CSSProperties;
  type: ReviewKind;
  backgroundUrl?: string;
};

const Card = ({ title, rating, description, type, backgroundUrl, className, style }: Props) => {
  const colors = TYPE_COLOR_CLASSES[type];
  const { setHoverType } = useHoverGlow();

  return (
    <div
      style={style}
      onMouseEnter={() => setHoverType(type)}
      onMouseLeave={() => setHoverType(null)}
      className={cn(
        `border h-40 sm:h-48 cursor-pointer relative overflow-hidden group ${colors.hoverBg} transition-all ease-in-out duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/10 dark:hover:shadow-black/40 p-3 sm:p-4 w-full`,
        className,
      )}
    >
      {backgroundUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110 opacity-40"
          style={{
            backgroundImage: `url(${backgroundUrl})`,
          }}
        ></div>
      )}
      <div className="relative z-10">
        <Tag type={type} />
        <div className="font-bold text-base sm:text-lg line-clamp-1">{title}</div>
        <div className={`text-xl sm:text-2xl font-bold ${colors.text}`}>
          {rating}/10
        </div>
        <div className="my-3 sm:my-4 text-xs sm:text-sm line-clamp-3">
          {parseContent(description).join(" ")}
        </div>
      </div>
    </div>
  );
};

export default Card;
