"use client";

import { useRef, useState } from "react";
import ClipController from "./clip-controller";
import ClipDetails from "./clip-details/clip-details";
import GameDetails from "./game-details";
import VideoController from "./video-controller/video-controller";
import VideoPlayer from "./video-player/video-player";
import { ClipTime } from "@/types/clip-time";

interface VideoClipperProps {
	src: string;
}

export default function VideoClipper(props: VideoClipperProps) {
	const videoRef = useRef<HTMLVideoElement>(null);
	const [clips, setClips] = useState<ClipTime[]>([]);
	const [duration, setDuration] = useState(0);
	const [currentTime, setCurrentTime] = useState(0);

	const handleSliderChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
		const newTime = parseFloat(ev.target.value);
		setCurrentTime(newTime);
		if (videoRef.current) {
			videoRef.current.currentTime = newTime;
		}
	};

	return (
		<div className="flex w-full h-full gap-dashboard">
			<div className="flex flex-col w-full h-full gap-dashboard">
				<div className="flex w-full gap-dashboard h-full min-h-0">
					<ClipDetails />
					<VideoPlayer
						videoRef={videoRef}
						src={props.src}
						currentTime={currentTime}
						duration={duration}
						setCurrentTime={setCurrentTime}
						setDuration={setDuration}
						onSliderChange={handleSliderChange}
					/>
				</div>
				<div className="h-fit flex flex-col gap-dashboard">
					<VideoController
						clips={clips}
						setClips={setClips}
						videoRef={videoRef}
						currentTime={currentTime}
						duration={duration}
						onSliderChange={handleSliderChange}
					/>
					<ClipController />
				</div>
			</div>
			<GameDetails />
		</div>
	);
}
