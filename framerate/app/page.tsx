import Link from "next/link";
import Card from "./components/Card";
import { cardData, homepageData } from "./dummyData";

export default function Home() {
  return (
    <div className="min-h-full flex flex-col items-center justify-center bg-white dark:bg-black text-black dark:text-white px-6 py-12 dark:border-gray-700">
      <div className="text-center max-w-3xl">
        <h1 className="text-4xl font-bold mb-4">{homepageData.title}</h1>
        <p className="text-lg mb-4">{homepageData.subtitle}</p>
        <p className="mb-8 whitespace-pre-line">{homepageData.description}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
          {cardData.map((data) => (
            <Link
              href={`/reviews/${data.id}`}
              key={data.id}
              className="block w-full"
            >
              <Card
                rating={data.rating}
                description={data.content}
                title={data.title}
                type={data.type}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
