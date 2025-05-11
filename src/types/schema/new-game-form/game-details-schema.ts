import { z } from "zod";

const fileNameSafeRegex = /^[a-zA-Z0-9_-]+$/;

export const gameDetailsSchema = z.object({
	title: z.string().min(1, "Required").max(30, "Max length of 30 characters"),
	date: z.date({ message: "Required" }),
	type: z.string().min(1, "Required").regex(fileNameSafeRegex, {
		message:
			"Must only contain letters, numbers, underscores, or dashes (no spaces or dots)",
	}),
});

export type GameDetailsFormFields = z.infer<typeof gameDetailsSchema>;
