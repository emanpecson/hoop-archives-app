import { Game } from "../model/game";

export type GamePrimaryKey = { leagueId: string; title: string };

export type PaginatedGamesResponse = {
	games: Game[];
	lastEvaluatedKey: GamePrimaryKey;
};
