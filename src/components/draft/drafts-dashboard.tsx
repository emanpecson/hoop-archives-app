"use client";

import NewGameDialog from "../new-game/new-game-dialog";
import { Button } from "../ui/button";
import { FolderPlusIcon } from "lucide-react";
import DraftsGallery from "./drafts-gallery";

interface DraftsDashboardProps {
	leagueId: string;
}

export default function DraftsDashboard(props: DraftsDashboardProps) {
	return (
		<div className="space-y-4 w-full mx-auto max-w-[100rem]">
			<NewGameDialog>
				<Button className="w-fit" variant="input">
					<FolderPlusIcon />
					<span>New game</span>
				</Button>
			</NewGameDialog>

			<DraftsGallery leagueId={props.leagueId} />
		</div>
	);
}
