import HomeHero from "./HomeHero";
import { homepageData } from "./dummyData";
import { getPublishedReviews } from "@/lib/getReviews";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "FrameRate | Reviews of Games, Movies & Series",
  description:
    "Discover FrameRate: Your source for honest, detailed reviews of games, movies, and TV series. Rate and explore content across all platforms.",
  keywords: "reviews, games, movies, series, ratings, entertainment",
};

export default async function Home() {
  const reviews = await getPublishedReviews();

  // Curated mix instead of "just the 6 most recent" — top-rated first
  // impression, filled out with the latest so the page still feels current.
  const topRated = [...reviews].sort((a, b) => b.rating - a.rating).slice(0, 3);
  const topRatedIds = new Set(topRated.map((r) => r.id));
  const latest = reviews.filter((r) => !topRatedIds.has(r.id)).slice(0, 3);
  const featuredReviews = [...topRated, ...latest];

  return <HomeHero tagline={homepageData.description.trim()} featuredReviews={featuredReviews} />;
}
