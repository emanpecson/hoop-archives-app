"use client";

import DateInput from "@/components/input/date-input";
import DebouncedInput from "@/components/input/debounced-input";
import PlayerMultiSelect from "@/components/input/player-multi-select";
import { useLoadData } from "@/hooks/use-load-data";
import { Player } from "@/types/model/player";
import { FilterIcon, SearchIcon } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";

interface GameFiltersProps {
  leagueId: string;
  title: string | undefined;
  setTitle: (title: string) => void;
  startDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  endDate: Date | undefined;
  setEndDate: (date: Date | undefined) => void;
  players: Player[];
  setPlayers: (players: Player[]) => void;
}

export default function GameFilters(props: GameFiltersProps) {
  const [playerOptions, setPlayerOptions] = useState<Player[]>([]);
  const [isFetchingPlayerOptions, setIsFetchingPlayerOptions] = useState(true);
  const [tempSearch, setTempSearch] = useState("");

  useLoadData({
    endpoint: `/api/ddb/${props.leagueId}/players`,
    onDataLoaded: setPlayerOptions,
    setIsLoading: setIsFetchingPlayerOptions,
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-fit" variant="input">
          <FilterIcon />
          <span>Filters</span>
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Game Filters</DialogTitle>
          <DialogDescription />
        </DialogHeader>

        <div className="w-full flex flex-col space-y-2">
          <div className="w-full">
            <DebouncedInput
              Icon={SearchIcon}
              onDebounce={props.setTitle}
              onChange={setTempSearch}
              value={tempSearch}
              placeholder="Search game title..."
            />
          </div>
          <div className="w-full">
            <DateInput
              placeholder="Select start date..."
              value={props.startDate}
              onChange={props.setStartDate}
            />
          </div>
          <div className="w-full">
            <DateInput
              placeholder="Select end date..."
              value={props.endDate}
              onChange={props.setEndDate}
            />
          </div>
          <div className="w-full">
            <PlayerMultiSelect
              onChange={props.setPlayers}
              playerOptions={playerOptions}
              value={props.players}
              disabled={isFetchingPlayerOptions || playerOptions.length === 0}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
