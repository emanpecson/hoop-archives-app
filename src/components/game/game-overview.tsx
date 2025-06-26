"use client";

import { useLoadData } from "@/hooks/use-load-data";
import { Game } from "@/types/model/game";
import { GameClip } from "@/types/model/game-clip";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface GameOverviewProps {
	leagueId: string;
	title: string;
}

// * this file would contain functionality for playing the video
// * + viewing the leaderboard
export default function GameOverview({ leagueId, title }: GameOverviewProps) {
	const [isFetchingGame, setIsFetchingGame] = useState(true);
	const [isFetchingClips, setIsFetchingClips] = useState(true);
	const [game, setGame] = useState<Game | null>(null);
	const [clips, setClips] = useState<GameClip[]>([]);
	const videoRef = useRef<HTMLVideoElement>(null);
	const clipIndex = useRef(0);

	useLoadData({
		endpoint: `/api/ddb/games/${leagueId}/${title}`,
		onDataLoaded: setGame,
		setIsLoading: setIsFetchingGame,
		onError: () => toast.error("Error fetching game"),
	});
	useLoadData({
		endpoint: `/api/ddb/game-clips/${title}`,
		onDataLoaded: setClips,
		setIsLoading: setIsFetchingClips,
		onError: () => toast.error("Error fetching game clips"),
	});

	const handleNextClip = () => {
		if (videoRef.current) {
			clipIndex.current = (clipIndex.current + 1) % clips.length;

			videoRef.current.src = clips[clipIndex.current].url;
			videoRef.current.load();
			videoRef.current.play();
		}
	};

	useEffect(() => {
		if (videoRef.current && clips.length > 0) {
			console.log("visits here");
			videoRef.current.src = clips[0].url;
			videoRef.current.load();
			videoRef.current.play();
		}
	}, [clips]);

	return (
		<div>
			{isFetchingGame || isFetchingClips ? (
				<p>Loading game...</p>
			) : game ? (
				<div>
					{JSON.stringify(clips)}
					{/* <video ref={videoRef} onEnded={handleNextClip} className="w-full" /> */}
					<video
						ref={videoRef}
						onEnded={handleNextClip}
						className="w-full"
						muted
						autoPlay
						controls
					/>
				</div>
			) : (
				<p>Failed to load game</p>
			)}
		</div>
	);
}
