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

export function SortReviews({
  data,
  setFilteredData,
}: {
  data: any[];
  setFilteredData?: (items: any[]) => void;
}) {
  const [sortByLowestRating, setSortByLowestRating] =
    React.useState<Checked>(true);
  const [sortByHighestRating, setSortByHighestRating] =
    React.useState<Checked>(false);
  const [sortByNewest, setSortByNewest] = React.useState<Checked>(false);
  const [sortByOldest, setSortByOldest] = React.useState<Checked>(false);

  const onSortClick = (sortKey: string, checked: Checked) => {
    // ensure only the clicked option is checked
    switch (sortKey) {
      case "lowest":
        setSortByLowestRating(checked);
        setSortByHighestRating(false);
        setSortByNewest(false);
        setSortByOldest(false);
        break;
      case "highest":
        setSortByLowestRating(false);
        setSortByHighestRating(checked);
        setSortByNewest(false);
        setSortByOldest(false);
        break;
      case "newest":
        setSortByLowestRating(false);
        setSortByHighestRating(false);
        setSortByNewest(checked);
        setSortByOldest(false);
        break;
      case "oldest":
        setSortByLowestRating(false);
        setSortByHighestRating(false);
        setSortByNewest(false);
        setSortByOldest(checked);
        break;
    }

    if (checked) {
      const sorted = sortReviews(data, sortKey as any);
      setFilteredData?.(sorted);
    } else {
      setFilteredData?.(data);
    }
  };

  const sortReviews = (data: any[], sortValue: string) => {
    const items = [...data];
    switch (sortValue) {
      case "newest":
        return items.sort(
          (a, b) =>
            new Date(b.publishedAt).getTime() -
            new Date(a.publishedAt).getTime()
        );
      case "oldest":
        return items.sort(
          (a, b) =>
            new Date(a.publishedAt).getTime() -
            new Date(b.publishedAt).getTime()
        );
      case "highest":
        return items.sort((a, b) => b.rating - a.rating);
      case "lowest":
        return items.sort((a, b) => a.rating - b.rating);
      default:
        return items;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <CaretSortIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Sort</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={sortByLowestRating}
          onCheckedChange={(checked) => onSortClick("lowest", checked)}
        >
          Lowest Rating
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={sortByHighestRating}
          onCheckedChange={(checked) => onSortClick("highest", checked)}
        >
          Highest Rating
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={sortByNewest}
          onCheckedChange={(checked) => onSortClick("newest", checked)}
        >
          Newest Reviews
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={sortByOldest}
          onCheckedChange={(checked) => onSortClick("oldest", checked)}
        >
          Oldest Reviews
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
