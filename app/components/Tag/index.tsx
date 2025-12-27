import { ReviewKind } from "@/types";

type Props = {
  type: ReviewKind;
};

const Tag = ({ type }: Props) => {
  return (
    <div
      className={`text-lg italic ${
        type === "movie"
          ? "text-blue-500"
          : type === "game"
          ? "text-green-500"
          : type === "series"
          ? "text-red-700"
          : "text-black"
      }`}
    >
      [{type}]
    </div>
  );
};

export default Tag;
