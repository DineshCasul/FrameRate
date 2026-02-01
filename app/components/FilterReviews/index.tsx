"use client";

import * as React from "react";
import { type DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import type { Review } from "@/types";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MixerVerticalIcon } from "@radix-ui/react-icons";
import { useEffect, useCallback, useState } from "react";

type Checked = DropdownMenuCheckboxItemProps["checked"];

interface FilterReviewsProps {
  data: Review[];
  setFilteredData: (data: Review[]) => void;
}

const REVIEW_TYPES = [
  { key: "movies", label: "Movies", type: "movie" as const },
  { key: "series", label: "Series", type: "series" as const },
  { key: "games", label: "Games", type: "game" as const },
];

const RATING_THRESHOLDS = [
  { key: "ninePlus", label: "9+", rating: 9 },
  { key: "eightPlus", label: "8+", rating: 8 },
  { key: "sevenPlus", label: "7+", rating: 7 },
];

export function FilterReviews({ data, setFilteredData }: FilterReviewsProps) {
  const [showAll, setShowAll] = useState<Checked>(true);
  const [selectedTypes, setSelectedTypes] = useState<Record<string, Checked>>({
    movies: false,
    series: false,
    games: false,
  });
  const [selectedRatings, setSelectedRatings] = useState<
    Record<string, Checked>
  >({
    ninePlus: false,
    eightPlus: false,
    sevenPlus: false,
  });

  useEffect(() => {
    let filtered = data;

    const hasTypeFilter = Object.values(selectedTypes).some(Boolean);
    const hasRatingFilter = Object.values(selectedRatings).some(Boolean);

    if (!showAll && (hasTypeFilter || hasRatingFilter)) {
      filtered = data.filter((item: Review) => {
        const typeMatch =
          !hasTypeFilter ||
          (selectedTypes.movies && item.type === "movie") ||
          (selectedTypes.series && item.type === "series") ||
          (selectedTypes.games && item.type === "game");

        const ratingMatch =
          !hasRatingFilter ||
          (selectedRatings.ninePlus && item.rating >= 9) ||
          (selectedRatings.eightPlus && item.rating >= 8) ||
          (selectedRatings.sevenPlus && item.rating >= 7);

        return typeMatch && ratingMatch;
      });
    }

    setFilteredData(filtered);
  }, [showAll, selectedTypes, selectedRatings, data, setFilteredData]);

  const handleShowAllChange = useCallback((checked: Checked) => {
    setShowAll(checked);
    if (checked) {
      setSelectedTypes({
        movies: false,
        series: false,
        games: false,
      });
      setSelectedRatings({
        ninePlus: false,
        eightPlus: false,
        sevenPlus: false,
      });
    }
  }, []);

  const handleTypeChange = useCallback((typeKey: string, checked: Checked) => {
    setShowAll(false);
    setSelectedTypes((prev) => ({
      ...prev,
      [typeKey]: checked,
    }));
  }, []);

  const handleRatingChange = useCallback(
    (ratingKey: string, checked: Checked) => {
      setShowAll(false);
      setSelectedRatings((prev) => ({
        ...prev,
        [ratingKey]: checked,
      }));
    },
    [],
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="cursor-pointer">
          <MixerVerticalIcon />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Type</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={showAll}
          onCheckedChange={handleShowAllChange}
        >
          All
        </DropdownMenuCheckboxItem>
        {REVIEW_TYPES.map(({ key, label }) => (
          <DropdownMenuCheckboxItem
            key={key}
            checked={selectedTypes[key]}
            onCheckedChange={(checked) => handleTypeChange(key, checked)}
          >
            {label}
          </DropdownMenuCheckboxItem>
        ))}

        <DropdownMenuLabel className="mt-2">Rating</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {RATING_THRESHOLDS.map(({ key, label }) => (
          <DropdownMenuCheckboxItem
            key={key}
            checked={selectedRatings[key]}
            onCheckedChange={(checked) => handleRatingChange(key, checked)}
          >
            {label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
