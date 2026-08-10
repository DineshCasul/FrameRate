import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // TMDb poster art and IGDB cover art — both used by the Discover
      // page's trending/upcoming feeds, neither user-uploaded.
      { protocol: "https", hostname: "image.tmdb.org" },
      { protocol: "https", hostname: "images.igdb.com" },
    ],
  },
};

export default nextConfig;
