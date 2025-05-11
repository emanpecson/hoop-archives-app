import { GameType } from "../enum/game-type";
import { Player } from "./player";

export interface Game {
	gameId: string; // partition key: unique game title
	date: Date;
	type: GameType;

	team1?: Player[];
	team2?: Player[];
	players?: Player[];
}
