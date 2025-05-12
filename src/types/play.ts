import { Player } from "./model/player";

export interface OffensivePlay {
	pointsAdded: number;
	playerScoring: Player;
	playerAssisting?: Player;
	playersDefending: Player[];
}

export interface DefensivePlay {
	playerDefending: Player;
	playerStopped: Player;
}
