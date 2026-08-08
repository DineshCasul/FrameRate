"use client";

import { type DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CaretSortIcon } from "@radix-ui/react-icons";

type Checked = DropdownMenuCheckboxItemProps["checked"];

const SORT_OPTIONS = [
  { key: "lowest", label: "Lowest Rating" },
  { key: "highest", label: "Highest Rating" },
  { key: "newest", label: "Newest Reviews" },
  { key: "oldest", label: "Oldest Reviews" },
];

interface SortReviewsProps {
  activeSortKey: string | null;
  onSortChange: (sortKey: string | null) => void;
}

export function SortReviews({ activeSortKey, onSortChange }: SortReviewsProps) {
  const handleSortClick = (sortKey: string, checked: Checked) => {
    onSortChange(checked ? sortKey : null);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="cursor-pointer relative"
          aria-label={activeSortKey ? "Sort reviews (active)" : "Sort reviews"}
        >
          <CaretSortIcon />
          {activeSortKey && (
            <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-primary" />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Sort</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {SORT_OPTIONS.map(({ key, label }) => (
          <DropdownMenuCheckboxItem
            key={key}
            checked={activeSortKey === key}
            onCheckedChange={(checked) => handleSortClick(key, checked)}
          >
            {label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
