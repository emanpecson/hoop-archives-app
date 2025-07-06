import { z } from "zod";

export const dateRangeSchema = z
	.object({
		start: z.date().optional(),
		end: z.date().optional(),
	})
	.refine((data) => !data.start || !data.end || data.start <= data.end, {
		message: "Start date must be on or before the end date",
		path: ["end"],
	});
