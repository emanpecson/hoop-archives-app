import { UploadStatus } from "../enum/upload-status";

export type Reel = {
	leagueId: string; // partition key: group games by league
	reelId: string; // sort key

	title: string;
	created: Date;
	thumbnailUrl?: string; // undefined until upload-request completed
	sourceUrl?: string; // undefined until upload-request completed
	status: UploadStatus;

	uploaderUserId: string;
};
