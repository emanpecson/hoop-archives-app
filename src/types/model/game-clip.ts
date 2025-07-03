import { DefensivePlay, OffensivePlay } from "../play";

export interface GameClip {
	// * common attributes
	leagueId: string; // partition key
	gameTitle: string; // sort key: unique game title
	clipId: string;
	tags: string[];
	startTime: number;
	endTime: number;
	highlightTime: number;
	teamBeneficiary: string;
	url: string;
	date: Date;

	offense?: OffensivePlay;
	defense?: DefensivePlay;
}
