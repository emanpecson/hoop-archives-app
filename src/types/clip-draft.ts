import { DefensivePlay, OffensivePlay } from "./play";

export interface ClipDraft {
	startTime: number;
	endTime: number;
	tags: string[];

	teamBeneficiary?: string;
	offense?: OffensivePlay;
	defense?: DefensivePlay;
}
