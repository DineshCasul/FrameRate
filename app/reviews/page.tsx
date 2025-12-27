"use client";
import Link from "next/link";
import Card from "../components/Card";
import { cardData } from "../dummyData";
import { FilterReviews } from "../components/FilterReviews";
import { SortReviews } from "../components/SortReviews";
import { useState } from "react";
import BreadCrumbs from "../components/BreadCrumbs";

const ReviewsPage = () => {
  const [filteredData, setFilteredData] = useState(cardData);
  return (
    <>
      <div>
        <BreadCrumbs
          crumbs={[{ label: "Home", href: "/" }, { label: "Reviews" }]}
        />
      </div>
      <div className="flex w-full border-b my-4 sm:mt-0 mb-8 pb-4 justify-between">
        <div>{`${filteredData?.length} / ${cardData?.length}`}</div>
        <div className="pb-4 flex flex-row sm:flex-row sm:justify-end gap-4 sm:gap-4">
          <button className="flex item-center gap-2">
            <FilterReviews data={cardData} setFilteredData={setFilteredData} />
          </button>
          |
          <button className="flex item-center gap-2">
            <SortReviews />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 justify-items-center">
        {filteredData.map((data) => (
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
              backgroundUrl={data.backgroundUrl}
            />
          </Link>
        ))}
      </div>
    </>
  );
};

export default ReviewsPage;
