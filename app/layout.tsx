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

// Runs before hydration so the dark class is applied before first paint,
// avoiding a light-mode flash for users with a dark preference.
const themeInitScript = `(function() {
  try {
    var stored = localStorage.getItem('dark-mode');
    var prefersDark = stored !== null ? stored === 'true' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) document.documentElement.classList.add('dark');
  } catch (e) {}
})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning: themeInitScript below intentionally mutates
    // this element's class before hydration (dark-mode-before-first-paint),
    // so server and client legitimately disagree on className here.
    <html lang="en" suppressHydrationWarning>
      <body className="font-mono min-h-screen flex flex-col bg-background text-foreground transition-colors">
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded focus:bg-background focus:border focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Skip to content
        </a>
        <RootLayoutClient>{children}</RootLayoutClient>
        <SpeedInsights />
      </body>
    </html>
  );
}
