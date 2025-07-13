import { DefensivePlay, OffensivePlay } from "../play";

export interface Clip {
	leagueId: string; // partition key
	clipId: string; // sort key

	gameId: string;
	date: Date; // ! is this coming back as a string in ddb?

	tags: string[];
	startTime: number;
	endTime: number;
	highlightTime: number;
	teamBeneficiary: string;
	url: string;
	offense?: OffensivePlay;
	defense?: DefensivePlay;
}
