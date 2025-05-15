import DashboardCard from "../../dashboard/dashboard-card";
import { ClipDetails } from "@/types/clip-details";
import { RefObject } from "react";
import ClipDetailsCard from "./clip-details-card";
import { ClipTag } from "@/types/enum/clip-tag";

interface ClipControllerProps {
	clips: ClipDetails[];
	currentTime: number;
	duration: number;
	videoRef: RefObject<HTMLVideoElement | null>;
	onPreviewClips: (i: number) => void;
}

export default function ClipController(props: ClipControllerProps) {
	const clipHeadline = (clip: ClipDetails) => {
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

	return (
		<DashboardCard className="h-32 w-full">
			<div className="overflow-x-auto h-full w-full">
				<div className="flex h-full min-w-full">
					{props.clips ? (
						(() => {
							let homeScore = 0;
							let awayScore = 0;

							return props.clips.map((clip, i) => {
								if (clip.offense) {
									if (clip.teamBeneficiary === "home") {
										homeScore += clip.offense.pointsAdded;
									} else {
										awayScore += clip.offense.pointsAdded;
									}
								}

								const scoreboard = `${homeScore}-${awayScore}`;
								return (
									<div key={i} className="flex flex-shrink-0 h-full">
										<ClipDetailsCard
											headline={clipHeadline(clip)}
											tags={clip.tags as ClipTag[]}
											onClick={() => props.onPreviewClips(i)}
										/>
										{clip.offense && (
											<span className="text-nowrap px-4 h-full flex place-items-center text-neutral-500">
												{scoreboard}
											</span>
										)}
									</div>
								);
							});
						})()
					) : (
						<div>Loading data</div>
					)}
				</div>
			</div>
		</DashboardCard>
	);
}
