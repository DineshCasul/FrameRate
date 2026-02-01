"use client";

import { useState, useEffect, ReactNode } from "react";
import Header from "./components/Header";

export default function RootLayoutClient({
  children,
}: {
  children: ReactNode;
}) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load saved preference from localStorage
    const saved = localStorage.getItem("dark-mode");
    const prefersDark =
      saved !== null
        ? saved === "true"
        : window.matchMedia("(prefers-color-scheme: dark)").matches;

    setIsDark(prefersDark);
    if (prefersDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    setMounted(true);
  }, []);

  const toggleDark = () => {
    const newVal = !isDark;
    setIsDark(newVal);
    localStorage.setItem("dark-mode", String(newVal));
    document.documentElement.classList.toggle("dark", newVal);
  };

  if (!mounted) return <>{children}</>;

  return (
    <>
      <Header toggleDark={toggleDark} />
      <div className=" sm:mx-24 mx-4 border sm:p-6 p-2 sm:my-6">{children}</div>
    </>
  );
}
