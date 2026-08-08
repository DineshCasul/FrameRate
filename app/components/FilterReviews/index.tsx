"use client";

import * as React from "react";
import { type DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import type { ReviewKind } from "@/types";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MixerVerticalIcon } from "@radix-ui/react-icons";

type Checked = DropdownMenuCheckboxItemProps["checked"];

const REVIEW_TYPES: { label: string; type: ReviewKind }[] = [
  { label: "Movies", type: "movie" },
  { label: "Series", type: "series" },
  { label: "Games", type: "game" },
];

const RATING_THRESHOLDS = [
  { label: "9+", rating: 9 },
  { label: "8+", rating: 8 },
  { label: "7+", rating: 7 },
];

interface FilterReviewsProps {
  activeTypes: ReviewKind[];
  activeRating: number | null;
  onTypesChange: (types: ReviewKind[]) => void;
  onRatingChange: (rating: number | null) => void;
}

export function FilterReviews({
  activeTypes,
  activeRating,
  onTypesChange,
  onRatingChange,
}: FilterReviewsProps) {
  const isActive = activeTypes.length > 0 || activeRating !== null;

  const handleShowAllChange = (checked: Checked) => {
    if (checked) {
      onTypesChange([]);
      onRatingChange(null);
    }
  };

  const handleTypeChange = (type: ReviewKind, checked: Checked) => {
    onTypesChange(
      checked ? [...activeTypes, type] : activeTypes.filter((t) => t !== type),
    );
  };

  const handleRatingChange = (rating: number, checked: Checked) => {
    onRatingChange(checked ? rating : null);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="cursor-pointer relative"
          aria-label={isActive ? "Filter reviews (active)" : "Filter reviews"}
        >
          <MixerVerticalIcon />
          {isActive && (
            <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-primary" />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Type</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked={!isActive} onCheckedChange={handleShowAllChange}>
          All
        </DropdownMenuCheckboxItem>
        {REVIEW_TYPES.map(({ type, label }) => (
          <DropdownMenuCheckboxItem
            key={type}
            checked={activeTypes.includes(type)}
            onCheckedChange={(checked) => handleTypeChange(type, checked)}
          >
            {label}
          </DropdownMenuCheckboxItem>
        ))}

        <DropdownMenuLabel className="mt-2">Rating</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {RATING_THRESHOLDS.map(({ rating, label }) => (
          <DropdownMenuCheckboxItem
            key={rating}
            checked={activeRating === rating}
            onCheckedChange={(checked) => handleRatingChange(rating, checked)}
          >
            {label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
