import { Game } from "@/types/model/game";

interface GameOverviewProps {
	game: Game;
}

// * this file would contain functionality for playing the video
// * + viewing the leaderboard
export default function GameOverview({ game }: GameOverviewProps) {
	return <div>{game.title}</div>;
}
