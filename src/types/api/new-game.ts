import { Game } from "../model/game";
import { GameClip } from "../model/game-clip";

export type NewGameRequestBody = {
	game: Game;
	clips: GameClip[];
};
