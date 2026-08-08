import { ReviewKind } from "@/types";
import { parseContent, TYPE_COLOR_CLASSES } from "@/lib/utils";
import Tag from "../Tag";

type Props = {
  description: string[] | string;
  rating: number;
  title: string;
  className?: string;
  type: ReviewKind;
  backgroundUrl?: string;
};

const Card = ({ title, rating, description, type, backgroundUrl }: Props) => {
  const colors = TYPE_COLOR_CLASSES[type];

  return (
    <div
      className={`border h-40 sm:h-48 cursor-pointer relative overflow-hidden group ${colors.hoverBg} transition ease-in-out p-3 sm:p-4 w-full`}
    >
      {backgroundUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110 opacity-40"
          style={{
            backgroundImage: `url(${backgroundUrl})`,
          }}
        ></div>
      )}
      <div className="relative z-10">
        <Tag type={type} />
        <div className="font-bold text-base sm:text-lg line-clamp-1">{title}</div>
        <div className={`text-xl sm:text-2xl font-bold ${colors.text}`}>
          {rating}/10
        </div>
        <div className="my-3 sm:my-4 text-xs sm:text-sm line-clamp-3">
          {parseContent(description).join(" ")}
        </div>
      </div>
    </div>
  );
};

export default Card;
