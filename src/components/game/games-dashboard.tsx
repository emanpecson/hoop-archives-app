"use client";

import GameFilters from "@/components/game/game-filters";
import GamesGallery from "@/components/game/games-gallery";
import NewGameDialog from "@/components/new-game/new-game-dialog";
import { Button } from "@/components/ui/button";
import { Player } from "@/types/model/player";
import { FolderPlusIcon } from "lucide-react";
import { useState } from "react";

interface GamesDashboardProps {
	leagueId: string;
}

export default function GamesDashboard(props: GamesDashboardProps) {
	const [title, setTitle] = useState<string | undefined>(undefined);
	const [startDate, setStartDate] = useState<Date | undefined>(undefined);
	const [endDate, setEndDate] = useState<Date | undefined>(undefined);
	const [players, setPlayers] = useState<Player[]>([]);
	const [newGameDialogOpen, setNewGameDialogOpen] = useState(false);

	return (
		<>
			<div className="space-y-4 w-full mx-auto max-w-[100rem]">
				<div className="flex space-x-2 place-items-center">
					<GameFilters
						leagueId={props.leagueId}
						title={title}
						setTitle={setTitle}
						startDate={startDate}
						setStartDate={setStartDate}
						endDate={endDate}
						setEndDate={setEndDate}
						players={players}
						setPlayers={setPlayers}
					/>
					<Button
						className="w-fit"
						variant="input"
						onClick={() => setNewGameDialogOpen(true)}
					>
						<FolderPlusIcon />
						<span>New game</span>
					</Button>
				</div>
				<GamesGallery
					leaugeId={props.leagueId}
					title={title}
					startDate={startDate}
					endDate={endDate}
					players={players}
				/>
			</div>

			<NewGameDialog open={newGameDialogOpen} setOpen={setNewGameDialogOpen} />
		</>
	);
}
