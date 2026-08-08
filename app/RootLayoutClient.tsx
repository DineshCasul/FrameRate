"use client";

import { useState, ReactNode } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function RootLayoutClient({
  children,
}: {
  children: ReactNode;
}) {
  // The inline script in layout.tsx already applies the "dark" class before
  // hydration, so read it back instead of recomputing (and re-triggering) it here.
  const [isDark, setIsDark] = useState(
    () =>
      typeof document !== "undefined" &&
      document.documentElement.classList.contains("dark"),
  );

  const toggleDark = () => {
    const newVal = !isDark;
    setIsDark(newVal);
    localStorage.setItem("dark-mode", String(newVal));
    document.documentElement.classList.toggle("dark", newVal);
  };

  return (
    <>
      <Header />
      <main id="main-content" className="flex-1 w-full">
        {children}
      </main>
      <Footer toggleDark={toggleDark} isDark={isDark} />
    </>
  );
}
