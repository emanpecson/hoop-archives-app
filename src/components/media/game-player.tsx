"use client";

import { useGameRealtimeScore } from "@/hooks/use-realtime-score";
import { PlayTimestamp } from "@/types/model/game";
import { useRef, useState } from "react";
import VideoOverlayWrapper from "./overlay/video-overlay-wrapper";
import { cn } from "@/lib/utils";
import VideoOverlayController from "./overlay/video-overlay-controller";
import VideoOverlaySlider from "./overlay/video-overlay-slider";

interface GamePlayerProps {
	src: string;
	playTimestamps: PlayTimestamp[];
}

export default function GamePlayer(props: GamePlayerProps) {
	const [showOverlayController, setShowOverlayController] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const videoRef = useRef<HTMLVideoElement>(null);
	const score = useGameRealtimeScore(props.playTimestamps, currentTime);

	const handleTimeUpdate = () => {
		if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
	};

	const handleLoadedMetadata = () => {
		if (videoRef.current) {
			setDuration(videoRef.current.duration);
		}
	};

	return (
		<div
			className="h-full w-full rounded-2xl bg-black border border-input-border relative overflow-clip"
			onMouseOver={() => setShowOverlayController(true)}
			onMouseLeave={() => setShowOverlayController(false)}
		>
			<video
				ref={videoRef}
				onTimeUpdate={handleTimeUpdate}
				onLoadedMetadata={handleLoadedMetadata}
				className="h-full w-full object-contain"
			>
				<source src={props.src} type="video/mp4" />
			</video>

			{videoRef.current && (
				<div
					className={cn(
						"absolute bottom-0 w-full p-4 flex space-x-3",
						showOverlayController ? "opacity-100" : "opacity-0",
						"duration-200"
					)}
				>
					<div className="w-[16rem]">
						<VideoOverlayController
							videoRef={videoRef}
							startTime={0}
							endTime={duration}
							currentTime={currentTime}
						/>
					</div>
					<div className="w-full">
						<VideoOverlaySlider
							videoRef={videoRef}
							startTime={0}
							endTime={duration}
							currentTime={currentTime}
						/>
					</div>
					<VideoOverlayWrapper>{`Home: ${score.home}`}</VideoOverlayWrapper>
					<VideoOverlayWrapper>{`Away: ${score.away}`}</VideoOverlayWrapper>
				</div>
			)}
		</div>
	);
}
