import { ClipDraft } from "../clip-draft";
import { GameType } from "../enum/game-type";
import { Player } from "./player";

export interface GameDraft {
	// * defined in new-game
	leagueId: string; // partition key
	title: string; // sort key
	bucketKey: string;
	date: string;
	type: GameType;
	home: Player[];
	away: Player[];

	// * defined in video-clipper (new-clip)
	clipDrafts: ClipDraft[];
}
