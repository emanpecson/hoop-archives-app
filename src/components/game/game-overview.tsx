"use client";

import { useLoadData } from "@/hooks/use-load-data";
import { Game } from "@/types/model/game";
import { GameClip } from "@/types/model/game-clip";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import DashboardCard from "../dashboard/dashboard-card";
import DashboardCardHeader from "../dashboard/dashboard-card-header";
import { Input } from "../ui/input";
import {
	CalendarIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	FolderPenIcon,
	PauseIcon,
	PlayIcon,
	Volume2Icon,
} from "lucide-react";
import Statboard from "../video-clipper/game-details/statboard";
import { cn } from "@/lib/utils";
import VideoOverlayWrapper from "../video-clipper/video-player/overlay/video-overlay-wrapper";
import { useRealtimeScore } from "@/hooks/use-realtime-score";

interface GameOverviewProps {
	leagueId: string;
	title: string;
}

export default function GameOverview({ leagueId, title }: GameOverviewProps) {
	const [currentTime, setCurrentTime] = useState<number>(0);
	const [isFetchingGame, setIsFetchingGame] = useState(true);
	const [isFetchingClips, setIsFetchingClips] = useState(true);
	const [showOverlayController, setShowOverlayController] = useState(false);
	const [game, setGame] = useState<Game | null>(null);
	const [clips, setClips] = useState<GameClip[]>([]);
	const videoRef = useRef<HTMLVideoElement>(null);
	const clipIndex = useRef(0);
	const score = useRealtimeScore(clips, currentTime);

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

	const handlePlayPause = () => {
		if (videoRef.current) {
			if (videoRef.current.paused) videoRef.current.play();
			else videoRef.current.pause();
		}
	};

	const handlePrevClip = () => {
		if (videoRef.current && clipIndex.current > 0) {
			clipIndex.current -= 1;

			videoRef.current.src = clips[clipIndex.current].url;
			videoRef.current.load();
			videoRef.current.play();
		}
	};

	const handleNextClip = () => {
		if (videoRef.current) {
			clipIndex.current = (clipIndex.current + 1) % clips.length;

			videoRef.current.src = clips[clipIndex.current].url;
			videoRef.current.load();
			videoRef.current.play();
		}
	};

	const handleTimeUpdate = () => {
		if (videoRef.current) {
			setCurrentTime(videoRef.current.currentTime);
		}
	};

	useEffect(() => {
		if (videoRef.current && clips.length > 0) {
			videoRef.current.src = clips[0].url;
			videoRef.current.load();
			videoRef.current.play();
		}
	}, [clips]);

	return (
		<div className="w-full h-full flex-col">
			{isFetchingGame || isFetchingClips ? (
				<p>Loading game...</p>
			) : game ? (
				<div className="flex h-full gap-2">
					{/* video player */}
					<div
						className="h-full w-full rounded-2xl bg-black relative"
						onMouseOver={() => setShowOverlayController(true)}
						onMouseLeave={() => setShowOverlayController(false)}
					>
						<video
							ref={videoRef}
							onEnded={handleNextClip}
							onTimeUpdate={handleTimeUpdate}
							className="h-full w-full"
							muted
							autoPlay
						/>

						{/* video controller */}
						{videoRef.current && clips && clips.length > 0 && (
							<div
								className={cn(
									"absolute bottom-0 w-full p-4 flex space-x-3",
									showOverlayController ? "opacity-100" : "opacity-0",
									"duration-200 justify-end"
								)}
							>
								<VideoOverlayWrapper>
									<Volume2Icon strokeWidth={1.5} />
									<div className="flex place-items-center space-x-2">
										<button
											onClick={handlePrevClip}
											className="cursor-pointer disabled:pointer-events-none"
											disabled={clipIndex.current === 0}
										>
											<ChevronLeftIcon />
										</button>
										<span>
											{clipIndex.current + 1}/{clips.length}
										</span>
										<button onClick={handleNextClip} className="cursor-pointer">
											<ChevronRightIcon />
										</button>
									</div>

									<button onClick={handlePlayPause} className="cursor-pointer">
										{videoRef.current.paused ? (
											<PlayIcon strokeWidth={1.5} />
										) : (
											<PauseIcon strokeWidth={1.5} />
										)}
									</button>
								</VideoOverlayWrapper>

								<VideoOverlayWrapper>{`Home: ${score.home}`}</VideoOverlayWrapper>
								<VideoOverlayWrapper>{`Away: ${score.away}`}</VideoOverlayWrapper>
							</div>
						)}
					</div>

					{/* game details */}
					<DashboardCard className="space-y-4 overflow-y-auto h-full">
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
									game ? new Date(game.date).toLocaleDateString() : "Loading..."
								}
								className="pointer-events-none"
							/>
						</div>
						<hr className="text-neutral-700" />

						<Statboard label="Home Stats" clips={clips} players={game.home} />

						<hr className="text-neutral-700" />

						<Statboard label="Away Stats" clips={clips} players={game.away} />
					</DashboardCard>
				</div>
			) : (
				<p>Failed to load game</p>
			)}
		</div>
	);
}
