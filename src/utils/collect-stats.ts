import { Player } from "@/types/model/player";
import { initStats, Stats, TempStats } from "@/types/model/stats";
import { DefensivePlay, OffensivePlay } from "@/types/play";

type PlayerStats = { [id: string]: TempStats };
export type CollectStatsOutput = {
	playerStats: PlayerStats;
	teamStats: TempStats;
};

export const collectStatsFromClips = (
	leagueId: string,
	players: Player[],
	clips: { offense?: OffensivePlay; defense?: DefensivePlay }[]
): CollectStatsOutput => {
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

export const collectStatsFromGame = (
	stats: Stats[],
	players: Player[]
): CollectStatsOutput => {
	const totals = initStats("n/a", "n/a");

	const statlines: PlayerStats = Object.fromEntries(
		stats
			// filter stats that match the given players (to filter by team)
			.filter((playerStat) =>
				players.some((p) => p.playerId === playerStat.playerId)
			)
			.map((playerStat) => {
				totals.points += playerStat.points;
				totals.assists += playerStat.assists;
				totals.blocks += playerStat.blocks;
				totals.twoPointers += playerStat.twoPointers;
				totals.threePointers += playerStat.threePointers;

				return [playerStat.playerId, { ...playerStat } as TempStats];
			})
	);

	return { playerStats: statlines, teamStats: totals };
};
