import { DefensivePlay, OffensivePlay } from "../play";

export interface Clip {
	leagueId: string; // partition key
	gameTitle: string; // sort key: unique game title
	date: Date; // ! is this coming back as a string in ddb?

	clipId: string;
	tags: string[];
	startTime: number;
	endTime: number;
	highlightTime: number;
	teamBeneficiary: string;
	url: string;
	offense?: OffensivePlay;
	defense?: DefensivePlay;
}
