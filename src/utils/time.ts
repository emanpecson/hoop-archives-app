export const getTimestamp = (sec: number) => {
	const mins = Math.floor(sec / 60);
	const secs = Math.floor(sec % 60);
	return `${mins}:${secs.toString().padStart(2, "0")}`;
};
