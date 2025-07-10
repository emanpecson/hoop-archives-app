"use client";

import { useLoadData } from "@/hooks/use-load-data";
import { Game } from "@/types/model/game";
import { GameClip } from "@/types/model/game-clip";
import { useState } from "react";
import { toast } from "sonner";
import ClipPlayer from "../clip-player";
import GameOverviewDetails from "./game-overview-details";
import { Loader2Icon } from "lucide-react";
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
				<div className="w-full h-1/2 flex flex-col justify-center place-items-center text-neutral-400">
					<p className="animate-bounce text-2xl">🏀</p>
					<div className="flex space-x-2">
						<Loader2Icon className="animate-spin" />
						<p className="font-medium text-base">
							{`Loading "${title}", please wait...`}
						</p>
					</div>
					<Button variant="input" className="w-fit mt-3">
						<Link href="/">Return to games</Link>
					</Button>
				</div>
			) : game && clips.length > 0 ? (
				<div className="flex h-full gap-2">
					<ClipPlayer clips={clips} />
					<GameOverviewDetails game={game} clips={clips} />
				</div>
			) : (
				<div className="w-full h-1/2 flex flex-col justify-center place-items-center text-neutral-400">
					<p className="text-2xl">🏀 🚫</p>
					<p className="font-medium text-base">{`Failed to load "${title}"`}</p>
					<Button variant="input" className="w-fit mt-3">
						<Link href="/">Return to games</Link>
					</Button>
				</div>
			)}
		</div>
	);
}
