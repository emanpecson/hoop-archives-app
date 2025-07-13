import { Player } from "@/types/model/player";
import { initStats, Stats, TempStats } from "@/types/model/stats";
import { DefensivePlay, OffensivePlay } from "@/types/play";

type PlayerStats = { [id: string]: TempStats };
export type CollectStatsOutput = {
	playerStats: PlayerStats;
	teamStats: Stats;
};

export const collectStats = (
	leagueId: string,
	players: Player[],
	clips: { offense?: OffensivePlay; defense?: DefensivePlay }[]
) => {
	// setup init stats for each player
	const statlines: PlayerStats = Object.fromEntries(
		players.map((p) => [p.playerId, initStats(leagueId, p.playerId)])
	);
	const totals = initStats("n/a", "n/a");

	// calculate player stats by clip
	for (const clip of clips) {
		if (clip.offense) {
			const scorer = clip.offense.playerScoring;

			if (scorer.playerId in statlines) {
				statlines[scorer.playerId].points += clip.offense.pointsAdded;
				totals.points += clip.offense.pointsAdded;

				if (clip.offense.pointsAdded === 1) {
					statlines[scorer.playerId].twoPointers++;
					totals.twoPointers++;
				} else if (clip.offense.pointsAdded === 2) {
					statlines[scorer.playerId].threePointers++;
					totals.threePointers++;
				}

				const assister = clip.offense.playerAssisting;
				if (assister) {
					statlines[assister.playerId].assists++;
					totals.assists++;
				}
			}
		} else if (clip.defense) {
			const defender = clip.defense.playerDefending;

			if (defender.playerId in statlines) {
				statlines[defender.playerId].blocks++;
				totals.blocks++;
			}
		}
	}

	return { playerStats: statlines, teamStats: totals };
};
