import { z } from "zod";

export const gameDetailsSchema = z.object({
	title: z.string().min(1, "Required").max(40),
	date: z.date({ message: "Required" }),
	type: z.string().min(1, "Required"),
});

export type GameDetailsFormFields = z.infer<typeof gameDetailsSchema>;
