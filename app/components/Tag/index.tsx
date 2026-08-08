import { ReviewKind } from "@/types";
import { TYPE_COLOR_CLASSES } from "@/lib/utils";

type Props = {
  type: ReviewKind;
};

const Tag = ({ type }: Props) => {
  return (
    <div className={`text-lg italic ${TYPE_COLOR_CLASSES[type].text}`}>
      [{type}]
    </div>
  );
};

export default Tag;
