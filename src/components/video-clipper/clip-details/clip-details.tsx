import { SearchIcon } from "lucide-react";
import DashboardCard from "../../dashboard/dashboard-card";
import DashboardCardHeader from "../../dashboard/dashboard-card-header";
import { Input } from "../../ui/input";
import ClipDetailsCard from "./clip-details-card";
import ScoreDivider from "./score-divider";
import { GameDraft } from "@/types/model/game-draft";
import { ClipDetails as ClipDetailsType } from "@/types/clip-details";
import { ClipTag } from "@/types/enum/clip-tag";

interface ClipDetailsProps {
	draft: GameDraft | null;
}

export default function ClipDetails(props: ClipDetailsProps) {
	const clipHeadline = (clip: ClipDetailsType) => {
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

	const sortClips = (clips: ClipDetailsType[]) => {
		// shallow copy w/ slice (to avoid mutating og array)
		return clips.slice().sort((a, b) => a.startTime - b.endTime);
	};

	return (
		<DashboardCard className="w-72 h-full space-y-4 flex flex-col">
			<DashboardCardHeader text="Clip Details" />
			<Input Icon={SearchIcon} placeholder="Search clip..." />

			<div className="grow overflow-y-scroll space-y-4">
				{props.draft ? (
					(() => {
						let homeScore = 0;
						let awayScore = 0;

						return sortClips(props.draft!.clipsDetails).map((clip, i) => {
							if (clip.offense) {
								if (clip.teamBeneficiary === "home") {
									homeScore += clip.offense.pointsAdded;
								} else {
									awayScore += clip.offense.pointsAdded;
								}
							}

							const scoreboard = `${homeScore}-${awayScore}`;
							return (
								<div key={i} className="space-y-4">
									<ClipDetailsCard
										headline={clipHeadline(clip)}
										tags={clip.tags as ClipTag[]}
									/>
									{clip.offense && <ScoreDivider score={scoreboard} />}
								</div>
							);
						});
					})()
				) : (
					<div>Loading data</div>
				)}
			</div>
		</DashboardCard>
	);
}
