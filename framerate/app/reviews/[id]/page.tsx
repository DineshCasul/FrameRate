import { cardData } from "./../../dummyData";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ReviewDetail({ params }: PageProps) {
  const { id } = await params;

  const review = cardData.find((r) => r.id === id);

  if (!review) {
    return notFound();
  }

  return (
    <div className="min-h-screen p-8 bg-white dark:bg-black text-black dark:text-white">
      <h1 className="text-4xl font-bold mb-4">{review.title}</h1>

      <p className="text-2xl font-bold mb-4">Rating: {review.rating}/10</p>
      {review.trailerUrl && (
        <div className="flex justify-center mb-6">
          <div className="w-full max-w-3xl sm:max-w-2xl md:max-w-4xl aspect-video">
            <iframe
              className="w-full h-full rounded-md"
              src={review.trailerUrl.replace("watch?v=", "embed/")}
              title={`${review.title} Trailer`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
      <p className="first-letter:text-5xl first-letter:font-bold first-letter:mr-2 first-letter:float-left">
        {review.content[0]}
      </p>
      {review.content.slice(1).map((para, i) => (
        <p key={i} className="mb-4 leading-relaxed">
          {para}
        </p>
      ))}

      <a
        href="/"
        className="inline-block mt-4 px-4 py-2 text-black rounded hover:bg-slate-100"
      >
        ← Back to Home
      </a>
    </div>
  );
}
