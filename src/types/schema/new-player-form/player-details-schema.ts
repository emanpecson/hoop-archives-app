import { z } from "zod";

export const playerDetailsSchema = z.object({
	firstName: z.string().min(1, "Required"),
	lastName: z.string().min(1, "Required"),
});

export type PlayerDetailsFormFields = z.infer<typeof playerDetailsSchema>;
