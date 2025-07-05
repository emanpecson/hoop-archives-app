"use client";

import ClipDialog from "@/components/clip-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { GameClip } from "@/types/model/game-clip";
import { Player } from "@/types/model/player";
import { EllipsisVerticalIcon } from "lucide-react";
import { useState } from "react";

interface HighlightClipRowProps {
	index: number;
	activeClipId: string | null;
	clip: GameClip;
	onSelect: (clip: GameClip) => void;
	selectedClips: GameClip[];
}

export default function HighlightClipRow(props: HighlightClipRowProps) {
	const [clipIndexOpen, setClipIndexOpen] = useState<number | null>(null);
	const { clip } = props;

	const handleClipOpen = (open: boolean) => {
		if (!open) setClipIndexOpen(null);
	};
	const playerName = (player: Player) =>
		`${player.firstName[0]}. ${player.lastName}`;

	const checked = props.selectedClips.some((sc) => sc.clipId === clip.clipId);
	const playing = props.activeClipId && props.activeClipId === clip.clipId;
	const length = `${(clip.endTime - clip.startTime).toFixed(1)}s`;
	const date = new Date(clip.date).toLocaleDateString();

	const primaryPlayer = clip.offense
		? playerName(clip.offense.playerScoring)
		: playerName(clip.defense!.playerDefending);

	const homePlayers: string[] = [primaryPlayer];
	let awayPlayers: string[] = [];

	if (clip.offense) {
		const assister = clip.offense.playerAssisting;
		if (assister) homePlayers.push(playerName(assister));

		const defenders = clip.offense.playersDefending;
		if (defenders && defenders.length > 0)
			awayPlayers = defenders.map((def) => playerName(def));
	} else if (clip.defense) {
		const offender = clip.defense.playerStopped;
		if (offender) awayPlayers.push(playerName(offender));
	}

	return (
		<tr className={cn(playing && "bg-blue-500/10 text-blue-400", "text-sm")}>
			<td className="px-4 py-1">
				<div className="flex place-items-center justify-center">
					<Checkbox
						checked={checked}
						onCheckedChange={() => props.onSelect(clip)}
					/>
				</div>
			</td>
			<td className="px-4 py-1.5 text-left">{clip.clipId}</td>
			<td className="px-4 py-1.5 text-left">{date}</td>
			<td className="px-4 py-1.5 text-left">{length}</td>
			<td className="px-4 py-1.5 text-left max-w-[16rem]">
				{clip.tags.join(" ")}
			</td>
			<td className="px-4 py-1.5 text-left max-w-[16rem]">
				<div className="space-x-1.5">
					<span>{homePlayers.join(" + ")}</span>
					{awayPlayers.length > 0 && (
						<>
							<span className="text-neutral-500">vs</span>
							<span>{awayPlayers.join(" + ")}</span>
						</>
					)}
				</div>
			</td>
			<td className="px-4 py-1.5 text-right">
				<Button
					variant="ghost"
					className="rounded-full size-7"
					onClick={() => setClipIndexOpen(props.index)}
				>
					<EllipsisVerticalIcon />
				</Button>
			</td>

			<ClipDialog
				clip={clip}
				open={clipIndexOpen === props.index}
				setOpen={handleClipOpen}
				toggleClipSelection={props.onSelect}
				isSelected={checked}
			/>
		</tr>
	);
}
