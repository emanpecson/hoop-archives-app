import { Draft } from "@/types/model/draft";
import { Player } from "@/types/model/player";

export const getTeamOptions = (
	draft: Draft,
	pivotPlayer: Player | undefined,
	getSameTeam: boolean
) => {
	if (pivotPlayer) {
		const isHomePlayer = draft.home.some(
			(x) => x.playerId === pivotPlayer.playerId
		);

		if (getSameTeam) {
			if (isHomePlayer)
				return draft.home.filter((x) => x.playerId !== pivotPlayer.playerId);
			return draft.away.filter((x) => x.playerId !== pivotPlayer.playerId);
		}
		// get opposing team
		if (isHomePlayer) return draft.away;
		return draft.home;
	}
	return [];
};

export const getPlayerTeam = (
	draft: Draft,
	player: Player | undefined
): "home" | "away" | null => {
	if (player) {
		const onHomeTeam = draft.home.some((x) => x.playerId === player.playerId);
		return onHomeTeam ? "home" : "away";
	}
	return null;
};

export const displayPlayers = (players: Player[]) => {
	return players.map((x) => `${x.firstName[0]}. ${x.lastName}`).join(", ");
};
