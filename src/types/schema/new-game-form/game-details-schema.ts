import { z } from "zod";

export const gameDetailsSchema = z.object({
	title: z.string().min(1, "Required").max(30, "Max length of 30 characters"),
	date: z.date({ message: "Required" }),
	type: z.string().min(1, "Required"),
});

export type GameDetailsFormFields = z.infer<typeof gameDetailsSchema>;
