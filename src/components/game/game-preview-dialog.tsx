"use client";

import { Game } from "@/types/model/game";
import Statboard from "../video-clipper/game-details/statboard";
import { useLoadData } from "@/hooks/use-load-data";
import { useState } from "react";
import { Clip } from "@/types/model/clip";
import { toast } from "sonner";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import Link from "next/link";
import { tempLeagueId } from "@/data/temp";

interface GamePreviewDialogProps {
	game: Game;
	children: React.ReactNode;
}

export default function GamePreviewDialog(props: GamePreviewDialogProps) {
	const [clips, setClips] = useState<Clip[]>([]);
	const [isFetchingClips, setIsFetchingClips] = useState(true);
	const [open, setOpen] = useState(false);
	const gameUrl = `/${props.game.leagueId}/game/${props.game.gameId}`;

	useLoadData({
		endpoint: `/api/ddb/${tempLeagueId}/clips/${props.game.gameId}`,
		onDataLoaded: setClips,
		setIsLoading: setIsFetchingClips,
		onError: () => toast.error("Error fetching game clips"),
	});

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{props.children}</DialogTrigger>

			<DialogContent className="sm:max-w-2xl">
				<DialogHeader>
					<DialogTitle>{props.game.title}</DialogTitle>
					<DialogDescription>View game details</DialogDescription>
				</DialogHeader>

				<hr className="border-neutral-800" />

				<div>
					{isFetchingClips ? (
						<p>Loading data...</p>
					) : clips && clips.length > 0 ? (
						<div className="flex place-items-center justify-between space-x-20">
							<Statboard label="Home" players={props.game.home} clips={clips} />
							<Statboard label="Away" players={props.game.away} clips={clips} />
						</div>
					) : (
						<p>No clips</p>
					)}
				</div>

				{clips.length > 0 && (
					<>
						<hr className="border-neutral-800" />

						<DialogFooter className="w-full flex justify-end">
							<Button variant="outline">
								<Link href={gameUrl}>Watch game</Link>
							</Button>
						</DialogFooter>
					</>
				)}
			</DialogContent>
		</Dialog>
	);
}
