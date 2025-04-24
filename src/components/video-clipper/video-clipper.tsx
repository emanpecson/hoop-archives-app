"use client";

import { useRef, useState } from "react";
import Timeline from "./timeline";
import { ClipTime } from "@/types/clip-time";
import ClipManager from "./clip-manager";
import ClipSetter from "./clip-setter";

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

	const handleLoadedMetadata = () => {
		if (videoRef.current) {
			setDuration(videoRef.current.duration);
		}
	};

	const handleTimeUpdate = () => {
		if (videoRef.current) {
			setCurrentTime(videoRef.current.currentTime);
		}
	};

	const handlePlayPause = () => {
		if (videoRef.current) {
			if (videoRef.current.paused) videoRef.current.play();
			else videoRef.current.pause();
		}
	};

	const handleDelete = (index: number) => {
		setClips((og) => og.filter((_clip, i) => i !== index));
	};

	return (
		<div className="w-full max-w-2xl mx-auto space-y-4">
			<video
				ref={videoRef}
				width={600}
				// controls
				className="w-full"
				preload="metadata"
				onLoadedMetadata={handleLoadedMetadata}
				onTimeUpdate={handleTimeUpdate}
				onError={() => console.error("Video failed")}
			>
				<source src={props.src} type="video/mp4" />
			</video>

			<button className="rounded-lg border" onClick={handlePlayPause}>
				Toggle play
			</button>

			<Timeline
				clips={clips}
				currentTime={currentTime}
				duration={duration}
				onSliderChange={handleSliderChange}
			/>

			<div className="text-sm text-right">
				Current: {currentTime.toFixed(2)}s / {duration.toFixed(2)}s
			</div>

			<ClipSetter clips={clips} currentTime={currentTime} setClips={setClips} />

			<ClipManager clips={clips} handleDelete={handleDelete} />
		</div>
	);
}
