import { z } from "zod";

const maxFileSize = 5 * 1024 * 1024; // 5MB
const acceptedImageTypes = ["image/jpeg", "image/png", "image/webp"];

export const uploadImageSchema = z.object({
	imageFile: z.custom<File>(
		(file) => {
			return (
				file instanceof File &&
				acceptedImageTypes.includes(file.type) &&
				file.size <= maxFileSize
			);
		},
		{ message: "Please upload an image file less than 5MB" }
	),
});

export type UploadImageFormFields = z.infer<typeof uploadImageSchema>;
