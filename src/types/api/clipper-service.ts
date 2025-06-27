export type TrimRequest = {
	key: string;
	clips: { start: number; duration: number }[];
};

export type TrimResponse = {
	clipUrls: string[];
	thumbnailUrl: string;
};
