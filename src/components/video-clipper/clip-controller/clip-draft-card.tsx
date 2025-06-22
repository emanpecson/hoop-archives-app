"use client";

import CardButton from "@/components/card-button";
import ClipDetails from "@/components/clip-details";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { useVideoClipperStore } from "@/hooks/use-video-clipper-store";
import { cn } from "@/lib/utils";
import { ClipDraft } from "@/types/clip-draft";
import { ClipTag } from "@/types/enum/clip-tag";
import {
	ClipDraftFormFields,
	clipDraftSchema,
} from "@/types/schema/new-clip-form/clip-draft-schema";
import { buildClipDraft } from "@/utils/clip-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, ThumbsUpIcon, TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface ClipDraftCardProps {
	clip: ClipDraft;
	tags: ClipTag[];
	onPreview: () => void;
}

export default function ClipDraftCard(props: ClipDraftCardProps) {
	const {
		control,
		handleSubmit,
		watch,
		setValue,
		reset,
		formState: { errors },
	} = useForm<ClipDraftFormFields>({
		resolver: zodResolver(clipDraftSchema),
		defaultValues: props.clip.form,
	});

	const { draft, setDraft, unsortedClips, currentTime, sortClips } =
		useVideoClipperStore((state) => ({
			draft: state.draft,
			setDraft: state.setDraft,
			unsortedClips: state.unsortedClips,
			currentTime: state.currentTime,
			sortClips: state.sortClips,
		}));
	const [isOpen, setIsOpen] = useState(false);
	const [isWatching, setIsWatching] = useState(false);
	const isDirty = JSON.stringify(props.clip.form) !== JSON.stringify(watch());
	const clipIndex = unsortedClips.findIndex(
		(x) => x.startTime === props.clip.startTime
	);
	const clipEndpoint = `/api/ddb/game-drafts/clip-drafts?title=${
		draft!.title
	}&clipIndex=${clipIndex}`;

	useEffect(() => {
		setIsWatching(
			props.clip.startTime <= currentTime && currentTime <= props.clip.endTime
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentTime]);

	useEffect(() => {
		reset(props.clip.form);
	}, [props.clip, reset]);

	const previewClip = () => {
		setIsOpen(false);
		props.onPreview();
	};

	const deleteClip = async () => {
		try {
			const res = await fetch(clipEndpoint, { method: "DELETE" });

			if (res.ok) {
				const clips = draft!.clipDrafts;
				const updatedClips = clips.filter(
					(x) => x.startTime !== props.clip.startTime
				);
				setDraft({ ...draft!, clipDrafts: updatedClips });

				// TODO: notify
				console.log("Removed clip");
			} else {
				throw new Error("Error removing clip");
			}
		} catch (error) {
			// TODO: notify
			console.log(error);
		} finally {
			setIsOpen(false);
		}
	};

	const saveChanges = async () => {
		try {
			const updatedClip = buildClipDraft(
				{ ...watch(), highlightTime: props.clip.highlightTime },
				{
					start: props.clip.startTime,
					end: props.clip.endTime,
				}
			);

			const res = await fetch(clipEndpoint, {
				method: "PUT",
				body: JSON.stringify(updatedClip),
			});

			if (res.ok) {
				const updatedClips = [...draft!.clipDrafts];
				updatedClips[clipIndex] = updatedClip;
				setDraft({ ...draft!, clipDrafts: sortClips(updatedClips) });

				// TODO: notify
				console.log("Updated clip");
			} else {
				throw new Error("Error updating clip");
			}
		} catch (error) {
			// TODO: notify
			console.log(error);
		} finally {
			setIsOpen(false);
		}
	};

	const handleOpenChange = (open: boolean) => {
		if (!open) reset(props.clip.form);
		setIsOpen(open);
	};

	const clipHeadline = (clip: ClipDraft) => {
		if (clip.offense) {
			const scorer = `${clip.offense.playerScoring.firstName}`;
			const playmaker = clip.offense.playerAssisting
				? `${clip.offense.playerAssisting.firstName}`
				: undefined;
			const defenders = clip.offense.playersDefending.map(
				(p) => `${p.firstName}`
			);

			let headline = `${
				clip.teamBeneficiary ? `${clip.teamBeneficiary}:` : ""
			} ${scorer} scored ${clip.offense.pointsAdded} point(s)`;
			if (playmaker) {
				headline += `, assisted by ${playmaker}`;
			}
			if (defenders.length > 0) {
				headline += `, defended by ${defenders.join(", ")}`;
			}
			return headline;
		} else if (clip.defense) {
			const defender = `${clip.defense.playerDefending.firstName}`;
			const opponent = `${clip.defense.playerStopped.firstName}`;

			return `${defender} stopped ${opponent}`;
		}
		return "N/A";
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
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
			</DialogTrigger>

			<form onSubmit={handleSubmit(saveChanges)}>
				<DialogContent className="sm:max-w-2xl">
					<DialogHeader>
						<DialogTitle>Edit Clip</DialogTitle>
						<DialogDescription>
							Modify the clip details or remove the clip
						</DialogDescription>
					</DialogHeader>

					<ClipDetails
						control={control}
						watch={watch}
						setValue={setValue}
						errors={errors}
					/>

					{/* footer */}
					<DialogFooter>
						<Button variant="outline" onClick={deleteClip}>
							<TrashIcon />
							<span>Delete</span>
						</Button>

						<div className="flex space-x-2">
							<Button variant="outline" onClick={previewClip}>
								<EyeIcon />
								<span>Preview</span>
							</Button>
							<Button
								variant="outline"
								disabled={!isDirty}
								onClick={saveChanges}
							>
								<ThumbsUpIcon />
								<span>Save changes</span>
							</Button>
						</div>
					</DialogFooter>
				</DialogContent>
			</form>
		</Dialog>
	);
}
