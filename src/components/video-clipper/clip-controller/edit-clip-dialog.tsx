import ClipDetails from "@/components/clip-details";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { tempLeagueId } from "@/data/temp";
import { useVideoClipperStore } from "@/hooks/use-video-clipper-store";
import { ClipDraft } from "@/types/clip-draft";
import {
	ClipDraftFormFields,
	clipDraftSchema,
} from "@/types/schema/new-clip-form/clip-draft-schema";
import { buildClipDraft } from "@/utils/clip-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, ThumbsUpIcon, TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface EditClipDialogProps {
	children: React.ReactNode;
	clip: ClipDraft;
	onPreview: () => void;
}

export default function EditClipDialog(props: EditClipDialogProps) {
	const {
		control,
		handleSubmit,
		watch,
		setValue,
		reset,
		unregister,
		formState: { errors },
	} = useForm<ClipDraftFormFields>({
		resolver: zodResolver(clipDraftSchema),
		defaultValues: props.clip.form,
	});

	const { draft, setDraft, unsortedClips, sortClips } = useVideoClipperStore(
		(state) => ({
			draft: state.draft,
			setDraft: state.setDraft,
			unsortedClips: state.unsortedClips,
			currentTime: state.currentTime,
			sortClips: state.sortClips,
		})
	);

	const [isOpen, setIsOpen] = useState(false);
	const isDirty = JSON.stringify(props.clip.form) !== JSON.stringify(watch());
	const clipIndex = unsortedClips.findIndex(
		(x) => x.startTime === props.clip.startTime
	);
	const clipEndpoint = `/api/ddb/${tempLeagueId}/drafts/${
		draft!.title
	}/clip-drafts?clipIndex=${clipIndex}`;

	const onSubmit = handleSubmit(
		(data) => saveChanges(data),
		(errors) => console.log("Error:", errors)
	);

	const saveChanges = async (clipData: ClipDraftFormFields) => {
		try {
			const updatedClip = buildClipDraft(
				{ ...clipData, highlightTime: props.clip.highlightTime },
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

				toast.success("Clip updated");
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

	useEffect(() => {
		reset(props.clip.form);
	}, [props.clip, reset]);

	return (
		<Dialog open={isOpen} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>{props.children}</DialogTrigger>

			<form onSubmit={onSubmit}>
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
						unregister={unregister}
					/>

					{/* footer */}
					<DialogFooter>
						<Button variant="outline" onClick={deleteClip} type="button">
							<TrashIcon />
							<span>Delete</span>
						</Button>

						<div className="flex space-x-2">
							<DialogClose asChild>
								<Button
									variant="outline"
									type="button"
									onClick={props.onPreview}
								>
									<EyeIcon />
									<span>Preview</span>
								</Button>
							</DialogClose>
							<Button
								variant="outline"
								disabled={!isDirty}
								onClick={onSubmit}
								type="submit"
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
