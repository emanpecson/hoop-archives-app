"use client";

import {
	CalendarIcon,
	FolderPenIcon,
	Loader2Icon,
	SwordsIcon,
} from "lucide-react";
import DashboardCard from "../../dashboard/dashboard-card";
import DashboardCardHeader from "../../dashboard/dashboard-card-header";
import { Input } from "../../ui/input";
import { Draft } from "@/types/model/draft";
import CardButton from "../../card-button";
import Statboard from "./statboard";
import { useVideoClipperStore } from "@/hooks/use-video-clipper-store";
import { useMemo } from "react";
import { NewGameRequestBody } from "@/types/api/new-game";
import { tempLeagueId } from "@/data/temp";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Game, PlayTimestamp } from "@/types/model/game";
import { GameStatus } from "@/types/enum/game-status";
import { SqsClipRequest, SqsUploadRequest } from "@/types/api/sqs-message";
import { ClipDraft } from "@/types/clip-draft";
import { generateId } from "@/utils/generate-id";
import { Stats } from "@/types/model/stats";
import ConfirmDialog from "@/components/confirm-dialog";

export default function GameDetails() {
	const router = useRouter();
	const draft = useVideoClipperStore((state) => state.draft);
	const previewClips = useVideoClipperStore((state) => state.previewClips);
	const homeStats = useVideoClipperStore((state) => state.homeStats);
	const awayStats = useVideoClipperStore((state) => state.awayStats);
	const clipIndex = useVideoClipperStore((state) => state.clipIndex);

	// prevent re-render from triggering unless draft changes
	const memoClips = useMemo(() => (draft ? draft.clipDrafts : []), [draft]);
	const memoHomePlayers = useMemo(() => (draft ? draft.home : []), [draft]);
	const memoAwayPlayers = useMemo(() => (draft ? draft.away : []), [draft]);

	// convert clip global timestamps into timestamps relative to the
	// concatenated clips as a whole
	const calculatePlayTimestmaps = (draft: Draft) => {
		const playTimestamps: PlayTimestamp[] = [];

		let concatTime = 0; // concatenated time of all clips
		for (const clip of draft.clipDrafts) {
			const duration = clip.endTime - clip.startTime;

			if (clip.offense) {
				// calculate time it takes to reach the highlight timestamp
				// in relation to the overall video
				const relativeHighlightTime = clip.highlightTime - clip.startTime;
				const concatHighlightTime = concatTime + relativeHighlightTime;

				playTimestamps.push({
					player: clip.offense.playerScoring,
					pointsAdded: clip.offense.pointsAdded,
					teamBeneficiary: clip.teamBeneficiary,
					time: concatHighlightTime,
				});
			}

			concatTime += duration;
		}

		console.log(playTimestamps);
		return playTimestamps;
	};

	const startUpload = async (draft: Draft) => {
		try {
			// create Game
			const gameId = generateId("game");
			const createGameResponse = await fetch(`/api/ddb/${tempLeagueId}/games`, {
				method: "POST",
				body: JSON.stringify({
					game: {
						leagueId: tempLeagueId,
						gameId,
						home: draft.home,
						away: draft.away,
						date: new Date(draft.date),
						created: new Date(),
						title: draft.title,
						type: draft.type,
						playTimestamps: calculatePlayTimestmaps(draft),
						status: GameStatus.PENDING,
						stats: homeStats
							.concat(awayStats)
							.map((stat) => ({ ...stat, gameId })) as Stats[],
					} as Game,
				} as NewGameRequestBody),
			});

			if (createGameResponse.ok) {
				// send SQS message (upload request)
				await fetch(`/api/sqs/send-message`, {
					method: "POST",
					body: JSON.stringify({
						leagueId: tempLeagueId,
						gameId,
						key: draft.bucketKey,
						date: new Date(draft.date),
						clipRequests: draft.clipDrafts.map(
							(clip: ClipDraft) =>
								({
									clipId: generateId("clip"),
									tags: clip.tags,
									startTime: clip.startTime,
									endTime: clip.endTime,
									highlightTime: clip.highlightTime,
									teamBeneficiary: clip.teamBeneficiary,
									offense: clip.offense,
									defense: clip.defense,
								} as SqsClipRequest)
						),
					} as SqsUploadRequest),
				});

				toast.success(
					`${draft.title} upload initiated. This may take a few minutes.`
				);
				router.push(`/league/${tempLeagueId}`); // games dashboard
			} else {
				throw Error("Failed to create game");
			}
		} catch (error) {
			console.log(error);
			toast.error(error instanceof Error ? error.message : "Unknown error");
		}
	};

	return (
		<DashboardCard className="w-72 h-full space-y-4 overflow-y-auto">
			<DashboardCardHeader text="Game Details" />

			<div className="space-y-2">
				<Input
					readOnly
					Icon={FolderPenIcon}
					value={draft ? draft.title : "Loading..."}
					className="pointer-events-none"
				/>
				<Input
					readOnly
					Icon={CalendarIcon}
					value={
						draft ? new Date(draft.date).toLocaleDateString() : "Loading..."
					}
					className="pointer-events-none"
				/>
				<Input
					readOnly
					Icon={SwordsIcon}
					value={draft ? draft.type : "Loading..."}
					className="pointer-events-none"
				/>
			</div>

			<hr className="text-neutral-800" />

			<Statboard
				label="Home Stats"
				clips={memoClips}
				players={memoHomePlayers}
			/>

			<hr className="text-neutral-800" />

			<Statboard
				label="Away Stats"
				clips={memoClips}
				players={memoAwayPlayers}
			/>

			<div className="space-y-2">
				<CardButton
					onClick={() => previewClips(0)}
					disabled={!draft || draft.clipDrafts.length === 0}
					className="text-center py-2 flex justify-center place-items-center space-x-2"
				>
					{clipIndex !== null && clipIndex >= 0 && (
						<Loader2Icon className="animate-spin" size={16} strokeWidth={1.5} />
					)}
					<span>Preview clips</span>
				</CardButton>
				<ConfirmDialog onConfirm={() => startUpload(draft!)}>
					<CardButton
						disabled={!draft || draft.clipDrafts.length === 0}
						className="text-center py-2"
					>
						Complete game
					</CardButton>
				</ConfirmDialog>
			</div>
		</DashboardCard>
	);
}
