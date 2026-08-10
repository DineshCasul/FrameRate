import Image from "next/image";
import Link from "next/link";
import { TYPE_COLOR_CLASSES } from "@/lib/utils";
import type { ReviewKind } from "@/types";

type Props = {
  title: string;
  type: ReviewKind;
  imageUrl?: string;
  releaseLabel?: string;
};

// A tile for a title pulled from IGDB/TMDb that hasn't been reviewed here
// yet — visually related to Card (same type-color spine + swatch fallback)
// but distinct since there's no rating/slug/blurb to show, just a jumping
// off point into a pre-filled draft review.
export default function DiscoverTile({ title, type, imageUrl, releaseLabel }: Props) {
  const colors = TYPE_COLOR_CLASSES[type];

  return (
    <div
      style={{ borderLeftColor: colors.cssVar, borderLeftWidth: 3 }}
      className="border rounded overflow-hidden flex flex-col group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/10 dark:hover:shadow-black/40"
    >
      <div className="relative w-full aspect-[2/3] overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt=""
            fill
            sizes="(min-width: 1024px) 16vw, (min-width: 640px) 25vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${colors.cssVar} 0%, transparent 75%)`,
            }}
          />
        )}
      </div>
      <div className="p-2 sm:p-3 flex flex-col gap-1 flex-1">
        <div className={`text-[10px] font-semibold uppercase tracking-wider ${colors.text}`}>{type}</div>
        <div className="font-bold text-xs sm:text-sm line-clamp-2">{title}</div>
        {releaseLabel && <div className="text-[10px] sm:text-xs text-muted-foreground">{releaseLabel}</div>}
        <Link
          href={`/admin/reviews/new?title=${encodeURIComponent(title)}&type=${type}`}
          className="mt-auto pt-2 text-[10px] sm:text-xs underline hover:no-underline"
        >
          + Review this
        </Link>
      </div>
    </div>
  );
}
