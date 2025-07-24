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
import { Player } from "@/types/model/player";
import Statboard from "./statboard";
import { useVideoClipperStore } from "@/hooks/use-video-clipper-store";
import { useMemo } from "react";
import { NewGameRequestBody } from "@/types/api/new-game";
import { tempLeagueId } from "@/data/temp";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Game } from "@/types/model/game";
import { GameStatus } from "@/types/enum/game-status";
import { SqsClipRequest, SqsUploadRequest } from "@/types/api/sqs-message";
import { ClipDraft } from "@/types/clip-draft";
import { generateId } from "@/utils/generate-id";
import { Stats } from "@/types/model/stats";
import Image from "next/image";
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
						title: draft.title,
						type: draft.type,
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

	const ListPlayers = ({
		label,
		players,
	}: {
		label: string;
		players: Player[];
	}) => {
		return (
			<div className="space-y-2">
				<h3 className="text-neutral-400">{label}</h3>
				<ul className="space-y-1.5">
					{players.map((p, i) => (
						<li
							className="text-neutral-400 flex place-items-center gap-2"
							key={i}
						>
							<Image
								src={p.imageUrl}
								className="w-6 h-6 rounded-full object-cover"
								alt="headshot"
								width={24}
								height={24}
							/>
							<span>
								{p.firstName} {p.lastName}
							</span>
						</li>
					))}
				</ul>
			</div>
		);
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
				<CardButton>
					<div className="divide-y divide-neutral-800 w-full">
						<h3 className="pb-2 flex place-items-center gap-2">
							<SwordsIcon size={20} className="text-input-muted" />
							<span className="text-foreground font-medium">
								{draft ? draft.type : "Loading..."}
							</span>
						</h3>
						{draft && (
							<div className="space-y-2">
								<ListPlayers label="Home" players={draft.home} />
								<ListPlayers label="Away" players={draft.away} />
							</div>
						)}
					</div>
				</CardButton>
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
