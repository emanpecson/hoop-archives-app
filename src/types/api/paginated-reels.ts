import { Reel } from "../model/reel";

export type ReelPrimaryKey = { leagueId: string; reelId: string };

export type PaginatedReelsResponse = {
	reels: Reel[];
	lastEvaluatedKey: ReelPrimaryKey;
};
