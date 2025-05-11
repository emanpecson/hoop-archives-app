import { DefensivePlay, OffensivePlay } from "../play";

export interface GameClip {
	// * common attributes
	clipId: string; // partition key: unique game title + order
	gameId: string; // sort key: unique game title
	tags: string[];
	startTime: number;
	endTime: number;
	url?: string; // set on backend-clipper

	offense?: OffensivePlay;
	defense?: DefensivePlay;
}
