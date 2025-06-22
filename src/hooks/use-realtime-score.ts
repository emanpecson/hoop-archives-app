import { ClipDraft } from "@/types/clip-draft";
import { useMemo } from "react";

type Score = { home: number; away: number };

export function useRealtimeScore(
	clips: ClipDraft[] | undefined,
	currentTime: number
) {
	return useMemo((): Score => {
		const score: Score = { home: 0, away: 0 };

		if (clips) {
			for (const clip of clips) {
				if (clip.highlightTime <= currentTime && clip.offense) {
					if (clip.teamBeneficiary === "home") {
						score.home += clip.offense.pointsAdded;
					} else if (clip.teamBeneficiary === "away") {
						score.away = clip.offense.pointsAdded;
					}
				}
			}
		}
		return score;
	}, [clips, currentTime]);
}
