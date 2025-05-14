"use client";

import { useEffect, useRef, useState } from "react";
import ClipController from "./clip-controller";
import ClipDetails from "./clip-details/clip-details";
import GameDetails from "./game-details/game-details";
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
	const [previewClipsIsActive, setPreviewClipsIsActive] = useState(false);
	const [currClipIndex, setCurrClipIndex] = useState<number | null>(null);
	const videoRef = useRef<HTMLVideoElement>(null);

	// for defining further clip details
	const [newClipTime, setNewClipTime] = useState<ClipTime | null>(null);

	const s3PresignedUrlEndpointBuilder = (
		key: string,
		bucketMethod: "GET" | "PUT"
	) => {
		return `/api/s3/presigned-url?key=${key}&bucketMethod=${bucketMethod}`;
	};

	const getVideoSource = async (key: string) => {
		try {
			const res = await fetch(s3PresignedUrlEndpointBuilder(key, "GET"));
			const { presignedUrl } = await res.json();
			console.log("source:", presignedUrl);
			setSource(presignedUrl);
		} catch (error) {
			console.log(error); //  TODO: notify
		}
	};

	const getDraft = async (title: string) => {
		try {
			const res = await fetch(`/api/ddb/game-drafts?title=${title}`);
			const data = (await res.json()) as GameDraft;
			console.log("draft data:", data);
			setDraft({ ...data, clipsDetails: sortClips(data.clipsDetails) });
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
		setDraft((prevDraft) => {
			const clips = sortClips([...prevDraft!.clipsDetails, newClip]);
			return {
				...prevDraft!,
				clipsDetails: clips,
			};
		});
		setNewClipTime(null);
	};

	const playClip = (i: number) => {
		const vid = videoRef.current;
		if (!vid) return;

		setCurrClipIndex(i);
		setPreviewClipsIsActive(true);

		const clip = draft!.clipsDetails[i];
		vid.currentTime = clip.startTime;
		vid.play();
	};

	const sortClips = (clips: ClipDetailsType[]) => {
		// shallow copy w/ slice (to avoid mutating og array)
		return clips.slice().sort((a, b) => a.startTime - b.endTime);
	};

	useEffect(() => {
		if (props.title) {
			getDraft(props.title);
		}
	}, [props.title]);

	useEffect(() => {
		if (draft) {
			getVideoSource(draft.bucketKey);
		}
	}, [draft]);
	return (
		<>
			<div className="flex w-full h-full gap-dashboard">
				<div className="flex flex-col w-full h-full gap-dashboard">
					<div className="flex w-full gap-dashboard h-full min-h-0">
						<ClipDetails draft={draft} />
						{source && (
							<VideoPlayer
								videoRef={videoRef}
								src={source}
								currentTime={currentTime}
								duration={duration}
								setCurrentTime={setCurrentTime}
								setDuration={setDuration}
								onSliderChange={handleSliderChange}
								clips={draft ? draft.clipsDetails : []}
								previewClipsIsActive={previewClipsIsActive}
								setPreviewClipsIsActive={setPreviewClipsIsActive}
								playClip={playClip}
								currClipIndex={currClipIndex}
								setCurrClipIndex={setCurrClipIndex}
							/>
						)}
					</div>
					<div className="h-fit flex flex-col gap-dashboard">
						{draft && source && (
							<VideoController
								videoRef={videoRef}
								currentTime={currentTime}
								duration={duration}
								onSliderChange={handleSliderChange}
								draft={draft}
								onClipTime={handleClipTime}
							/>
						)}
						<ClipController
							clips={draft ? draft.clipsDetails : []}
							currentTime={currentTime}
							duration={duration}
							videoRef={videoRef}
							onPreviewClips={playClip}
						/>
					</div>
				</div>
				<GameDetails draft={draft} />
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
