import { DefensivePlay, OffensivePlay } from "../play";

export type SqsGameRequest = {
	leagueId: string;
	gameId: string;
	key: string; // game title + extention
	date: Date;

	clipRequests: SqsClipRequest[];
};

export type SqsClipRequest = {
	clipId: string;
	tags: string[];
	startTime: number;
	endTime: number;
	highlightTime: number;
	teamBeneficiary: string;
	offense?: OffensivePlay;
	defense?: DefensivePlay;
};

// ---

export type SqsReelRequest = {
	leagueId: string;
	reelId: string;
	clipKeys: string[]; // clip ids
};
