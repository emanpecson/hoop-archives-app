import DashboardCard from "../../dashboard/dashboard-card";
import { ClipDraft } from "@/types/clip-draft";
import ClipDraftCard from "./clip-draft-card";
import { ClipTag } from "@/types/enum/clip-tag";
import { useVideoClipperStore } from "@/hooks/use-video-clipper-store";

export default function ClipController() {
	const { draft, previewClips } = useVideoClipperStore((state) => ({
		draft: state.draft,
		previewClips: state.previewClips,
	}));

	const clipHeadline = (clip: ClipDraft) => {
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
					{draft && draft.clipDrafts ? (
						(() => {
							let homeScore = 0;
							let awayScore = 0;

							return draft.clipDrafts.map((clip, i) => {
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
										<ClipDraftCard
											clip={clip}
											headline={clipHeadline(clip)}
											tags={clip.tags as ClipTag[]}
											onPreview={() => previewClips(i)}
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
