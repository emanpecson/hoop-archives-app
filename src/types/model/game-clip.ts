import { DefensivePlay, OffensivePlay } from "../play";

export interface GameClip {
	// * common attributes
	gameTitle: string; // parititon key: unique game title
	clipId: string; // sort key: unique game title + order
	tags: string[];
	startTime: number;
	endTime: number;
	url?: string; // set on backend-clipper

	offense?: OffensivePlay;
	defense?: DefensivePlay;
}
