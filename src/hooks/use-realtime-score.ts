import { OffensivePlay } from "@/types/play";
import { useMemo } from "react";

type Score = { home: number; away: number };
type OffensiveClip = {
	startTime: number;
	endTime: number;
	highlightTime: number;
	offense?: OffensivePlay;
	teamBeneficiary: string;
};

export function useRealtimeScore(
	clips: OffensiveClip[] | undefined,
	currentTime: number, // * time in actual video
	isAbsoluteTime?: boolean
) {
	return useMemo((): Score => {
		const score: Score = { home: 0, away: 0 };

		if (clips) {
			// to know highlightTime in reference to entire accumulation of clips
			let accTime = 0;

			for (const clip of clips) {
				const { startTime, endTime, highlightTime } = clip;
				const duration = endTime - startTime;

				// update score when point-of-score has been reached
				if (clip.offense) {
					// calculate time relative to current clip + relative to all clips
					const offsetHighlightTime = highlightTime - startTime;
					const accHighlightTime = accTime + offsetHighlightTime;

					if (
						isAbsoluteTime
							? clip.highlightTime <= currentTime
							: accHighlightTime <= currentTime
					) {
						if (clip.teamBeneficiary === "home") {
							score.home += clip.offense.pointsAdded;
						} else if (clip.teamBeneficiary === "away") {
							score.away += clip.offense.pointsAdded;
						}
					}
				}

				accTime += duration;
			}
		}
		return score;
	}, [clips, currentTime, isAbsoluteTime]);
}
