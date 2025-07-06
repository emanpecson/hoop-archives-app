"use client";

import CardButton from "@/components/card-button";
import { useVideoClipperStore } from "@/hooks/use-video-clipper-store";
import { cn } from "@/lib/utils";
import { ClipDraft } from "@/types/clip-draft";
import { ClipTag } from "@/types/enum/clip-tag";
import { useEffect, useState } from "react";
import EditClipDialog from "./edit-clip-dialog";
import { clipHeadline } from "@/utils/clip-headline";

interface ClipDraftCardProps {
	clip: ClipDraft;
	tags: ClipTag[];
	onPreview: () => void;
}

export default function ClipDraftCard(props: ClipDraftCardProps) {
	const currentTime = useVideoClipperStore((state) => state.currentTime);
	const [isWatching, setIsWatching] = useState(false);

	useEffect(() => {
		setIsWatching(
			props.clip.startTime <= currentTime && currentTime <= props.clip.endTime
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentTime]);

	return (
		<EditClipDialog clip={props.clip} onPreview={props.onPreview}>
			<CardButton className={cn(isWatching && "border-2 border-blue-400")}>
				<div className="text-neutral-400 max-w-[20rem]">
					<p className="text-wrap">{clipHeadline(props.clip)}</p>
					<div className="flex flex-wrap gap-x-1 text-blue-300">
						{props.tags.map((tag, i) => (
							<span key={i}>{tag}</span>
						))}
					</div>
				</div>
			</CardButton>
		</EditClipDialog>
	);
}
