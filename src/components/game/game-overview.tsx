"use client";

import { useLoadData } from "@/hooks/use-load-data";
import { Game } from "@/types/model/game";
import { Clip } from "@/types/model/clip";
import { useState } from "react";
import { toast } from "sonner";
import ClipPlayer from "../clip-player";
import GameOverviewDetails from "./game-overview-details";
import LoadingPrompt from "../loading-prompt";
import EmptyPrompt from "../empty-prompt";

interface GameOverviewProps {
	leagueId: string;
	gameId: string;
}

export default function GameOverview({ leagueId, gameId }: GameOverviewProps) {
	const [isFetchingGame, setIsFetchingGame] = useState(true);
	const [isFetchingClips, setIsFetchingClips] = useState(true);
	const [game, setGame] = useState<Game | null>(null);
	const [clips, setClips] = useState<Clip[]>([]);

	useLoadData({
		endpoint: `/api/ddb/${leagueId}/games/${gameId}`,
		onDataLoaded: setGame,
		setIsLoading: setIsFetchingGame,
		onError: () => toast.error("Error fetching game"),
	});

	useLoadData({
		endpoint: `/api/ddb/${leagueId}/clips/${gameId}`,
		onDataLoaded: setClips,
		setIsLoading: setIsFetchingClips,
		onError: () => toast.error("Error fetching game clips"),
	});

	return (
		<div className="w-full h-full flex-col">
			{isFetchingGame || isFetchingClips ? (
				<LoadingPrompt
					text={`Loading "${gameId}", please wait...`}
					goBackUrl="/"
				/>
			) : game && clips.length > 0 ? (
				<div className="flex h-full gap-2">
					<ClipPlayer clips={clips} />
					<GameOverviewDetails game={game} clips={clips} />
				</div>
			) : (
				<EmptyPrompt text={`Failed to load "${gameId}"`} goBackUrl="/" />
			)}
		</div>
	);
}
