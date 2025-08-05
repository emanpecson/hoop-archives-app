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
					goBackUrl={`/league/${tempLeagueId}`}
				/>
			) : game && game.gameClipsUrl ? (
				<div className="flex h-full gap-2">
					<GamePlayer
						gameClipsUrl={game.gameClipsUrl}
						playTimestamps={game.playTimestamps}
					/>
					<GameOverviewDetails game={game} />
				</div>
			) : (
				<EmptyPrompt
					text={`Failed to load "${gameId}"`}
					goBackUrl={`/league/${tempLeagueId}`}
				/>
			)}
		</div>
	);
}
