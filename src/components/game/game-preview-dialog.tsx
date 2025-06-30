"use client";

import { Game } from "@/types/model/game";
import Statboard from "../video-clipper/game-details/statboard";
import { useLoadData } from "@/hooks/use-load-data";
import { useState } from "react";
import { GameClip } from "@/types/model/game-clip";
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
	const [clips, setClips] = useState<GameClip[]>([]);
	const [isFetchingClips, setIsFetchingClips] = useState(true);
	const [open, setOpen] = useState(false);
	const gameUrl = `/${props.game.leagueId}/${props.game.title}`;

	useLoadData({
		endpoint: `/api/ddb/${tempLeagueId}/game-clips/${props.game.title}`,
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

				<hr className="border-neutral-700" />

				<div>
					{isFetchingClips ? (
						<p>Loading...</p>
					) : clips && clips.length > 0 ? (
						<div className="flex place-items-center justify-between space-x-20">
							<Statboard label="Home" players={props.game.home} clips={clips} />
							<Statboard label="Away" players={props.game.away} clips={clips} />
						</div>
					) : (
						<p>No clips</p>
					)}
				</div>

				<hr className="border-neutral-700" />

				<DialogFooter className="w-full flex justify-end">
					<Button variant="outline">
						<Link href={gameUrl}>Play game</Link>
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
