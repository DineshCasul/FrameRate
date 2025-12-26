"use client"; // needed to use state and effects

import { useState, useEffect } from "react";
import "./globals.css";
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
        <div className="mx-24 my-6 border p-6">{children}</div>
      </body>
    </html>
  );
}
