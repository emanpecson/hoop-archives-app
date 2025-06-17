"use client";

import { useEffect, useState } from "react";
import ClipController from "./clip-controller/clip-controller";
import GameDetails from "./game-details/game-details";
import VideoController from "./video-controller/video-controller";
import VideoPlayer from "./video-player/video-player";
import { ClipTime } from "@/types/clip-time";
import NewClipDialog from "../new-clip/new-clip-dialog";
import { ClipDetails as ClipDetailsType } from "@/types/clip-details";
import { useVideoClipperStore } from "@/hooks/use-video-clipper-store";

interface VideoClipperProps {
	title: string;
}

export default function VideoClipper(props: VideoClipperProps) {
	const [newClipDialogOpen, setNewClipDialogOpen] = useState(false);

	const {
		draft,
		setDraft,
		fetchDraft,
		setClips,
		fetchSource,
		sortClips,
		videoRef,
		setIsPreviewingClips,
		setCurrClipIndex,
	} = useVideoClipperStore((state) => ({
		draft: state.draft,
		setDraft: state.setDraft,
		fetchDraft: state.fetchDraft,
		setClips: state.setClips,
		fetchSource: state.fetchSource,
		sortClips: state.sortClips,
		videoRef: state.videoRef,
		isPreviewingClips: state.isPreviewingClips,
		setIsPreviewingClips: state.setIsPreviewingClips,
		setCurrClipIndex: state.setCurrClipIndex,
	}));

	// for defining further clip details
	const [newClipTime, setNewClipTime] = useState<ClipTime | null>(null);

	const handleClipTime = (clipTime: ClipTime) => {
		setNewClipTime(clipTime);
		setNewClipDialogOpen(true);
	};

	const handleClipCreate = (newClip: ClipDetailsType) => {
		const sortedClips = sortClips([...draft!.clipsDetails, newClip]);
		setDraft({ ...draft!, clipsDetails: sortedClips });
		setClips(sortedClips);
		setNewClipTime(null);
	};

	const playClip = (i: number) => {
		const vid = videoRef.current;
		if (!vid) return;

		setCurrClipIndex(i);
		setIsPreviewingClips(true);

		const clip = draft!.clipsDetails[i];
		vid.currentTime = clip.startTime;
		vid.play();
	};

	useEffect(() => {
		if (props.title) fetchDraft(props.title);
	}, [props.title, fetchDraft]);

	useEffect(() => {
		if (draft) fetchSource(draft.bucketKey);
	}, [draft, fetchSource]);

	return (
		<>
			<div className="flex w-full h-full gap-dashboard">
				<div className="flex flex-col w-full h-full gap-dashboard min-w-0">
					<div className="flex w-full gap-dashboard h-full min-h-0">
						<VideoPlayer playClip={playClip} />
					</div>
					<div className="h-fit flex flex-col gap-dashboard">
						{draft && <VideoController onClipTime={handleClipTime} />}
						<ClipController onPreviewClips={playClip} />
					</div>
				</div>
				<GameDetails draft={draft} />
			</div>

			{newClipTime && draft && (
				<NewClipDialog
					open={newClipDialogOpen}
					clipTime={newClipTime}
					onClipCreate={handleClipCreate}
					onClose={setNewClipDialogOpen}
				/>
			)}
		</>
	);
}
