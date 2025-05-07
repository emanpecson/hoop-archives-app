import { Player } from "@/types/model/player";
import { ChangeEvent, useEffect, useState } from "react";
import { Input } from "./ui/input";
import { ChevronLeftIcon, ChevronRightIcon, SearchIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useDebounceCallback } from "usehooks-ts";
import { Skeleton } from "./ui/skeleton";

type PageKey = {
	playerId: string;
};

interface PlayerListProps {
	onSelect: (player: Player | null) => void;
	selectedPlayerId: string | null;
}

export default function PlayerList(props: PlayerListProps) {
	const [isLoading, setIsLoading] = useState(true);
	const [players, setPlayers] = useState<Player[]>([]);
	const [search, setSearch] = useState("");
	const [tempSearch, setTempSearch] = useState("");

	// maintain for n+1 pages;
	// first page is undefined to not specify a start-key;
	// an index w/ a key means there's data to be displayed past the init page;
	// last page is undefined to indicate there's no more data to dipslay;
	const [pageKeys, setPageKeys] = useState<(PageKey | undefined)[]>([
		undefined,
	]);
	const [page, setPage] = useState(0);

	const debounceSetSearch = useDebounceCallback(setSearch, 300);

	const handleSearch = (ev: ChangeEvent<HTMLInputElement>) => {
		setTempSearch(ev.target.value);
		debounceSetSearch(ev.target.value);
	};

	const fetchPlayers = async (key: PageKey | undefined) => {
		try {
			setIsLoading(true);

			// encode param so it can later be parsed as an object
			const res = await fetch(
				`/api/s3/ddb/players?search=${search}&exclusiveStartKey=${encodeURIComponent(
					JSON.stringify(key)
				)}`
			);
			const { Items, LastEvaluatedKey } = await res.json();

			setPlayers(Items);
			setPageKeys((prevKeys) => {
				// case 1: if we're at the last item, append to end
				if (page === prevKeys.length - 1) {
					return [...prevKeys, LastEvaluatedKey];
				}

				// case 2: the next key should overwrite at an existing index
				else {
					const newKeys = [...prevKeys];
					newKeys[page + 1] = LastEvaluatedKey;
					return newKeys;
				}
			});
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchPlayers(pageKeys[page]);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page, search]);

	return (
		<div className="rounded-md bg-input-background/70 border border-input-border inset-shadow-sm inset-shadow-input-border/40 divide-y divide-input-border">
			{/* search input */}
			<Input
				onChange={handleSearch}
				value={tempSearch}
				Icon={SearchIcon}
				placeholder="Search player (then click player to add)"
				className="rounded-b-none bg-none border-none"
			/>

			{/* list body */}
			<ul>
				{isLoading ? (
					new Array(4).fill(0).map((_, i) => (
						<li key={i}>
							<Skeleton />
						</li>
					))
				) : players.length > 0 ? (
					players.map((player, i) => (
						<li
							key={i}
							className="px-3 py-2 flex place-items-center justify-between hover:bg-neutral-800/20 cursor-pointer"
							onClick={() =>
								props.onSelect(
									props.selectedPlayerId === player.playerId ? null : player
								)
							}
						>
							<div className="flex place-items-center gap-2">
								<div className="rounded-full w-6 h-6 bg-neutral-800" />
								<p className="text-sm flex gap-2">
									<span>
										{player.firstName} {player.lastName}
									</span>
									{props.selectedPlayerId === player.playerId && (
										<span>(Selected)</span>
									)}
								</p>
							</div>
						</li>
					))
				) : (
					<div>No data</div>
				)}
			</ul>

			{/* pagination */}
			<div className="py-1 px-2 flex justify-end gap-1">
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
	);
}
