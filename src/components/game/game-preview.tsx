import { Game } from "@/types/model/game";
import { Player } from "@/types/model/player";
import { EllipsisIcon } from "lucide-react";
import Link from "next/link";
import GamePreviewDialog from "./game-preview-dialog";
import Image from "next/image";

interface GamePreviewProps {
	game: Game;
}

export default function GamePreview({ game }: GamePreviewProps) {
	const url = `${game.leagueId}/${game.title}`;

	const displayPlayers = (players: Player[]) => {
		return players.map((x) => `${x.firstName[0]}. ${x.lastName}`).join(", ");
	};

	return (
		<div className="space-y-1">
			<Link href={url} className="flex justify-center">
				<Image
					src={game.thumbnailUrl}
					alt={`${game.title} thumbnail`}
					width={80}
					height={40}
					className="w-80 h-40 object-cover rounded-lg"
					unoptimized
				/>
			</Link>

			<div className="space-y-0.5">
				<div className="flex justify-center place-items-center space-x-2.5">
					<Link
						href={url}
						className="font-semibold text-center hover:underline text-sm"
					>
						{game.title}
					</Link>
					<span className="text-xs text-neutral-400">
						{new Date(game.date).toLocaleDateString()}
					</span>
					<GamePreviewDialog game={game}>
						<button className="p-0.5 bg-neutral-800 rounded-full cursor-pointer">
							<EllipsisIcon
								size={16}
								strokeWidth={1.5}
								className="text-neutral-400"
							/>
						</button>
					</GamePreviewDialog>
				</div>

				<div className="flex flex-col place-items-center text-neutral-400">
					<p className="text-xs">{displayPlayers(game.home)}</p>
					<p className="text-xs">{displayPlayers(game.away)}</p>
				</div>
			</div>
		</div>
	);
}
