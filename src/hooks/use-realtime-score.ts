import { PlayTimestamp } from "@/types/model/game";
import { OffensivePlay } from "@/types/play";
import { useMemo } from "react";

type Score = { home: number; away: number };
type OffensiveClip = {
	highlightTime: number;
	offense?: OffensivePlay;
	teamBeneficiary: string;
};

export function useDraftRealtimeScore(
	clips: OffensiveClip[] | undefined,
	currentTime: number
) {
	return useMemo((): Score => {
		const score: Score = { home: 0, away: 0 };

		if (clips) {
			for (const clip of clips) {
				// update score when point-of-score has been reached
				if (clip.offense && clip.highlightTime <= currentTime) {
					if (clip.teamBeneficiary === "home") {
						score.home += clip.offense.pointsAdded;
					} else if (clip.teamBeneficiary === "away") {
						score.away += clip.offense.pointsAdded;
					}
				}
			}
		}
		return score;
	}, [clips, currentTime]);
}

export function useGameRealtimeScore(
	playTimestamps: PlayTimestamp[] | undefined,
	currentTime: number
) {
	return useMemo((): Score => {
		const score: Score = { home: 0, away: 0 };

		if (playTimestamps) {
			for (const play of playTimestamps) {
				// update score when point-of-score has been reached
				if (play.time <= currentTime) {
					if (play.teamBeneficiary === "home") {
						score.home += play.pointsAdded;
					} else if (play.teamBeneficiary === "away") {
						score.away += play.pointsAdded;
					}
				}
			}
		}

		return score;
	}, [playTimestamps, currentTime]);
}
