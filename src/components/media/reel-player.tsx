"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import VideoOverlayController from "./overlay/video-overlay-controller";
import VideoOverlaySlider from "./overlay/video-overlay-slider";

interface ReelPlayerProps {
	src: string;
}

export default function ReelPlayer(props: ReelPlayerProps) {
	const [showOverlayController, setShowOverlayController] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const videoRef = useRef<HTMLVideoElement>(null);

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
				className="h-full w-full object-cover"
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
				</div>
			)}
		</div>
	);
}
