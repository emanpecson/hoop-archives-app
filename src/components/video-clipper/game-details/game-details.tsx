import { CalendarIcon, FolderPenIcon, SwordsIcon } from "lucide-react";
import DashboardCard from "../../dashboard/dashboard-card";
import DashboardCardHeader from "../../dashboard/dashboard-card-header";
import { Input } from "../../ui/input";
import { GameDraft } from "@/types/model/game-draft";
import { TrimRequest } from "@/types/trim-request";
import CardButton from "../../card-button";
import { Player } from "@/types/model/player";
import Statboard from "./statboard";
import { useVideoClipperStore } from "@/hooks/use-video-clipper-store";
import { useMemo } from "react";

export default function GameDetails() {
	const draft = useVideoClipperStore((state) => state.draft);
	const setHomeScore = useVideoClipperStore((state) => state.setHomeScore);
	const setAwayScore = useVideoClipperStore((state) => state.setAwayScore);
	const setIsPreviewingClips = useVideoClipperStore(
		(state) => state.setIsPreviewingClips
	);
	const setCurrClipIndex = useVideoClipperStore(
		(state) => state.setCurrClipIndex
	);
	const setCurrentTime = useVideoClipperStore((state) => state.setCurrentTime);
	const videoRef = useVideoClipperStore((state) => state.videoRef);

	// prevent re-render from triggering unless draft changes
	const memoClips = useMemo(() => (draft ? draft.clipsDetails : []), [draft]);
	const memoHomePlayers = useMemo(() => (draft ? draft.home : []), [draft]);
	const memoAwayPlayers = useMemo(() => (draft ? draft.away : []), [draft]);

	const previewClips = (draft: GameDraft) => {
		const vid = videoRef.current;
		if (!vid) return;

		setIsPreviewingClips(true);
		setCurrClipIndex(0);

		setCurrentTime(draft.clipsDetails[0].startTime);
		vid.currentTime = draft.clipsDetails[0].startTime;
		vid.play();
	};

	const createVideoClips = async (draft: GameDraft) => {
		try {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_CLIPPER_URL}/video-clipper`,
				{
					method: "POST",
					body: JSON.stringify({
						key: draft.bucketKey,
						clips: draft.clipsDetails.map((cd) => ({
							start: cd.startTime,
							duration: cd.endTime - cd.startTime,
						})),
					} as TrimRequest),
				}
			);

			if (res.ok) {
				const clipUrls = await res.json();
				console.log("clip urls", clipUrls);
			} else {
				throw Error("Failed to complete game");
			}
		} catch (error) {
			console.log(error);
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
			<div>
				<h3 className="text-neutral-400">{label}</h3>
				<ul className="space-y-1">
					{players.map((p, i) => (
						<li
							className="text-neutral-400 flex place-items-center gap-2"
							key={i}
						>
							<div className="rounded-full h-6 w-6 bg-neutral-800" />
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
		<DashboardCard className="w-72 h-full space-y-4">
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
					<div className="divide-y divide-neutral-700 w-full">
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

			<hr className="text-neutral-700" />

			<Statboard
				label="Home Stats"
				clips={memoClips}
				players={memoHomePlayers}
				setTeamScore={setHomeScore}
			/>

			<hr className="text-neutral-700" />

			<Statboard
				label="Away Stats"
				clips={memoClips}
				players={memoAwayPlayers}
				setTeamScore={setAwayScore}
			/>

			<div className="space-y-2">
				<CardButton
					onClick={() => previewClips(draft!)}
					disabled={!draft || draft.clipsDetails.length === 0}
					className="text-center py-2"
				>
					Preview clips
				</CardButton>
				<CardButton
					onClick={() => createVideoClips(draft!)}
					disabled={!draft || draft.clipsDetails.length === 0}
					className="text-center py-2"
				>
					Complete game
				</CardButton>
			</div>
		</DashboardCard>
	);
}
