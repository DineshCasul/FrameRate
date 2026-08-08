"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center gap-4">
      <h1 className="text-2xl sm:text-3xl font-bold">Something went wrong</h1>
      <p className="text-muted-foreground text-sm sm:text-base max-w-md">
        We couldn&apos;t load that page. This is usually temporary — try again in a moment.
      </p>
      <div className="flex gap-4 mt-2">
        <button
          onClick={reset}
          className="border rounded px-4 py-2 hover:bg-muted transition-colors cursor-pointer"
        >
          Try again
        </button>
        <Link
          href="/"
          className="border rounded px-4 py-2 hover:bg-muted transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
