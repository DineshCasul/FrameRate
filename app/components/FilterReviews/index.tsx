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
import { MixerVerticalIcon } from "@radix-ui/react-icons";
import { useEffect } from "react";

type Checked = DropdownMenuCheckboxItemProps["checked"];

export function FilterReviews({ data, setFilteredData }: any) {
  const [showAll, setShowAll] = React.useState<Checked>(true);
  const [showSeries, setShowSeries] = React.useState<Checked>(false);
  const [showGames, setShowGames] = React.useState<Checked>(false);
  const [showMovies, setShowMovies] = React.useState<Checked>(false);
  const [showNinePlus, setShowNinePlus] = React.useState<Checked>(false);
  const [showEightPlus, setShowEightPlus] = React.useState<Checked>(false);
  const [showSevenPlus, setShowSevenPlus] = React.useState<Checked>(false);

  useEffect(() => {
    let filtered = data;
    if (
      !showAll &&
      (showSeries ||
        showGames ||
        showMovies ||
        showNinePlus ||
        showEightPlus ||
        showSevenPlus)
    ) {
      filtered = data.filter((item: any) => {
        const typeSelected = showSeries || showGames || showMovies;
        const ratingSelected = showNinePlus || showEightPlus || showSevenPlus;

        const typeMatch =
          !typeSelected ||
          (showSeries && item.type === "series") ||
          (showGames && item.type === "game") ||
          (showMovies && item.type === "movie");

        const ratingMatch =
          !ratingSelected ||
          (showNinePlus && item.rating >= 9) ||
          (showEightPlus && item.rating >= 8) ||
          (showSevenPlus && item.rating >= 7);

        return typeMatch && ratingMatch;
      });
    }
    setFilteredData(filtered);
  }, [
    showAll,
    showSeries,
    showGames,
    showMovies,
    showNinePlus,
    showEightPlus,
    showSevenPlus,
    data,
    setFilteredData,
  ]);

  const handleShowAllChange = (checked: Checked) => {
    setShowAll(checked);
    if (checked) {
      setShowSeries(false);
      setShowGames(false);
      setShowMovies(false);
      setShowNinePlus(false);
      setShowEightPlus(false);
      setShowSevenPlus(false);
    }
  };

  const handleTypeChange = (
    setter: (checked: Checked) => void,
    checked: Checked
  ) => {
    setter(checked);
    if (checked) {
      setShowAll(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button>
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
        <DropdownMenuCheckboxItem
          checked={showMovies}
          onCheckedChange={(checked) =>
            handleTypeChange(setShowMovies, checked)
          }
        >
          Movies
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={showSeries}
          onCheckedChange={(checked) =>
            handleTypeChange(setShowSeries, checked)
          }
        >
          Series
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={showGames}
          onCheckedChange={(checked) => handleTypeChange(setShowGames, checked)}
        >
          Games
        </DropdownMenuCheckboxItem>
        <DropdownMenuLabel>Rating</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuCheckboxItem
          checked={showNinePlus}
          onCheckedChange={(checked) =>
            handleTypeChange(setShowNinePlus, checked)
          }
        >
          9+
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={showEightPlus}
          onCheckedChange={(checked) =>
            handleTypeChange(setShowEightPlus, checked)
          }
        >
          8+
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={showSevenPlus}
          onCheckedChange={(checked) =>
            handleTypeChange(setShowSevenPlus, checked)
          }
        >
          7+
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
