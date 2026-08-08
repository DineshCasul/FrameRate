"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

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
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm border rounded p-6 sm:p-8 flex flex-col gap-4"
      >
        <h1 className="text-xl sm:text-2xl font-bold">Admin Login</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoFocus
          className="border rounded px-3 py-2 bg-transparent"
        />
        {error && <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="border rounded px-3 py-2 hover:bg-muted transition disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Checking..." : "Log In"}
        </button>
      </form>
    </div>
  );
}
