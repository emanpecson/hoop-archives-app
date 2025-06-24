import { Game } from "@/types/model/game";

interface GamePreviewProps {
	game: Game;
}

export default function GamePreview({ game }: GamePreviewProps) {
	return <div className="border rounded-lg">{game.title}</div>;
}
