"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/admin-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setLoading(false);

    if (!res.ok) {
      setError("Incorrect password.");
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="h-full flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-sm">
        <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 relative mb-4">
          <Image
            src="/images/FrameRate.png"
            alt="FrameRate"
            width={80}
            height={80}
            className="mx-auto object-contain dark:hidden"
          />
          <Image
            src="/images/FrameRate-white.png"
            alt="FrameRate"
            width={80}
            height={80}
            className="mx-auto object-contain hidden dark:block"
          />
        </div>

        <form
          onSubmit={handleSubmit}
          className="border rounded p-6 sm:p-8 flex flex-col gap-4"
        >
          <div className="text-center mb-2">
            <h1 className="text-xl sm:text-2xl font-bold">Admin Access</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Sign in to manage FrameRate reviews.
            </p>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoFocus
              className="w-full border rounded px-3 py-2 bg-transparent"
            />
          </div>

          {error && <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="border rounded px-3 py-2 hover:bg-muted transition disabled:opacity-50 cursor-pointer font-semibold"
          >
            {loading ? "Checking..." : "Log In"}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-muted-foreground hover:underline">
            &larr; Back to FrameRate
          </Link>
        </div>
      </div>
    </div>
  );
}
