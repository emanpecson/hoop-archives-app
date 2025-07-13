"use client";

import { Game } from "@/types/model/game";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import GamePreview from "./game-preview";
import {
	GamePrimaryKey,
	PaginatedGamesResponse,
} from "@/types/api/paginated-games";
import { Player } from "@/types/model/player";
import LoadingPrompt from "../loading-prompt";
import EmptyPrompt from "../empty-prompt";
import Pagination from "../pagination";

interface GamesGalleryProps {
	leaugeId: string;
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
				`/api/ddb/${
					props.leaugeId
				}/games?exclusiveStartKey=${encodeURIComponent(
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
				<LoadingPrompt text="Loading Games" />
			) : games && games.length > 0 ? (
				<div className="w-full space-y-4">
					{/* games */}
					<div className="grid grid-cols-4 gap-3">
						{games.map((game, i) => (
							<GamePreview game={game} key={i} />
						))}
					</div>

					<Pagination
						onPrevious={() => setPage(page - 1)}
						previousDisabled={page === 0}
						onNext={() => setPage(page + 1)}
						nextDisabled={!pageKeys[page + 1]}
					/>
				</div>
			) : (
				<EmptyPrompt text="No games to display" />
			)}
		</div>
	);
}
