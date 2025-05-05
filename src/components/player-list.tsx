import { Player } from "@/types/model/player";

import { ChangeEvent, useEffect, useState } from "react";
import { Input } from "./ui/input";
import { SearchIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useDebounceCallback } from "usehooks-ts";

export default function PlayerList() {
	const [players, setPlayers] = useState<Player[]>([]);
	const [search, setSearch] = useState("");
	const [tempSearch, setTempSearch] = useState("");
	const [lastEvaluatedKey, setLastEvaluatedKey] = useState();

	const debounceSetSearch = useDebounceCallback(setSearch, 300);

	const handleSearch = (ev: ChangeEvent<HTMLInputElement>) => {
		setTempSearch(ev.target.value);
		debounceSetSearch(ev.target.value);
	};

	const fetchPlayers = async () => {
		// encode param so it can later be parsed as an object
		const res = await fetch(
			`/api/s3/ddb/players?search=${search}&exclusiveStartKey=${encodeURIComponent(
				JSON.stringify(lastEvaluatedKey)
			)}`
		);
		const { Items, LastEvaluatedKey } = await res.json();

		console.log("data:", Items, LastEvaluatedKey);
		setPlayers(Items);
		setLastEvaluatedKey(LastEvaluatedKey);
	};

	useEffect(() => {
		fetchPlayers();
	}, [search]);

	return (
		<div className="rounded-md bg-input-background/70 border border-input-border inset-shadow-sm inset-shadow-input-border/40 divide-y divide-input-border">
			{/* search input */}
			<Input
				onChange={handleSearch}
				value={tempSearch}
				Icon={SearchIcon}
				placeholder="Search player"
				className="rounded-b-none bg-none border-none"
			/>

			{/* list body */}
			<ul>
				{players.map((player, i) => (
					<li
						key={i}
						className="px-3 py-2 flex place-items-center justify-between"
					>
						<div className="flex place-items-center gap-2">
							<div className="rounded-full w-6 h-6 bg-neutral-800" />
							<span>
								{player.firstName} {player.lastName}
							</span>
						</div>

						{/* actions */}
						<div>
							<Button type="button">Team 1</Button>
							<Button type="button">Team 2</Button>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}
