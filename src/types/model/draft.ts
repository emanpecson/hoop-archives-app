import { Player } from "./player";

export interface Draft {
	filename: string; // partition key
	title: string;
	date: string;
	type: string;

	team1?: Player[];
	team2?: Player[];
	players?: Player[];
}
