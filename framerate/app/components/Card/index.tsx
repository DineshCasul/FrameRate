import { ReviewKind } from "@/types";
import Tag from "../Tag";

type Props = {
  description: string[];
  rating: number;
  title: string;
  className?: string;
  type: ReviewKind;
};

const Card = ({ title, rating, description, type }: Props) => {
  return (
    <div
      className={`border h-48  cursor-pointer ${
        type === "movie"
          ? "hover:bg-blue-200 transition ease-in-out dark:hover:bg-blue-900"
          : type === "game"
          ? "hover:bg-green-200 transition ease-in-out dark:hover:bg-green-900"
          : type === "series"
          ? "hover:bg-red-200 transition ease-in-out dark:hover:bg-red-900"
          : "none"
      } p-4 w-56`}
    >
      <Tag type={type} />
      <div className="font-bold text-lg">{title}</div>
      <div
        className={`text-2xl font-bold ${
          type === "movie"
            ? "text-blue-500 dark:text-blue-400"
            : type === "game"
            ? "text-green-500 dark:text-green-400"
            : type === "series"
            ? "text-red-500 dark:text-red-400"
            : "text-black"
        }`}
      >
        {rating}/10
      </div>
      <div className="my-4 text-xs line-clamp-3">{description}</div>
    </div>
  );
};

export default Card;
