"use client";

import { useLoadData } from "@/hooks/use-load-data";
import { Game } from "@/types/model/game";
import { GameClip } from "@/types/model/game-clip";
import { useState } from "react";
import { toast } from "sonner";
import DashboardCard from "../dashboard/dashboard-card";
import DashboardCardHeader from "../dashboard/dashboard-card-header";
import { Input } from "../ui/input";
import { CalendarIcon, FolderPenIcon } from "lucide-react";
import Statboard from "../video-clipper/game-details/statboard";
import ClipPlayer from "../clip-player";
import { Button } from "../ui/button";
import Link from "next/link";

interface GameOverviewProps {
	leagueId: string;
	title: string;
}

export default function GameOverview({ leagueId, title }: GameOverviewProps) {
	const [isFetchingGame, setIsFetchingGame] = useState(true);
	const [isFetchingClips, setIsFetchingClips] = useState(true);
	const [game, setGame] = useState<Game | null>(null);
	const [clips, setClips] = useState<GameClip[]>([]);

	useLoadData({
		endpoint: `/api/ddb/${leagueId}/games/${title}`,
		onDataLoaded: setGame,
		setIsLoading: setIsFetchingGame,
		onError: () => toast.error("Error fetching game"),
	});
	useLoadData({
		endpoint: `/api/ddb/${leagueId}/game-clips/${title}`,
		onDataLoaded: setClips,
		setIsLoading: setIsFetchingClips,
		onError: () => toast.error("Error fetching game clips"),
	});

	return (
		<div className="w-full h-full flex-col">
			{isFetchingGame || isFetchingClips ? (
				<p>Loading game...</p>
			) : game ? (
				<div className="flex h-full gap-2">
					<ClipPlayer clips={clips} />

					{/* game details */}
					<DashboardCard className="h-full flex flex-col justify-between">
						<div className="space-y-4 overflow-y-auto h-full">
							<DashboardCardHeader text="Game Details" />
							<div className="space-y-2">
								<Input
									readOnly
									Icon={FolderPenIcon}
									value={game ? game.title : "Loading..."}
									className="pointer-events-none"
								/>
								<Input
									readOnly
									Icon={CalendarIcon}
									value={
										game
											? new Date(game.date).toLocaleDateString()
											: "Loading..."
									}
									className="pointer-events-none"
								/>
							</div>
							<hr className="text-neutral-700" />

							<Statboard label="Home Stats" clips={clips} players={game.home} />

							<hr className="text-neutral-700" />

							<Statboard label="Away Stats" clips={clips} players={game.away} />
						</div>

						<Button variant="input">
							<Link href="/">Return to games</Link>
						</Button>
					</DashboardCard>
				</div>
			) : (
				<p>Failed to load game</p>
			)}
		</div>
	);
}
