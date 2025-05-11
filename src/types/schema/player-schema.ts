import { z } from "zod";

export const playerSchema = z.object({
	playerId: z.string(),
	firstName: z.string(),
	lastName: z.string(),
});
