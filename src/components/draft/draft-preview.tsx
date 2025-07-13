import { Draft } from "@/types/model/draft";
import { displayPlayers } from "@/utils/player-info";
import { XIcon } from "lucide-react";
import Link from "next/link";
import ConfirmDialog from "../confirm-dialog";
import { useState } from "react";
import { toast } from "sonner";

interface DraftPreviewProps {
	leagueId: string;
	draft: Draft;
	onDelete: () => void;
}

export default function DraftPreview(props: DraftPreviewProps) {
	const url = `/${props.draft.leagueId}/draft/${props.draft.draftId}`;

	const [isDeleting, setIsDeleting] = useState(false);

	const deleteDraft = async () => {
		try {
			setIsDeleting(true);

			// delete draft object in ddb
			await fetch(`/api/ddb/${props.leagueId}/drafts/${props.draft.draftId}`, {
				method: "DELETE",
			});

			// delete video file in s3
			await fetch(`/api/s3/delete?key=${props.draft.bucketKey}`, {
				method: "DELETE",
			});

			props.onDelete();
		} catch (error) {
			console.log(error);
			toast.error("Failed to delete draft");
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<div className="space-y-1.5">
			<div className="font-semibold text-center text-sm">
				{isDeleting ? (
					<p>{`Deleting ${props.draft.title}`}</p>
				) : (
					<Link className="hover:underline" href={url}>
						{props.draft.title}
					</Link>
				)}
			</div>

			<div className="flex justify-center place-items-center space-x-2.5">
				<span className="text-xs text-neutral-400">
					{new Date(props.draft.date).toLocaleDateString()}
				</span>

				<ConfirmDialog onConfirm={deleteDraft}>
					<button className="p-0.5 bg-neutral-800 rounded-full cursor-pointer">
						<XIcon size={16} strokeWidth={1.5} className="text-neutral-400" />
					</button>
				</ConfirmDialog>
			</div>

			<div className="flex flex-col place-items-center text-neutral-400">
				<p className="text-xs">{displayPlayers(props.draft.home)}</p>
				<p className="text-xs">{displayPlayers(props.draft.away)}</p>
			</div>
		</div>
	);
}
