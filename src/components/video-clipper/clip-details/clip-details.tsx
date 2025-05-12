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
			} ${scorer} scored a ${clip.offense.pointsAdded}`;
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
		<DashboardCard className="w-72 h-full space-y-4 flex flex-col">
			<DashboardCardHeader text="Clip Details" />
			<Input Icon={SearchIcon} placeholder="Search clip..." />

			<div className="grow overflow-y-scroll space-y-4">
				{props.draft ? (
					props.draft.clipsDetails.map((clip, i) => (
						<div key={i} className="space-y-4">
							<ClipDetailsCard
								headline={clipHeadline(clip)}
								tags={clip.tags as ClipTag[]}
							/>
							<ScoreDivider score="0-0" />
						</div>
					))
				) : (
					<div>Loading data</div>
				)}
			</div>
		</DashboardCard>
	);
}
