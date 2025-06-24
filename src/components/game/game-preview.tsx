import { Game } from "@/types/model/game";
import Link from "next/link";

interface GamePreviewProps {
	game: Game;
}

export default function GamePreview({ game }: GamePreviewProps) {
	return (
		<Link href={`${game.leagueId}/${game.title}`}>
			{JSON.stringify(game)}
			<div className="border rounded-lg p-4">{game.title}</div>
		</Link>
	);
}
