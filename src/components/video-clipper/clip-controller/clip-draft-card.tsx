"use client";

import CardButton from "@/components/card-button";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { useVideoClipperStore } from "@/hooks/use-video-clipper-store";
import { cn } from "@/lib/utils";
import { ClipDraft } from "@/types/clip-draft";
import { ClipTag } from "@/types/enum/clip-tag";
import { useEffect, useState } from "react";

interface ClipDraftCardProps {
	clip: ClipDraft;
	headline: string;
	tags: ClipTag[];
	onPreview: () => void;
}

export default function ClipDraftCard(props: ClipDraftCardProps) {
	const draft = useVideoClipperStore((state) => state.draft!);
	const setDraft = useVideoClipperStore((state) => state.setDraft);
	const currentTime = useVideoClipperStore((state) => state.currentTime);
	const [isOpen, setIsOpen] = useState(false);
	const [isActive, setIsActive] = useState(false);

	useEffect(() => {
		setIsActive(
			props.clip.startTime <= currentTime && currentTime <= props.clip.endTime
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentTime]);

	const handlePreview = () => {
		setIsOpen(false);
		props.onPreview();
	};

	// TODO: have to update db draft
	const handleDelete = () => {
		const clips = draft.clipDrafts;
		const updatedClips = clips.filter(
			(x) => x.startTime !== props.clip.startTime
		);
		setDraft({ ...draft!, clipDrafts: updatedClips });
		setIsOpen(false);
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<CardButton className={cn(isActive && "border-2 border-blue-400")}>
					<div className="text-neutral-400 max-w-[20rem]">
						<p className="text-wrap">{props.headline}</p>
						<div className="flex flex-wrap gap-x-1 text-blue-300">
							{props.tags.map((tag, i) => (
								<span key={i}>{tag}</span>
							))}
						</div>
					</div>
				</CardButton>
			</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit Clip</DialogTitle>
					<DialogDescription>
						Modify the clip details or remove the clip
					</DialogDescription>
				</DialogHeader>

				<Button onClick={handlePreview}>Preview</Button>
				<Button onClick={handleDelete}>Delete</Button>
			</DialogContent>
		</Dialog>
	);
}
