import { z } from "zod";

const playerSchema = z.object({
	playerId: z.string(),
	firstName: z.string(),
	lastName: z.string(),
});

export function createPlayersSchema(gameType: string) {
	let schema = z.object({});

	if (gameType === "21") {
		schema = schema.extend({
			players: z
				.array(playerSchema.nullable())
				.min(3, "Minimum 3 players required")
				.max(5, "Maximum 5 players")
				.refine(
					(players) => players.every((p) => p !== null),
					"Players undefined"
				),
		});
	} else if (gameType === "1v1") {
		schema = schema.extend({
			players: z
				.array(playerSchema.nullable())
				.length(2)
				.refine(
					(players) => players.every((p) => p !== null),
					"2 players required"
				),
		});
	} else if (gameType === "2v2" || gameType === "3v3" || gameType === "4v4") {
		const teamSize = parseInt(gameType[0]);
		schema = schema.extend({
			team1: z
				.array(playerSchema.nullable())
				.length(teamSize)
				.refine(
					(team) => team.every((p) => p !== null),
					`${teamSize} players required`
				),
			team2: z
				.array(playerSchema.nullable())
				.length(teamSize)
				.refine(
					(team) => team.every((p) => p !== null),
					`${teamSize} players required`
				),
		});
	}

	return schema;
}
