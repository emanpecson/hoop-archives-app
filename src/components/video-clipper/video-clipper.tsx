"use client";

import { useEffect, useRef, useState } from "react";
import ClipController from "./clip-controller";
import ClipDetails from "./clip-details/clip-details";
import GameDetails from "./game-details";
import VideoController from "./video-controller/video-controller";
import VideoPlayer from "./video-player/video-player";
import { ClipTime } from "@/types/clip-time";
import { GameDraft } from "@/types/model/game-draft";
import NewClipDialog from "../new-clip/new-clip-dialog";
import { ClipDetails as ClipDetailsType } from "@/types/clip-details";

interface VideoClipperProps {
	title: string;
}

export default function VideoClipper(props: VideoClipperProps) {
	const [newClipDialogOpen, setNewClipDialogOpen] = useState(false);
	const [draft, setDraft] = useState<GameDraft | null>(null);
	const [source, setSource] = useState<string | null>(null);
	const [duration, setDuration] = useState(0);
	const [currentTime, setCurrentTime] = useState(0);
	const videoRef = useRef<HTMLVideoElement>(null);

	// for defining further clip details
	const [newClipTime, setNewClipTime] = useState<ClipTime | null>(null);

	const s3PresignedUrlEndpointBuilder = (
		key: string,
		bucketMethod: "GET" | "PUT"
	) => {
		return `/api/s3/presigned-url?key=${key}&bucketMethod=${bucketMethod}`;
	};

	const getVideoSource = async (title: string) => {
		try {
			const res = await fetch(s3PresignedUrlEndpointBuilder(title, "GET"));
			const { presignedUrl } = await res.json();
			setSource(presignedUrl);
		} catch (error) {
			console.log(error); //  TODO: notify
		}
	};

	const getDraft = async (title: string) => {
		try {
			const res = await fetch(`/api/ddb/game-drafts?title=${title}`);
			const data = await res.json();
			console.log("draft data:", data);
			setDraft(data);
		} catch (error) {
			console.log(error); // TODO: notify
		}
	};

	const handleSliderChange = (value: number[]) => {
		setCurrentTime(value[0]);
		if (videoRef.current) {
			videoRef.current.currentTime = value[0];
		}
	};

	const handleClipTime = (clipTime: ClipTime) => {
		setNewClipTime(clipTime);
		setNewClipDialogOpen(true);
	};

	const handleClipCreate = (newClip: ClipDetailsType) => {
		setDraft((prevDraft) => ({
			...prevDraft!,
			clipsDetails: [...prevDraft!.clipsDetails, newClip],
		}));
		setNewClipTime(null);
	};

	useEffect(() => {
		if (props.title) {
			getVideoSource(props.title);
			getDraft(props.title);
		}
	}, [props.title]);

	return (
		<>
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
						{draft && source && (
							<VideoController
								clips={draft.clipsDetails}
								videoRef={videoRef}
								currentTime={currentTime}
								duration={duration}
								onSliderChange={handleSliderChange}
								draft={draft}
								onClipTime={handleClipTime}
							/>
						)}
						<ClipController />
					</div>
				</div>
				<GameDetails />
			</div>

			{newClipTime && source && draft && (
				<NewClipDialog
					open={newClipDialogOpen}
					clipTime={newClipTime}
					videoSource={source}
					draft={draft}
					onClipCreate={handleClipCreate}
					onClose={setNewClipDialogOpen}
				/>
			)}
		</>
	);
}
