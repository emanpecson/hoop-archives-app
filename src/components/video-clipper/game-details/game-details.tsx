import { CalendarIcon, FolderPenIcon, SwordsIcon } from "lucide-react";
import DashboardCard from "../../dashboard/dashboard-card";
import DashboardCardHeader from "../../dashboard/dashboard-card-header";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { GameDraft } from "@/types/model/game-draft";
import { TrimRequest } from "@/types/trim-request";
import CardButton from "../../card-button";
import { Player } from "@/types/model/player";
import Statboard from "./statboard";

interface GameDetailsProps {
	draft: GameDraft | null;
}

export default function GameDetails(props: GameDetailsProps) {
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
					value={props.draft ? props.draft.title : "Loading..."}
					className="pointer-events-none"
				/>
				<Input
					readOnly
					Icon={CalendarIcon}
					value={
						props.draft
							? new Date(props.draft.date).toLocaleDateString()
							: "Loading..."
					}
					className="pointer-events-none"
				/>
				<CardButton>
					<div className="divide-y divide-neutral-700 w-full">
						<h3 className="pb-2 flex place-items-center gap-2">
							<SwordsIcon size={20} className="text-input-muted" />
							<span className="text-foreground font-medium">
								{props.draft ? props.draft.type : "Loading..."}
							</span>
						</h3>
						{props.draft && (
							<div className="space-y-2">
								<ListPlayers label="Home" players={props.draft.home} />
								<ListPlayers label="Away" players={props.draft.away} />
							</div>
						)}
					</div>
				</CardButton>
			</div>

			<hr className="text-neutral-700" />

			<Statboard
				label="Home Stats"
				clips={props.draft ? props.draft.clipsDetails : []}
				players={props.draft ? props.draft.home : []}
			/>

			<hr className="text-neutral-700" />

			<Statboard
				label="Away Stats"
				clips={props.draft ? props.draft.clipsDetails : []}
				players={props.draft ? props.draft.away : []}
			/>

			<Button
				onClick={() => createVideoClips(props.draft!)}
				disabled={!props.draft || props.draft.clipsDetails.length === 0}
			>
				Complete game
			</Button>
		</DashboardCard>
	);
}
