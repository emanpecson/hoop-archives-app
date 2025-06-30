"use client";

import { Game } from "@/types/model/game";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import GamePreview from "./game-preview";
import { tempLeagueId } from "@/data/temp";
import {
	GamePrimaryKey,
	PaginatedGamesResponse,
} from "@/types/api/paginated-games";
import { Button } from "../ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Player } from "@/types/model/player";

interface GamesGalleryProps {
	title: string | undefined;
	startDate: Date | undefined;
	endDate: Date | undefined;
	players: Player[];
}

export default function GamesGallery(props: GamesGalleryProps) {
	const [games, setGames] = useState<Game[]>([]);
	const [isFetching, setIsFetching] = useState(true);
	const [page, setPage] = useState(0);
	const [pageKeys, setPageKeys] = useState<(GamePrimaryKey | undefined)[]>([
		undefined,
	]);

	const fetchGames = async (key: GamePrimaryKey | undefined) => {
		try {
			setIsFetching(true);
			const res = await fetch(
				`/api/ddb/${tempLeagueId}/games?exclusiveStartKey=${encodeURIComponent(
					JSON.stringify(key)
				)}&title=${props.title}&startDate=${props.startDate}&endDate=${
					props.endDate
				}&${props.players.map((p) => `playerIds[]=${p.playerId}`).join("&")}`
			);

			const { games, lastEvaluatedKey }: PaginatedGamesResponse =
				await res.json();

			setGames(games);
			setPageKeys((prevKeys) => {
				// case 1: if we're at the last item, append to end
				if (page === prevKeys.length - 1) {
					return [...prevKeys, lastEvaluatedKey];
				}

				// case 2: the next key should overwrite at an existing index
				else {
					const newKeys = [...prevKeys];
					newKeys[page + 1] = lastEvaluatedKey;
					return newKeys;
				}
			});

			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (error) {
			toast.error("Could not fetch games");
		} finally {
			setIsFetching(false);
		}
	};

	useEffect(() => {
		fetchGames(pageKeys[page]);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page, props]);

	return (
		<div className="w-full">
			{isFetching ? (
				<p>Loading...</p>
			) : games && games.length > 0 ? (
				<div className="w-full space-y-4">
					{/* games */}
					<div className="grid grid-cols-4 gap-3">
						{games.map((game, i) => (
							<GamePreview game={game} key={i} />
						))}
					</div>

					{/* pagination */}
					<div className="py-1 px-2 flex gap-1">
						<Button
							type="button"
							variant="outline"
							onClick={() => setPage(page - 1)}
							disabled={page === 0}
						>
							<ChevronLeftIcon />
						</Button>
						<Button
							type="button"
							variant="outline"
							onClick={() => setPage(page + 1)}
							disabled={!pageKeys[page + 1]}
						>
							<ChevronRightIcon />
						</Button>
					</div>
				</div>
			) : (
				<p>No games to display</p>
			)}
		</div>
	);
}
