import { cn } from "@/lib/utils";
import { Player } from "@/types/model/player";
import { Button } from "@/components/ui/button";

interface PlayerSlotProps {
	player: Player | null;
	selectedPlayer: Player | null;
	onUpdate: () => void;
}

export default function PlayerSlot(props: PlayerSlotProps) {
	return (
		<Button
			type="button"
			variant="input"
			onClick={
				props.selectedPlayer || props.player ? props.onUpdate : undefined
			}
		>
			<div
				className={cn(
					"flex place-items-center gap-2",
					props.player ? "text-white" : "text-input-muted"
				)}
			>
				{/* <UserCircle2Icon size={16} /> */}
				<p className="text-sm">
					{props.player
						? `${props.player.firstName} ${props.player.lastName}`
						: "Player not selected"}
				</p>
			</div>
		</Button>
	);
}
