import { z } from "zod";
import { playerSchema } from "./player-schema";

export const offensiveHighlightsFormFields = z.object({
	play: z.literal("offense"),
	playerScoring: playerSchema.optional(),
	playerAssisting: playerSchema.optional(),
	playersDefending: z.array(playerSchema),
	tags: z.array(z.string()),
});

export type OffensiveHighlightsFormFields = z.infer<
	typeof offensiveHighlightsFormFields
>;

export const defensiveHighlightsSchema = z.object({
	play: z.literal("defense"),
	playerDefending: playerSchema.optional(),
	playerStopped: playerSchema.optional(),
	tags: z.array(z.string()),
});

export type DefensiveHighlightsFormFields = z.infer<
	typeof defensiveHighlightsSchema
>;

export const highlightsSchema = z.discriminatedUnion("play", [
	offensiveHighlightsFormFields,
	defensiveHighlightsSchema,
]);

export type HighlightsFormFields = z.infer<typeof highlightsSchema>;
