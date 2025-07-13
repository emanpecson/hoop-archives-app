import { Game } from "@/types/model/game";
import { EllipsisIcon, Loader2Icon } from "lucide-react";
import Link from "next/link";
import GamePreviewDialog from "./game-preview-dialog";
import Image from "next/image";
import { GameStatus } from "@/types/enum/game-status";
import { displayPlayers } from "@/utils/player-info";

interface GamePreviewProps {
	game: Game;
}

export default function GamePreview({ game }: GamePreviewProps) {
	const url =
		game.status === GameStatus.COMPLETE
			? `/${game.leagueId}/game/${game.gameId}`
			: undefined;

	return (
		<div className="space-y-1">
			<div className="flex justify-center">
				{game.status === GameStatus.COMPLETE && game.thumbnailUrl && url ? (
					<Link href={url}>
						<Image
							src={game.thumbnailUrl}
							alt={`${game.title} thumbnail`}
							width={80}
							height={40}
							className="w-80 h-40 object-cover rounded-lg"
							unoptimized
						/>
					</Link>
				) : (
					<div className="w-80 h-40 rounded-lg bg-neutral-700/50 flex justify-center place-items-center pointer-events-none">
						{game.status === GameStatus.UPLOADING ? (
							<Loader2Icon className="animate-spin text-neutral-500/50" />
						) : (
							<p className="text-neutral-500/50">Unavailable</p>
						)}
					</div>
				)}
			</div>

			<div className="space-y-1.5">
				<div className="font-semibold text-center text-sm">
					{url ? (
						<Link className="hover:underline" href={url}>
							{game.title}
						</Link>
					) : (
						<p className="pointer-events-none">{game.title}</p>
					)}
				</div>
				<div className="flex justify-center place-items-center space-x-2.5">
					<span className="rounded-lg px-2 py-0.5 bg-neutral-500/20 text-neutral-400 capitalize text-xs font-normal">
						{game.status ?? "Unavailable"}
					</span>

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
