import { ClipDraft } from "../clip-draft";
import { GameType } from "../enum/game-type";
import { Player } from "./player";

export interface Draft {
	leagueId: string; // partition key
	draftId: string; // sort key
	title: string;
	bucketKey: string;
	date: string;
	type: GameType;
	home: Player[];
	away: Player[];

	clipDrafts: ClipDraft[];
}
