"use client";

import { useEffect, useRef, useState } from "react";
import ClipController from "./clip-controller";
import ClipDetails from "./clip-details/clip-details";
import GameDetails from "./game-details";
import VideoController from "./video-controller/video-controller";
import VideoPlayer from "./video-player/video-player";
import { ClipTime } from "@/types/clip-time";
import { Draft } from "@/types/model/draft";

interface VideoClipperProps {
	filename: string;
}

export default function VideoClipper(props: VideoClipperProps) {
	const [draft, setDraft] = useState<Draft | null>(null);
	const [source, setSource] = useState<string | null>(null);
	const [clips, setClips] = useState<ClipTime[]>([]);
	const [duration, setDuration] = useState(0);
	const [currentTime, setCurrentTime] = useState(0);
	const videoRef = useRef<HTMLVideoElement>(null);

	const s3PresignedUrlEndpointBuilder = (
		filename: string,
		bucketMethod: "GET" | "PUT"
	) => {
		return `/api/s3/presigned-url?filename=${filename}&bucketMethod=${bucketMethod}`;
	};

	const setVideoSourceFromBucket = async (filename: string) => {
		const bucketMethod = "GET";

		try {
			const res = await fetch(
				s3PresignedUrlEndpointBuilder(filename, bucketMethod)
			);

			const { presignedUrl } = await res.json();
			setSource(presignedUrl);
		} catch (error) {
			console.log(error);
		}
	};

	const handleSliderChange = (value: number[]) => {
		setCurrentTime(value[0]);
		if (videoRef.current) {
			videoRef.current.currentTime = value[0];
		}
	};

	useEffect(() => {
		if (props.filename) {
			setVideoSourceFromBucket(props.filename);
		}
	}, [props.filename]);

	return (
		<div className="flex w-full h-full gap-dashboard">
			<div className="flex flex-col w-full h-full gap-dashboard">
				<div className="flex w-full gap-dashboard h-full min-h-0">
					<ClipDetails />
					{source && (
						<VideoPlayer
							videoRef={videoRef}
							src={source}
							currentTime={currentTime}
							duration={duration}
							setCurrentTime={setCurrentTime}
							setDuration={setDuration}
							onSliderChange={handleSliderChange}
						/>
					)}
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
