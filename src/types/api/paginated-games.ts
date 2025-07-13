import { Game } from "../model/game";

export type GamePrimaryKey = { leagueId: string; gameId: string };

export type PaginatedGamesResponse = {
	games: Game[];
	lastEvaluatedKey: GamePrimaryKey;
};
