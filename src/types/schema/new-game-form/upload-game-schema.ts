import { z } from "zod";

const maxFileSize = 2 * 1024 * 1024 * 1024; // 2GB

export const uploadGameSchema = z.object({
	videoFile: z.custom<File>(
		(file) => {
			return (
				file instanceof File &&
				file.type.startsWith("video/") &&
				file.size <= maxFileSize
			);
		},
		{ message: "Please upload a video file less than 2GB" }
	),
});

export type UploadGameFormFields = z.infer<typeof uploadGameSchema>;
