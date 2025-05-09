"use client";

import { Dispatch, RefObject, SetStateAction, useState } from "react";
import VideoOverlayWrapper from "./video-overlay-wrapper";
import { PauseIcon, PlayIcon, Volume2Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { getTimestamp } from "@/utils/time";

interface VideoPlayerProps {
	videoRef: RefObject<HTMLVideoElement | null>;
	src: string;
	currentTime: number;
	duration: number;
	setCurrentTime: Dispatch<SetStateAction<number>>;
	setDuration: Dispatch<SetStateAction<number>>;
	onSliderChange: (value: number[]) => void;
}

export default function VideoPlayer(props: VideoPlayerProps) {
	const [showOverlayController, setShowOverlayController] = useState(false);
	const time = `${getTimestamp(props.currentTime)} / ${getTimestamp(
		props.duration
	)}`;

	const handleLoadedMetadata = () => {
		if (props.videoRef.current) {
			props.setDuration(props.videoRef.current.duration);
		}
	};

	const handleTimeUpdate = () => {
		if (props.videoRef.current) {
			props.setCurrentTime(props.videoRef.current.currentTime);
		}
	};

	const handlePlayPause = () => {
		if (props.videoRef.current) {
			if (props.videoRef.current.paused) props.videoRef.current.play();
			else props.videoRef.current.pause();
		}
	};

	return (
		<div
			className="rounded-2xl bg-black w-full relative overflow-clip grow"
			onMouseOver={() => setShowOverlayController(true)}
			onMouseLeave={() => setShowOverlayController(false)}
		>
			<video
				ref={props.videoRef}
				width={600}
				className="h-full w-full mx-auto"
				preload="metadata"
				onLoadedMetadata={handleLoadedMetadata}
				onTimeUpdate={handleTimeUpdate}
			>
				<source src={props.src} type="video/mp4" />
			</video>

			{/* {props.videoRef.current && props.src && ( */}
			{props.videoRef.current && (
				<div
					className={cn(
						"absolute bottom-0 w-full p-4 flex space-x-3",
						showOverlayController ? "opacity-100" : "opacity-0",
						"duration-200"
					)}
				>
					<div className="w-[16rem]">
						<VideoOverlayWrapper>
							<button onClick={handlePlayPause} className="cursor-pointer">
								{props.videoRef.current.paused ? (
									<PlayIcon strokeWidth={1.5} />
								) : (
									<PauseIcon strokeWidth={1.5} />
								)}
							</button>
							<span className="pointer-events-none">{time}</span>
							<button>
								<Volume2Icon strokeWidth={1.5} />
							</button>
						</VideoOverlayWrapper>
					</div>

					<div className="w-full">
						<VideoOverlayWrapper>
							<Slider
								min={0}
								max={props.duration}
								step={0.1}
								value={[props.currentTime]}
								onValueChange={props.onSliderChange}
							/>
						</VideoOverlayWrapper>
					</div>
				</div>
			)}
		</div>
	);
}
