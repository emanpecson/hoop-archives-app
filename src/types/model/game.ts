import { GameType } from "../enum/game-type";
import { UploadStatus } from "../enum/upload-status";
import { Player } from "./player";
import { Stats } from "./stats";

export type PlayTimestamp = {
	time: number;
	player: Player;
	teamBeneficiary: string;
	pointsAdded: number;
};

export type Game = {
	leagueId: string; // partition key: group games by league
	gameId: string; // sort key

	title: string;
	date: Date;
	created: Date;
	type: GameType;
	thumbnailUrl?: string; // undefined until upload-request completed
	sourceUrl?: string; // undefined until upload-request completed
	playTimestamps: PlayTimestamp[];
	status: UploadStatus;

	home: Player[];
	away: Player[];

	stats: Stats[];
};
