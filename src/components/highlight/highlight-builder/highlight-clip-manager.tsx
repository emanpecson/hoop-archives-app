"use client";

import DashboardCard from "@/components/dashboard/dashboard-card";
import DashboardCardHeader from "@/components/dashboard/dashboard-card-header";
import NewReelDialog from "@/components/new-reel/new-reel-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SqsReelRequest } from "@/types/api/sqs-message";
import { UploadStatus } from "@/types/enum/upload-status";
import { Clip } from "@/types/model/clip";
import { Reel } from "@/types/model/reel";
import { ReelDetailsFormFields } from "@/types/schema/new-reel-form/reel-details-schema";
import { generateId } from "@/utils/generate-id";
import { CircleCheckIcon, FilterIcon, XIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";

interface HighlightClipManagerProps {
	activeClipId: string | null;
	leagueId: string;
	selectedClips: Clip[];
	setSelectedClips: Dispatch<SetStateAction<Clip[]>>;
	onAddFiltersOpen: (open: boolean) => void;
}

export default function HighlightClipManager(props: HighlightClipManagerProps) {
	const [newReelDialogOpen, setNewReelDialogOpen] = useState(false);

	const { data: session } = useSession();
	const router = useRouter();
	const highlightsUrl = `/league/${props.leagueId}/highlight-reel`;

	const removeClip = (removeClip: Clip) => {
		props.setSelectedClips((clips) =>
			clips.filter((clip) => clip.clipId !== removeClip.clipId)
		);
	};

	const uploadClipsAsReel = async (reelDetails: ReelDetailsFormFields) => {
		try {
			if (session) {
				const reelId = generateId("reel");

				const createReelResponse = await fetch(
					`/api/ddb/${props.leagueId}/reels`,
					{
						method: "POST",
						body: JSON.stringify({
							reel: {
								title: reelDetails.title,
								leagueId: props.leagueId,
								reelId,
								status: UploadStatus.PENDING,
								created: new Date(),
								uploaderUserId: session.user.id,
							} as Reel,
						}),
					}
				);

				if (createReelResponse.ok) {
					// send SQS message (reel upload request)
					const enqueueResponse = await fetch("/api/sqs/reel-upload", {
						method: "POST",
						body: JSON.stringify({
							leagueId: props.leagueId,
							reelId,
							clipKeys: props.selectedClips.map((clip) => clip.bucketKey),
						} as SqsReelRequest),
					});

					if (enqueueResponse.ok) {
						toast.success(
							`${reelDetails.title} upload initiated. This may take a few minutes.`
						);
						router.push(highlightsUrl);
					} else {
						throw Error("Failed to queue upload");
					}
				} else {
					throw Error("Failed to create reel");
				}
			} else {
				toast.error("Unauthenticated");
			}
		} catch (error) {
			console.log(error);
			toast.error(error instanceof Error ? error.message : "Unknown error");
		}
	};

	return (
		<>
			<DashboardCard className="w-[16rem] space-y-4 flex flex-col justify-between h-full">
				<div className="space-y-1 h-full overflow-y-auto ">
					<DashboardCardHeader text="Selected clips" />
					<ul className="space-y-2">
						{props.selectedClips.length > 0 ? (
							props.selectedClips.map((clip, i) => {
								const playing =
									props.activeClipId && props.activeClipId === clip.clipId;
								return (
									<li
										className={cn(
											playing && "bg-blue-500/10 text-blue-400",
											"px-2.5 py-0.5 rounded-lg text-sm flex space-x-2 place-items-center"
										)}
										key={i}
									>
										<Button
											onClick={() => removeClip(clip)}
											variant="ghost"
											size="icon"
											className="rounded-full size-6"
										>
											<XIcon />
										</Button>
										<span>{clip.clipId}</span>
									</li>
								);
							})
						) : (
							<p className="text-neutral-600 text-sm">No selected clips</p>
						)}
					</ul>
				</div>

				<hr className="text-neutral-800" />

				<div className="space-y-2">
					<Button variant="input" onClick={() => props.onAddFiltersOpen(true)}>
						<FilterIcon />
						<span>Filters</span>
					</Button>

					<Button
						disabled={props.selectedClips.length === 0}
						variant="input"
						onClick={() => setNewReelDialogOpen(true)}
					>
						<CircleCheckIcon />
						<span>Complete</span>
					</Button>
				</div>
			</DashboardCard>

			<NewReelDialog
				open={newReelDialogOpen}
				setOpen={setNewReelDialogOpen}
				onSubmit={uploadClipsAsReel}
			/>
		</>
	);
}
