"use client";

import { useLoadData } from "@/hooks/use-load-data";
import { Game } from "@/types/model/game";
import { useState } from "react";
import { toast } from "sonner";
import GameOverviewDetails from "./game-overview-details";
import LoadingPrompt from "../loading-prompt";
import EmptyPrompt from "../empty-prompt";
import GamePlayer from "../media/game-player";
import { tempLeagueId } from "@/data/temp";

interface GameOverviewProps {
  leagueId: string;
  gameId: string;
}

export default function GameOverview({ leagueId, gameId }: GameOverviewProps) {
  const [isFetchingGame, setIsFetchingGame] = useState(true);
  const [game, setGame] = useState<Game | null>(null);
  const goBackUrl = `/league/${tempLeagueId}`;

  useLoadData({
    endpoint: `/api/ddb/${leagueId}/games/${gameId}`,
    onDataLoaded: setGame,
    setIsLoading: setIsFetchingGame,
    onError: () => toast.error("Error fetching game"),
  });

  return (
    <div className="w-full h-full">
      {isFetchingGame ? (
        <LoadingPrompt
          text={`Loading "${gameId}". Please wait...`}
          goBackUrl={goBackUrl}
        />
      ) : game && game.sourceUrl ? (
        <div className="flex max-sm:flex-col h-full w-full gap-2">
          <div className="max-sm:h-[40vh] max-sm:flex-shrink-0 h-full w-full">
            <GamePlayer
              src={game.sourceUrl}
              playTimestamps={game.playTimestamps}
            />
          </div>
          <GameOverviewDetails game={game} />
        </div>
      ) : (
        <EmptyPrompt
          text={`Failed to load "${gameId}"`}
          goBackUrl={goBackUrl}
        />
      )}
    </div>
  );
}
