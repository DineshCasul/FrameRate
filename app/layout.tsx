import "./globals.css";
import type { Metadata } from "next";
import RootLayoutClient from "./RootLayoutClient";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "FrameRate | Reviews of Games, Movies & Series",
  description:
    "Discover FrameRate: Your source for honest, detailed reviews of games, movies, and TV series. Rate and explore content across all platforms.",
  keywords: "reviews, games, movies, series, ratings, entertainment",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-mono min-h-screen flex flex-col bg-white text-black dark:bg-black dark:text-white transition-colors">
        <RootLayoutClient>{children}</RootLayoutClient>
        <SpeedInsights />
      </body>
    </html>
  );
}
