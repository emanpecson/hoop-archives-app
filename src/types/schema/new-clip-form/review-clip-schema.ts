import { z } from "zod";

export const reviewClipSchema = z.object({
	highlightTime: z.number(),
});

export type ReviewClipFormFields = z.infer<typeof reviewClipSchema>;
