import { DefensivePlay, OffensivePlay } from "../play";

export interface GameClip {
	// * common attributes
	gameTitle: string; // parititon key: unique game title
	clipId: string; // sort key: unique game title + order
	tags: string[];
	startTime: number;
	endTime: number;
	highlightTime: number;
	teamBeneficiary: string;
	url: string;

	offense?: OffensivePlay;
	defense?: DefensivePlay;
}
