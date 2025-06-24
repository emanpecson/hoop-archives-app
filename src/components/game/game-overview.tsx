"use client";

import { Game } from "@/types/model/game";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface GameOverviewProps {
	leagueId: string;
	title: string;
}

// * this file would contain functionality for playing the video
// * + viewing the leaderboard
export default function GameOverview({ leagueId, title }: GameOverviewProps) {
	const [isFetching, setIsFetching] = useState(true);
	const [game, setGame] = useState<Game | null>(null);

	const fetchGame = async () => {
		try {
			setIsFetching(true);
			const res = await fetch(`/api/ddb/games/${leagueId}/${title}`);
			const data = await res.json();
			setGame(data);
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (error) {
			toast.error("Error fetching game");
		} finally {
			setIsFetching(false);
		}
	};

	useEffect(() => {
		fetchGame();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div>
			{isFetching ? (
				<p>Loading game...</p>
			) : game ? (
				<div>{game.title}</div>
			) : (
				<p>Failed to load game</p>
			)}
		</div>
	);
}
