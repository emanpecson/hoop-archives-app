import { FolderPenIcon } from "lucide-react";
import DashboardCard from "../dashboard/dashboard-card";
import DashboardCardHeader from "../dashboard/dashboard-card-header";
import { Input } from "../ui/input";
import DateInput from "../input/date-input";
import { Button } from "../ui/button";
import { GameDraft } from "@/types/model/game-draft";
import { TrimRequest } from "@/types/trim-request";

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

	return (
		<DashboardCard className="w-72 h-full space-y-2">
			<DashboardCardHeader text="Game Details" />
			<Input Icon={FolderPenIcon} placeholder="Enter game title..." />
			<DateInput />

			<hr className="opacity-25" />
			<Button
				onClick={() => createVideoClips(props.draft!)}
				disabled={!props.draft || props.draft.clipsDetails.length === 0}
			>
				Complete game
			</Button>
		</DashboardCard>
	);
}
