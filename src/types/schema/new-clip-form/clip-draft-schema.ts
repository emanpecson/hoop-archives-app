import { z } from "zod";
import { playerSchema } from "../player-schema";

export const offensivePlaySchema = z.object({
	play: z.literal("offense"),
	pointsAdded: z.number(),
	playerScoring: playerSchema,
	playerAssisting: playerSchema.optional(),
	playersDefending: z.array(playerSchema),
	teamBeneficiary: z.string().optional(),
	tags: z.array(z.string()).min(1, "Required"),
});

export type OffensivePlayFormFields = z.infer<typeof offensivePlaySchema>;

// ----------------------------------------------------- //

export const defensivePlaySchema = z.object({
	play: z.literal("defense"),
	playerDefending: playerSchema,
	playerStopped: playerSchema,
	teamBeneficiary: z.string().optional(),
	tags: z.array(z.string()).min(1, "Required"),
});

export type DefensivePlayFormFields = z.infer<typeof defensivePlaySchema>;

// ----------------------------------------------------- //

// applies one of the following schemas (based on `play`)
export const clipDraftSchema = z.discriminatedUnion("play", [
	offensivePlaySchema,
	defensivePlaySchema,
]);

export type ClipDraftFormFields = z.infer<typeof clipDraftSchema>;
