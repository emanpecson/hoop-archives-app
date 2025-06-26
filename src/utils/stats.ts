import { Player } from "@/types/model/player";
import { DefensivePlay, OffensivePlay } from "@/types/play";

type Stats = { pts: number; ast: number; blk: number };
type PlayerStats = { [id: string]: Stats };
export type CollectStatsOutput = { playerStats: PlayerStats; teamStats: Stats };

export const collectStats = (
	players: Player[],
	clips: { offense?: OffensivePlay; defense?: DefensivePlay }[]
) => {
	// initialize stats w/ 0
	const stats: PlayerStats = Object.fromEntries(
		players.map((p) => [p.playerId, { pts: 0, ast: 0, blk: 0 }])
	);
	const totals: Stats = { pts: 0, ast: 0, blk: 0 };

	// calculate player stats by clip
	for (const clip of clips) {
		if (clip.offense) {
			const scorer = clip.offense.playerScoring;

			if (scorer.playerId in stats) {
				stats[scorer.playerId].pts += clip.offense.pointsAdded;
				totals.pts += clip.offense.pointsAdded;

				const assister = clip.offense.playerAssisting;
				if (assister) {
					stats[assister.playerId].ast++;
					totals.ast++;
				}
			}
		} else if (clip.defense) {
			const defender = clip.defense.playerDefending;

			if (defender.playerId in stats) {
				stats[defender.playerId].blk++;
				totals.blk++;
			}
		}
	}

	return { playerStats: stats, teamStats: totals };
};
