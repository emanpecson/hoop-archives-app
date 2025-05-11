export type TrimRequest = {
	key: string;
	clips: { start: number; duration: number }[];
};
