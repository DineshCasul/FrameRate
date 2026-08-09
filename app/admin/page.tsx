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
        <div className="flex justify-between items-center mb-6 sm:mb-8 animate-in fade-in slide-in-from-top-2 duration-500 fill-mode-both">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Admin Panel</h1>
          <div className="flex items-center gap-4">
            <Link
              href="/admin/reviews/new"
              className="border rounded px-3 py-2 text-sm hover:bg-muted transition"
            >
              + New Review
            </Link>
            <LogoutButton />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div className="bg-muted p-4 sm:p-6 rounded animate-in fade-in slide-in-from-bottom-2 duration-500 delay-75 fill-mode-both">
            <h2 className="text-sm sm:text-lg font-semibold mb-2">Total Reviews</h2>
            <p className="text-3xl sm:text-4xl font-bold">{reviews.length}</p>
          </div>
          <div className="bg-green-100 dark:bg-green-900 p-4 sm:p-6 rounded animate-in fade-in slide-in-from-bottom-2 duration-500 delay-150 fill-mode-both">
            <h2 className="text-sm sm:text-lg font-semibold mb-2">Published</h2>
            <p className="text-3xl sm:text-4xl font-bold text-green-600 dark:text-green-400">
              {publishedCount}
            </p>
          </div>
          <div className="bg-yellow-100 dark:bg-yellow-900 p-4 sm:p-6 rounded animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200 fill-mode-both">
            <h2 className="text-sm sm:text-lg font-semibold mb-2">Drafts</h2>
            <p className="text-3xl sm:text-4xl font-bold text-yellow-600 dark:text-yellow-400">
              {draftCount}
            </p>
          </div>
        </div>

        <AdminReviewsList reviews={reviews} />
      </div>
    </div>
  );
}
