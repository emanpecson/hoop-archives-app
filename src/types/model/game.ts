import { GameStatus } from "../enum/game-status";
import { GameType } from "../enum/game-type";
import { Player } from "./player";

export interface Game {
	leagueId: string; // partition key: group games by league
	title: string; // sort key: unique game title; for getting a specific game
	date: Date;
	type: GameType;
	thumbnailUrl?: string; // undefined until upload-request completed
	status: GameStatus;

	home: Player[];
	away: Player[];
}
