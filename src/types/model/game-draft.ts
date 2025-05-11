import { ClipDetails } from "../clip-details";
import { GameType } from "../enum/game-type";
import { Player } from "./player";

export interface GameDraft {
	// * defined in new-game
	title: string; // partition key
	date: string;
	type: GameType;
	team1?: Player[];
	team2?: Player[];
	players?: Player[];

	// * defined in video-clipper (new-clip)
	clipsDetails?: ClipDetails[];
}
