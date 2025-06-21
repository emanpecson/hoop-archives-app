"use client";

import { useState } from "react";
import VideoOverlayWrapper from "./overlay/video-overlay-wrapper";
import { cn } from "@/lib/utils";
import { useVideoClipperStore } from "@/hooks/use-video-clipper-store";
import VideoOverlayController from "./overlay/video-overlay-controller";
import VideoOverlaySlider from "./overlay/video-overlay-slider";

export default function VideoPlayer() {
	const draft = useVideoClipperStore((state) => state.draft);
	const duration = useVideoClipperStore((state) => state.duration);
	const setDuration = useVideoClipperStore((state) => state.setDuration);
	const currentTime = useVideoClipperStore((state) => state.currentTime);
	const setCurrentTime = useVideoClipperStore((state) => state.setCurrentTime);
	const videoRef = useVideoClipperStore((state) => state.videoRef);
	const source = useVideoClipperStore((state) => state.source);
	const homeScore = useVideoClipperStore((state) => state.homeScore);
	const awayScore = useVideoClipperStore((state) => state.awayScore);
	const clipIndex = useVideoClipperStore((state) => state.clipIndex);
	const setClipIndex = useVideoClipperStore((state) => state.setClipIndex);
	const previewClips = useVideoClipperStore((state) => state.previewClips);

	const [showOverlayController, setShowOverlayController] = useState(false);

	const handleLoadedMetadata = () => {
		if (videoRef.current) {
			setDuration(videoRef.current.duration);
		}
	};

	const handleTimeUpdate = () => {
		if (videoRef.current) {
			const vid = videoRef.current;
			setCurrentTime(vid.currentTime);

			if (clipIndex !== null && draft) {
				const clips = draft.clipDrafts;
				const clip = clips[clipIndex];

				// @ end of curr clip, play next clip
				if (vid.currentTime >= clip.endTime) {
					const nextIndex = clipIndex + 1;

					if (nextIndex < clips.length) {
						previewClips(nextIndex);
					} else {
						vid.pause();
						setClipIndex(null);
					}
				}
			}
		}
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

					<VideoOverlayWrapper>{`Home: ${homeScore}`}</VideoOverlayWrapper>
					<VideoOverlayWrapper>{`Away: ${awayScore}`}</VideoOverlayWrapper>
				</div>
			)}
		</div>
	);
}
