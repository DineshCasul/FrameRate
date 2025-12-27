"use client"; // needed to use state and effects

import { useState } from "react";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Header from "./components/Header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDark, setIsDark] = useState(true);

  return (
    <html
      lang="en"
      className={!isDark ? "dark w-full min-h-screen" : "w-full min-h-screen"}
    >
      <body
        className={`font-mono min-h-screen flex flex-col bg-white text-black dark:bg-gray-100 dark:text-white`}
      >
        <Header isDark={isDark} toggleDark={() => setIsDark(!isDark)} />
        <div className="sm:mx-24 mx-4 my-6 border sm:p-6 p-2">{children}</div>
        <SpeedInsights />
      </body>
    </html>
  );
}
