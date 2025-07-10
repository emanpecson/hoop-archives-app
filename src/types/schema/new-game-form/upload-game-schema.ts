import { z } from "zod";

const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024; // 2GB

export const uploadGameSchema = z.object({
	videoFile: z.custom<File>(
		(file) => {
			return (
				file instanceof File &&
				file.type.startsWith("video/") &&
				file.size <= MAX_FILE_SIZE
			);
		},
		{
			message: "File must be a video and less than 2GB",
		}
	),
});

export type UploadGameFormFields = z.infer<typeof uploadGameSchema>;
