import { z } from "zod";

export const reelDetailsSchema = z.object({
	title: z.string().min(1, "Required").max(30, "Max length of 30 charaters"),
});

export type ReelDetailsFormFields = z.infer<typeof reelDetailsSchema>;
