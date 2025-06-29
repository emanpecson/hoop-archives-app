"use client";

import GameFilters from "@/components/game/game-filters";
import GamesGallery from "@/components/game/games-gallery";
import { tempLeagueId } from "@/data/temp";
import { Player } from "@/types/model/player";
import { useState } from "react";

export default function DashboardPage() {
	const [title, setTitle] = useState<string | undefined>(undefined);
	const [startDate, setStartDate] = useState<Date | undefined>(undefined);
	const [endDate, setEndDate] = useState<Date | undefined>(undefined);
	const [players, setPlayers] = useState<Player[]>([]);

	return (
		<div className="space-y-4 w-full mx-auto max-w-[100rem]">
			<GameFilters
				leagueId={tempLeagueId}
				title={title}
				setTitle={setTitle}
				startDate={startDate}
				setStartDate={setStartDate}
				endDate={endDate}
				setEndDate={setEndDate}
				players={players}
				setPlayers={setPlayers}
			/>
			<GamesGallery
				title={title}
				startDate={startDate}
				endDate={endDate}
				players={players}
			/>
		</div>
	);
}
