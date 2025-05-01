import { SearchIcon } from "lucide-react";
import DashboardCard from "../../dashboard/dashboard-card";
import DashboardCardHeader from "../../dashboard/dashboard-card-header";
import { Input } from "../../ui/input";
import ClipDetailsCard from "./clip-details-card";
import { ClipTag } from "@/types/clip-tag-enum";
import ScoreDivider from "./score-divider";

export default function ClipDetails() {
	return (
		<DashboardCard className="w-72 h-full space-y-4 flex flex-col">
			<DashboardCardHeader text="Clip Details" />
			<Input Icon={SearchIcon} placeholder="Search clip..." />

			<div className="grow overflow-y-scroll space-y-4">
				<ClipDetailsCard
					statement="L. Morales (Team 1) scored"
					tags={[ClipTag.LAYUP, ClipTag.CONTESTED]}
				/>
				<ScoreDivider score="1-0" />
				<ClipDetailsCard
					statement="E. Pecson (Team 1) scored"
					tags={[ClipTag.DEEP, ClipTag.OFF_THE_DRIBBLE, ClipTag.HIGHLIGHT]}
				/>
				<ScoreDivider score="3-0" />
				<ClipDetailsCard
					statement="E. Pecson (Team 1) scored"
					tags={[ClipTag.DEEP, ClipTag.OFF_THE_DRIBBLE, ClipTag.HIGHLIGHT]}
				/>
				<ScoreDivider score="3-0" />
				<ClipDetailsCard
					statement="E. Pecson (Team 1) scored"
					tags={[ClipTag.DEEP, ClipTag.OFF_THE_DRIBBLE, ClipTag.HIGHLIGHT]}
				/>
				<ScoreDivider score="3-0" />
			</div>
		</DashboardCard>
	);
}
