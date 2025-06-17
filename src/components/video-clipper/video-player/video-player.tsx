"use client";

import { Dispatch, SetStateAction, useState } from "react";
import VideoOverlayWrapper from "./video-overlay-wrapper";
import { PauseIcon, PlayIcon, Volume2Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { getTimestamp } from "@/utils/time";
import { useVideoClipperStore } from "@/hooks/use-video-clipper-store";

interface VideoPlayerProps {
	playClip: (i: number) => void;
	currClipIndex: number | null;
	setCurrClipIndex: Dispatch<SetStateAction<number | null>>;
}

export default function VideoPlayer(props: VideoPlayerProps) {
	const {
		duration,
		setDuration,
		currentTime,
		setCurrentTime,
		videoRef,
		source,
		clips,
		isPreviewingClips,
		setIsPreviewingClips,
		homeScore,
		awayScore,
	} = useVideoClipperStore((state) => ({
		duration: state.duration,
		setDuration: state.setDuration,
		currentTime: state.currentTime,
		setCurrentTime: state.setCurrentTime,
		videoRef: state.videoRef,
		source: state.source,
		clips: state.clips,
		isPreviewingClips: state.isPreviewingClips,
		setIsPreviewingClips: state.setIsPreviewingClips,
		homeScore: state.homeScore,
		awayScore: state.awayScore,
	}));

	const [showOverlayController, setShowOverlayController] = useState(false);
	const time = `${getTimestamp(currentTime)} / ${getTimestamp(duration)}`;

	const handleLoadedMetadata = () => {
		if (videoRef.current) {
			setDuration(videoRef.current.duration);
		}
	};

	const handleTimeUpdate = () => {
		if (videoRef.current) {
			const vid = videoRef.current;
			setCurrentTime(vid.currentTime);

			if (isPreviewingClips && props.currClipIndex !== null) {
				const clip = clips[props.currClipIndex];

				// @ end of curr clip, play next clip
				if (vid.currentTime >= clip.endTime) {
					const nextIndex = props.currClipIndex + 1;

					if (nextIndex < clips.length) {
						props.playClip(nextIndex);
					} else {
						vid.pause();
						props.setCurrClipIndex(null);
					}
				}
			}
		}
	};

	const handlePlayPause = () => {
		setIsPreviewingClips(false);

		if (videoRef.current) {
			if (videoRef.current.paused) videoRef.current.play();
			else videoRef.current.pause();
		}
	};

	const handleSliderChange = (value: number[]) => {
		setCurrentTime(value[0]);
		if (videoRef.current) videoRef.current.currentTime = value[0];
	};

	return (
		<div
			className="rounded-2xl bg-black w-full relative overflow-clip grow"
			onMouseOver={() => setShowOverlayController(true)}
			onMouseLeave={() => setShowOverlayController(false)}
		>
			{source && (
				<video
					ref={videoRef}
					width={600}
					className="h-full w-full mx-auto"
					preload="metadata"
					onLoadedMetadata={handleLoadedMetadata}
					onTimeUpdate={handleTimeUpdate}
				>
					<source src={source} type="video/mp4" />
				</video>
			)}

			{videoRef.current && (
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
								{videoRef.current.paused ? (
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
								max={duration}
								step={0.1}
								value={[currentTime]}
								onValueChange={handleSliderChange}
							/>
						</VideoOverlayWrapper>
					</div>

					<VideoOverlayWrapper>{`Home: ${homeScore}`}</VideoOverlayWrapper>
					<VideoOverlayWrapper>{`Away: ${awayScore}`}</VideoOverlayWrapper>
				</div>
			)}
		</div>
	);
}
