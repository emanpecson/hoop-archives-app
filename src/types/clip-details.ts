import { DefensivePlay, OffensivePlay } from "./play";

export interface ClipDetails {
	startTime: number;
	endTime: number;
	tags: string[];

	offense?: OffensivePlay;
	defense?: DefensivePlay;
}
