import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center gap-4">
      <h1 className="text-3xl sm:text-4xl font-bold">404</h1>
      <p className="text-muted-foreground text-sm sm:text-base max-w-md">
        Nothing here — the page you&apos;re looking for doesn&apos;t exist or was moved.
      </p>
      <div className="flex gap-4 mt-2">
        <Link
          href="/"
          className="border rounded px-4 py-2 hover:bg-muted transition-colors"
        >
          Go home
        </Link>
        <Link
          href="/reviews"
          className="border rounded px-4 py-2 hover:bg-muted transition-colors"
        >
          Browse reviews
        </Link>
      </div>
    </div>
  );
}
