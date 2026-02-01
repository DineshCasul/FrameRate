"use client";

import * as React from "react";
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

interface SortOption {
  key: string;
  label: string;
}

const SORT_OPTIONS: SortOption[] = [
  { key: "lowest", label: "Lowest Rating" },
  { key: "highest", label: "Highest Rating" },
  { key: "newest", label: "Newest Reviews" },
  { key: "oldest", label: "Oldest Reviews" },
];

interface SortReviewsProps {
  onSortChange?: (sortKey: string | null) => void;
}

export function SortReviews({ onSortChange }: SortReviewsProps) {
  const [activeSortKey, setActiveSortKey] = React.useState<string | null>(null);

  const handleSortClick = (sortKey: string, checked: Checked) => {
    const newSortKey = checked ? sortKey : null;
    setActiveSortKey(newSortKey);
    onSortChange?.(newSortKey);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="cursor-pointer">
          <CaretSortIcon />
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
