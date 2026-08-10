import type { Metadata } from "next";
import Link from "next/link";
import { getReviews } from "@/lib/getReviews";
import LogoutButton from "./LogoutButton";
import AdminReviewsList from "./AdminReviewsList";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Panel | FrameRate",
  description: "Manage and create reviews on FrameRate.",
};

export default async function AdminPage() {
  const reviews = await getReviews();
  const publishedCount = reviews.filter((r) => r.status === "published").length;
  const draftCount = reviews.filter((r) => r.status === "draft").length;

  return (
    <div className="min-h-screen px-4 sm:px-6 py-6 sm:py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6 sm:mb-8 animate-in fade-in slide-in-from-top-2 duration-500 fill-mode-both">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Admin Panel</h1>
          <div className="flex items-center justify-between sm:justify-end gap-4">
            <Link
              href="/admin/reviews/new"
              className="border rounded px-3 py-2 text-sm font-semibold hover:bg-muted hover:scale-105 transition whitespace-nowrap"
            >
              + New Review
            </Link>
            <LogoutButton />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div className="border bg-muted/40 rounded p-4 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/10 dark:hover:shadow-black/40 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-75 fill-mode-both">
            <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Total Reviews
            </h2>
            <p className="text-3xl sm:text-4xl font-bold">{reviews.length}</p>
          </div>
          <div
            style={{ borderLeftColor: "var(--status-good)", borderLeftWidth: 4 }}
            className="border bg-muted/40 rounded p-4 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/10 dark:hover:shadow-black/40 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-150 fill-mode-both"
          >
            <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Published
            </h2>
            <p className="text-3xl sm:text-4xl font-bold text-status-good">{publishedCount}</p>
          </div>
          <div
            style={{ borderLeftColor: "var(--status-warn)", borderLeftWidth: 4 }}
            className="border bg-muted/40 rounded p-4 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/10 dark:hover:shadow-black/40 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200 fill-mode-both"
          >
            <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Drafts
            </h2>
            <p className="text-3xl sm:text-4xl font-bold text-status-warn">{draftCount}</p>
          </div>
        </div>

        <AdminReviewsList reviews={reviews} />
      </div>
    </div>
  );
}
