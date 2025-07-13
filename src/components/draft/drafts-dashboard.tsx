"use client";

import { useState } from "react";
import NewGameDialog from "../new-game/new-game-dialog";
import { Button } from "../ui/button";
import { FolderPlusIcon } from "lucide-react";

interface DraftsDashboardProps {
	leagueId: string;
}

export default function DraftsDashboard(props: DraftsDashboardProps) {
	const [newGameDialogOpen, setNewGameDialogOpen] = useState(false);

	return (
		<>
			<div className="space-y-4 w-full mx-auto max-w-[100rem]">
				<Button
					className="w-fit"
					variant="input"
					onClick={() => setNewGameDialogOpen(true)}
				>
					<FolderPlusIcon />
					<span>New game</span>
				</Button>

				<DraftsDashboard leagueId={props.leagueId} />
			</div>

			<NewGameDialog open={newGameDialogOpen} setOpen={setNewGameDialogOpen} />
		</>
	);
}
