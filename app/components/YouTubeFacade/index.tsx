"use client";

import { useState } from "react";

interface YouTubeFacadeProps {
  videoId: string;
  title: string;
}

// Loads only a static thumbnail until clicked, instead of pulling in
// YouTube's iframe/JS on every review page view whether or not anyone
// watches the trailer.
export function YouTubeFacade({ videoId, title }: YouTubeFacadeProps) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <iframe
        className="w-full h-full rounded-md"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <button
      onClick={() => setPlaying(true)}
      className="relative w-full h-full rounded-md overflow-hidden group cursor-pointer"
      aria-label={`Play trailer: ${title}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- external YouTube thumbnail, not a local asset */}
      <img
        src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
        alt=""
        className="w-full h-full object-cover"
      />
      <span className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
        <span className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
          <span className="ml-1 border-y-8 border-y-transparent border-l-[14px] border-l-black" />
        </span>
      </span>
    </button>
  );
}
