import { generateId } from "@/utils/generate-id";

export interface Stats {
	leagueId: string; // partition key
	statsId: string; // sort key

	playerId: string; // reference to player
	gameId: string; // reference to game

	// stats
	points: number;
	assists: number;
	blocks: number;
	twoPointers: number;
	threePointers: number;
}

// define `gameId` on submission
export type TempStats = Omit<Stats, "gameId">;

export const initStats = (leagueId: string, playerId: string): TempStats => {
	return {
		leagueId,
		statsId: generateId("stats"),
		playerId,

		points: 0,
		assists: 0,
		blocks: 0,
		twoPointers: 0,
		threePointers: 0,
	};
};
