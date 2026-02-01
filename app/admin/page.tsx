import type { Metadata } from "next";
import { getReviews } from "@/lib/getReviews";

export const metadata: Metadata = {
  title: "Admin Panel | FrameRate",
  description: "Manage and create reviews on FrameRate.",
};

export default async function AdminPage() {
  const reviews = await getReviews();
  const publishedCount = reviews.filter((r) => r.status === "published").length;
  const draftCount = reviews.filter((r) => r.status === "draft").length;

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8">Admin Panel</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div className="bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 rounded">
            <h2 className="text-sm sm:text-lg font-semibold mb-2">Total Reviews</h2>
            <p className="text-3xl sm:text-4xl font-bold">{reviews.length}</p>
          </div>
          <div className="bg-green-100 dark:bg-green-900 p-4 sm:p-6 rounded">
            <h2 className="text-sm sm:text-lg font-semibold mb-2">Published</h2>
            <p className="text-3xl sm:text-4xl font-bold text-green-600 dark:text-green-400">
              {publishedCount}
            </p>
          </div>
          <div className="bg-yellow-100 dark:bg-yellow-900 p-4 sm:p-6 rounded">
            <h2 className="text-sm sm:text-lg font-semibold mb-2">Drafts</h2>
            <p className="text-3xl sm:text-4xl font-bold text-yellow-600 dark:text-yellow-400">
              {draftCount}
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-lg sm:text-2xl font-bold mb-4">Recent Reviews</h2>
          <div className="space-y-3 sm:space-y-4">
            {reviews.slice(0, 10).map((review) => (
              <div
                key={review.id}
                className="border border-gray-300 dark:border-gray-700 p-3 sm:p-4 rounded flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0"
              >
                <div>
                  <h3 className="font-semibold text-sm sm:text-base">{review.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    {review.type} • Rating: {review.rating}/10
                  </p>
                </div>
                <span
                  className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-semibold whitespace-nowrap ${
                    review.status === "published"
                      ? "bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200"
                      : "bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200"
                  }`}
                >
                  {review.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
