import DashboardCard from "../../dashboard/dashboard-card";
import ClipDraftCard from "./clip-draft-card";
import { ClipTag } from "@/types/enum/clip-tag";
import { useVideoClipperStore } from "@/hooks/use-video-clipper-store";

export default function ClipController() {
	const { draft, previewClips } = useVideoClipperStore((state) => ({
		draft: state.draft,
		previewClips: state.previewClips,
	}));

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
