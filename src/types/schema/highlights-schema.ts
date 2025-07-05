import { z } from "zod";
import { playerSchema } from "./player-schema";
import { dateRangeSchema } from "./date-range-schema";

export const offensiveHighlightsSchema = z.object({
	play: z.literal("offense"),
	playerScoring: playerSchema.optional(),
	playerAssisting: playerSchema.optional(),
	playersDefending: z.array(playerSchema),
	tags: z.array(z.string()),
	dateRange: dateRangeSchema.optional(),
});

export type OffensiveHighlightsFormFields = z.infer<
	typeof offensiveHighlightsSchema
>;

export const defensiveHighlightsSchema = z.object({
	play: z.literal("defense"),
	playerDefending: playerSchema.optional(),
	playerStopped: playerSchema.optional(),
	tags: z.array(z.string()),
	dateRange: dateRangeSchema.optional(),
});

export type DefensiveHighlightsFormFields = z.infer<
	typeof defensiveHighlightsSchema
>;

export const highlightsSchema = z.discriminatedUnion("play", [
	offensiveHighlightsSchema,
	defensiveHighlightsSchema,
]);

export type HighlightsFormFields = z.infer<typeof highlightsSchema>;
