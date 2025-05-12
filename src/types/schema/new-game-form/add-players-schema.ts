import { Player } from "@/types/model/player";
import { z } from "zod";
import { playerSchema } from "../player-schema";

export type DynamicPlayersForm = {
	home?: (Player | null)[];
	away?: (Player | null)[];
};

export function createPlayersSchema(gameType: string) {
	let schema = z.object({});

	const teamSize = parseInt(gameType[0]);
	schema = schema.extend({
		home: z
			.array(playerSchema.nullable())
			.length(teamSize)
			.refine(
				(team) => team.every((p) => p !== null),
				`${teamSize} players required`
			),
		away: z
			.array(playerSchema.nullable())
			.length(teamSize)
			.refine(
				(team) => team.every((p) => p !== null),
				`${teamSize} players required`
			),
	});

	return schema;
}
